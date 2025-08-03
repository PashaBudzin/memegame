package services

import (
	"fmt"
)

func handleLeaveRoomOpeartion(client Client, _ JSONMessage) (bool, error) {
	room := client.User.CurrentRoom()

	if room == nil {
		return false, fmt.Errorf("room doesn't exist")
	}

	return true, nil
}
