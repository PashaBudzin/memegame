package services

import (
	"fmt"

	"github.com/PashaBudzin/memegame/db"
)

func handleLeaveRoomOpeartion(client Client, _ JSONMessage) (bool, error) {
	room := db.GetRoomById(client.User.GetCurrentRoomId())

	if room == nil {
		return false, fmt.Errorf("room doesn't exist")
	}

	return true, nil
}
