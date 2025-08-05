package db

import (
	"encoding/json"
	"fmt"
	"log"
	"sync"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type JSONMessage struct {
	Type string          `json:"type"`
	Data json.RawMessage `json:"data"`
}

type Client struct {
	ID   string
	Conn *websocket.Conn
	User *User
}

var (
	clientsMutex sync.Mutex
	clients      = make(map[string]*Client)
)

func NewClient(conn *websocket.Conn) *Client {
	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	client := &Client{
		ID:   uuid.NewString(),
		Conn: conn,
		User: nil,
	}

	clients[client.ID] = client

	return client
}

func (c *Client) SendMessage(message JSONMessage) (bool, error) {
	data, err := json.Marshal(message)

	if err != nil {
		return false, err
	}

	log.Println("sending message to client", c.ID, "with type", message.Type)

	if err := c.Conn.WriteMessage(websocket.TextMessage, data); err != nil {
		return false, err
	}

	return true, nil
}

func (c *Client) SendOk(reason string, data any) (bool, error) {
	messageBytes, err := json.Marshal(data)

	if err != nil {
		c.SendError(reason, "failed to marshal data for ok message")
		log.Printf("failed to marshal data for ok message for client %s: %v", c.ID, err)

		return false, fmt.Errorf("failed to marshal data for ok message")
	}

	return c.SendMessage(JSONMessage{Type: "ok-" + reason, Data: json.RawMessage(messageBytes)})
}

func (c *Client) SendError(reason string, message string) (bool, error) {
	msg, err := json.Marshal(message)

	if err != nil {
		return false, fmt.Errorf("failed to marshal error message")
	}

	return c.SendMessage(JSONMessage{Type: "error-" + reason, Data: msg})
}

func (c *Client) AttachNewUser(name string) (*User, error) {
	if c.User != nil {
		return nil, fmt.Errorf("client already has a user attached")
	}

	user := CreateUser(name, c.ID)
	c.User = user

	return user, nil
}

func GetClientById(id string) *Client {
	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	client, exists := clients[id]
	if !exists {
		return nil
	}

	return client
}
