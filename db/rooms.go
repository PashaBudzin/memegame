package db

import (
	"fmt"
	"log"
	"sync"

	"github.com/google/uuid"
)

type Room struct {
	Id        string  `json:"roomId"`
	Users     []*User `json:"users"`
	OwnerId   string  `json:"ownerId"`
	roomMutex sync.Mutex
}

var (
	rooms      = make(map[string]*Room)
	roomsMutex sync.Mutex
)

func (r *Room) GetId() string {
	return r.Id
}

func (r *Room) Delete() (bool, error) {
	roomsMutex.Lock()
	defer roomsMutex.Unlock()

	for _, u := range r.Users {
		u.userMutex.Lock()
		u.currentRoomId = nil
		u.userMutex.Unlock()
	}

	delete(rooms, r.Id)

	return true, nil
}

func CreateRoom(owner *User) (*Room, error) {
	owner.userMutex.Lock()
	roomsMutex.Lock()

	defer roomsMutex.Unlock()
	defer owner.userMutex.Unlock()

	if owner.CurrentRoom() != nil {
		return nil, fmt.Errorf("user is already in a room")
	}

	room := Room{uuid.New().String(), []*User{owner}, owner.Id, sync.Mutex{}}

	rooms[room.Id] = &room

	owner.currentRoomId = &room.Id

	return &room, nil
}

func GetRoomById(id string) *Room {
	roomsMutex.Lock()
	defer roomsMutex.Unlock()
	return rooms[id]
}

func (r *Room) TransferRoomOwnership(userId string) (bool, error) {
	for _, u := range r.Users {
		if u.Id == userId {
			r.OwnerId = userId

			return true, nil
		}
	}

	return false, fmt.Errorf("no such user with id %s", userId)
}

func (r *Room) BroadcastMessage(message JSONMessage, from_id *string) (bool, error) {
	r.roomMutex.Lock()
	defer r.roomMutex.Unlock()

	log.Printf("broadcasting message to %v from %v", message.Type, from_id)

	for _, user := range r.Users {
		log.Printf("broadcasting %s type to %s as part of broadcasting", message.Type, user.Id)
		if from_id != nil && *from_id == user.GetId() {
			continue
		}

		_, err := user.GetClient().SendMessage(message)

		if err != nil {
			log.Println("failed to send message to client")
		}
	}

	return true, nil
}

func (r *Room) LockMutex() {
	r.roomMutex.Lock()
}

func (r *Room) UnlockMutex() {
	r.roomMutex.Unlock()
}

func (r *Room) ClearInactiveUsers() {
	r.roomMutex.Lock()

	defer r.roomMutex.Unlock()

	for _, u := range r.Users {
		if u.Inactive {
			u.LeaveRoom()
		}
	}
}
