package db

import "encoding/json"

type JsonUser struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type JsonRoom struct {
	RoomId  string     `json:"roomId"`
	Users   []JsonUser `json:"users"`
	OwnerId string     `json:"ownerId"`
}

func (r *Room) RoomToJson() (JsonRoom, []byte, error) {

	roomUsers := make([]JsonUser, len(r.Users))

	r.LockMutex()

	for i, user := range r.Users {
		roomUsers[i] = JsonUser{
			Id:   user.GetId(),
			Name: user.Name,
		}
	}

	r.UnlockMutex()

	roomData := JsonRoom{
		RoomId:  r.GetId(),
		Users:   roomUsers,
		OwnerId: r.OwnerId,
	}

	jsonBytes, err := json.Marshal(roomData)

	return roomData, jsonBytes, err
}
