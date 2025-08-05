package services

import (
	"github.com/PashaBudzin/memegame/db"
)

func handleMeOperation(client *db.Client, _ db.JSONMessage) (bool, error) {
	if client.User == nil {
		return client.SendOk("me", nil)
	}

	var roomId string

	if room := client.User.CurrentRoom(); room != nil {
		roomId = room.GetId()
	}

	client.SendOk("me", struct {
		ID     string  `json:"id"`
		Name   string  `json:"name"`
		RoomId *string `json:"roomId"`
	}{
		ID:     client.User.GetId(),
		Name:   client.User.Name,
		RoomId: &roomId,
	})

	return true, nil
}
