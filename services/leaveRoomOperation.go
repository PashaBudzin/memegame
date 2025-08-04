package services

import (
	"fmt"

	"github.com/PashaBudzin/memegame/db"
)

func handleLeaveRoomOpeartion(client db.Client, _ db.JSONMessage) (bool, error) {
	room := client.User.CurrentRoom()

	if room == nil {
		return false, fmt.Errorf("room doesn't exist")
	}

	return true, nil
}
