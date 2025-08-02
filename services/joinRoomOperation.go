package services

import (
	"encoding/json"
	"fmt"

	"github.com/PashaBudzin/memegame/db"
)

type joinRoomOperation struct {
	roomId int `json:"roomId"`
}

func handleJoinRoomOperation(client Client, message JSONMessage) (bool, error) {
	var data joinRoomOperation

	err := json.Unmarshal(message.Data, &data)

	if err != nil {
		return false, fmt.Errorf("invalid json in data")
	}

	if client.User == nil {
		return false, fmt.Errorf("client doesn't have user attached")
	}

	room := db.GetRoomById(data.roomId)

	if room == nil {
		return false, fmt.Errorf("room doesn't exist")
	}

	err = client.User.JoinRoom(room.GetId())

	if err != nil {
		return false, err
	}

	client.SendOk()

	return true, nil
}
