package db

import (
	"encoding/json"
	"fmt"
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

	if err := c.Conn.WriteMessage(websocket.TextMessage, data); err != nil {
		return false, err
	}

	return true, nil
}

func (c *Client) SendOk() (bool, error) {
	return c.SendMessage(JSONMessage{Type: "ok", Data: nil})
}

func (c *Client) SendError(message string) (bool, error) {
	msg, err := json.Marshal(message)

	if err != nil {
		return false, fmt.Errorf("failed to marshal error message")
	}

	return c.SendMessage(JSONMessage{Type: "error", Data: msg})
}

func (c *Client) AttachNewUser(name string) *User {
	user := CreateUser(name, c.ID)
	c.User = user

	return user
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
