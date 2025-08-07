package db

import (
	"encoding/json"
	"fmt"
	"sync"

	"github.com/google/uuid"
)

type User struct {
	Id            string `json:"id"`
	Name          string `json:"name"`
	Inactive      bool   `json:"inactive"`
	currentRoomId *string
	clientId      string
	userMutex     sync.Mutex
}

var (
	usersMutex   sync.Mutex
	latestUserId = 1
)

func (u *User) GetId() string {
	return u.Id
}

func CreateUser(name string, client_id string) *User {
	usersMutex.Lock()
	user := User{Name: name, Id: uuid.NewString(), clientId: client_id}

	latestUserId += 1

	usersMutex.Unlock()
	return &user
}

func (u *User) JoinRoom(roomId string) error {
	u.userMutex.Lock()
	defer u.userMutex.Unlock()

	room := GetRoomById(roomId)

	if room == nil {
		return fmt.Errorf("no such room with id %s", roomId)
	}

	room.roomMutex.Lock()

	defer room.roomMutex.Unlock()

	for _, user := range room.Users {
		if user.Id == u.Id {
			return fmt.Errorf("user with id %s is already in room %s", u.Id, room.GetId())
		}
	}

	room.Users = append(room.Users, u)

	u.currentRoomId = &room.Id

	return nil
}

func (u *User) LeaveRoom() error {
	u.userMutex.Lock()
	defer u.userMutex.Unlock()

	room := GetRoomById(*u.currentRoomId)

	if room == nil {
		return fmt.Errorf("user's room doesn't exist")
	}

	room.roomMutex.Lock()

	defer room.roomMutex.Unlock()

	for i, user := range room.Users {
		if u.Id == user.Id {
			room.Users = append(room.Users[:i], room.Users[i+1:]...)
			break
		}
	}

	if len(room.Users) == 0 {
		room.Delete()
		u.currentRoomId = nil

		return nil
	}

	u.currentRoomId = nil

	any_user := room.Users[0]

	if any_user == nil {
		panic("expected room to have users left")
	}

	room.TransferRoomOwnership(any_user.Id)

	messageData := struct {
		Id         string `json:"id"`
		NewOwnerId string `json:"newOwnerId"`
	}{
		Id:         u.GetId(),
		NewOwnerId: any_user.GetId(),
	}

	jsonBytes, err := json.Marshal(messageData)

	if err != nil {
		panic("failed to marshal struct")
	}

	message := JSONMessage{
		Type: "user-left",
		Data: json.RawMessage(jsonBytes),
	}

	room.UnlockMutex()

	room.BroadcastMessage(message, &u.Id)

	room.LockMutex()

	return nil
}

func (u *User) CurrentRoom() *Room {
	if u.currentRoomId == nil {
		return nil
	}

	room, ok := rooms[*u.currentRoomId]

	if !ok {
		panic("user doesn't belong to room, but current_room_id isn't nil")
	}

	return room
}

func (u *User) GetClient() *Client {
	client := GetClientById(u.clientId)

	if client == nil {
		panic("no client attached")
	}

	return client
}
