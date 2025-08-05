package services

import (
	"encoding/json"
	"fmt"

	"github.com/PashaBudzin/memegame/db"
)

type joinRoomOperation struct {
	RoomId string `json:"roomId"`
}

func handleJoinRoomOperation(client *db.Client, message db.JSONMessage) (bool, error) {
	var data joinRoomOperation

	err := json.Unmarshal(message.Data, &data)

	if err != nil {
		return false, fmt.Errorf("invalid json in data")
	}

	if client.User == nil {
		client.SendError("join-room", "client doesn't have user attached")
		return false, fmt.Errorf("client doesn't have user attached")
	}

	room := db.GetRoomById(data.RoomId)

	if room == nil {
		client.SendError("join-room", "room doesn't exist")
		return false, fmt.Errorf("room doesn't exist")
	}

	err = client.User.JoinRoom(room.GetId())

	if err != nil {
		client.SendError("join-room", "failed to join room")
		return false, err
	}

	client.SendOk("join-room", nil)

	userId := client.User.GetId()

	type User struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}

	type Room struct {
		Users   []User `json:"users"`
		OwnerId string `json:"ownerId"`
	}

	roomUsers := make([]User, len(room.Users))

	for _, user := range room.Users {
		roomUsers = append(roomUsers, User{
			Id:   user.GetId(),
			Name: user.Name,
		})
	}

	roomData := Room{
		Users:   roomUsers,
		OwnerId: client.User.CurrentRoom().Owner_id,
	}

	jsonBytes, err := json.Marshal(roomData)

	room.BroadcastMessage(db.JSONMessage{
		Type: "user-joined",
		Data: json.RawMessage(jsonBytes),
	}, &userId)

	return true, nil
}
