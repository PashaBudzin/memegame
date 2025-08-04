package routes

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/PashaBudzin/memegame/db"
	"github.com/PashaBudzin/memegame/services"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[string]*db.Client)

func HandleWebsockets(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Upgrade error: %v", err)

		return
	}

	clientID := uuid.New().String()
	client := &db.Client{
		ID:   clientID,
		Conn: conn,
	}

	clients[clientID] = client

	defer func() {
		conn.Close()
		delete(clients, clientID)

		if client.User != nil {
			client.User.LeaveRoom()
		}
		log.Printf("connection with id %s disconnected", clientID)
	}()

	for {
		_, message, err := conn.ReadMessage()

		if err != nil {
			log.Println("error: ", err)
			break
		}

		log.Printf("recieved [%s]: %s", clientID, message)

		var msg db.JSONMessage

		if err := json.Unmarshal(message, &msg); err != nil {
			log.Printf("invalid JSON [%s] %s", clientID, message)

			reply := db.JSONMessage{
				Type: "error",
				Data: []byte("invalid JSON"),
			}

			if _, err := client.SendMessage(reply); err != nil {
				log.Printf("Write error [%s]: %v", clientID, err)
				break
			}

			continue
		}

		_, err = services.HandleMessage(*client, msg)

		if err != nil {
			log.Printf("error %v", err)
			if _, err = client.SendError(err.Error()); err != nil {
				log.Printf("failed to send error")
			}
		}
	}

}
