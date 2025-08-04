package services

import (
	"log"

	"github.com/PashaBudzin/memegame/db"
)

func HandleMessage(client db.Client, message db.JSONMessage) (bool, error) {
	log.Printf("handling operation with type %s from user %s", message.Type, client.ID)

	switch message.Type {
	case "ping":
		client.SendMessage(db.JSONMessage{Type: "pong", Data: nil})
		return true, nil

	case "attach-user":
		return handleAttachUserOperation(client, message)

	case "join-room":
		return handleJoinRoomOperation(client, message)

	case "leave-room":
		return handleLeaveRoomOpeartion(client, message)

	}

	return false, nil
}
