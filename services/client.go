package services

import (
	"encoding/json"
	"fmt"

	"github.com/PashaBudzin/memegame/db"
	"github.com/gorilla/websocket"
)

type JSONMessage struct {
	Type string          `json:"type"`
	Data json.RawMessage `json:"data"`
}

type Client struct {
	ID   string
	Conn *websocket.Conn
	User *db.User
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
