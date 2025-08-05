package services

import (
	"fmt"
	"github.com/PashaBudzin/memegame/db"
)

func handleCreateRoomOperation(client *db.Client, _ db.JSONMessage) (bool, error) {
	if client.User == nil {
		client.SendError("create-room", "no user attached")
		return false, fmt.Errorf("no user attached")
	}

	room, _ := db.CreateRoom(client.User)

	if room == nil {
		client.SendError("create-room", "failed to create room")
		return false, fmt.Errorf("no user attached")
	}

	roomData, _, err := room.RoomToJson()

	if err != nil {
		client.SendError("create-room", err.Error())
		return false, err
	}

	client.SendOk("create-room", roomData)

	return true, nil
}
