package services

import (
	"encoding/json"

	"github.com/gorilla/websocket"
)

type JSONMessage struct {
	Type string          `json:"type"`
	Data json.RawMessage `json:"data"`
}

type Client struct {
	ID   string
	Conn *websocket.Conn
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
