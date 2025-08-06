package services

import (
	"encoding/json"
	"fmt"

	"github.com/PashaBudzin/memegame/db"
)

type SendMessageOperation struct {
	Message string `json:"message"`
}

func handleSendChatMessageOperation(client *db.Client, message db.JSONMessage) (bool, error) {
	if client.User == nil || client.User.CurrentRoom() == nil {
		client.SendError("send-message", "client doesn't have user attached or is not in a room")
		return false, fmt.Errorf("client doesn't have user attached or is not in a room")
	}

	var data SendMessageOperation
	err := json.Unmarshal(message.Data, &data)

	if err != nil {
		client.SendError("chat-message", "invalid json in data")
		return false, fmt.Errorf("failed to parse data")
	}

	room := client.User.CurrentRoom()

	messageData := struct {
		Message string `json:"message"`
		From    string `json:"from"`
	}{
		Message: data.Message,
		From:    client.User.GetId(),
	}

	messageBytes, err := json.Marshal(messageData)

	if err != nil {
		client.SendError("chat-message", "failed to marshal message data")
		return false, fmt.Errorf("failed to Marshal message data: %w", err)
	}

	_, err = room.BroadcastMessage(db.JSONMessage{
		Type: "got-message",
		Data: json.RawMessage(messageBytes),
	}, nil)

	if err != nil {
		return false, fmt.Errorf("faield to BroadcastMessage")
	}

	return client.SendOk("chat-message", nil)
}
