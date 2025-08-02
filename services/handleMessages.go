package services

import ()

func HandleMessage(client Client, message JSONMessage) (bool, error) {
	switch message.Type {
	case "ping":
		client.SendMessage(JSONMessage{Type: "pong", Data: nil})
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
