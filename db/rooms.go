package db

import (
	"fmt"
	"log"
	"sync"

	"github.com/google/uuid"
)

type Room struct {
	id        string
	Users     []*User
	Owner_id  string
	roomMutex sync.Mutex
}

var (
	rooms      = make(map[string]*Room)
	roomsMutex sync.Mutex
)

func (r *Room) GetId() string {
	return r.id
}

func (r *Room) Delete() (bool, error) {
	roomsMutex.Lock()
	defer roomsMutex.Unlock()

	for _, u := range r.Users {
		u.userMutex.Lock()
		u.current_room_id = nil
		u.userMutex.Unlock()
	}

	delete(rooms, r.id)

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

	room := Room{uuid.New().String(), []*User{owner}, owner.id, sync.Mutex{}}

	rooms[room.id] = &room

	owner.current_room_id = &room.id

	return &room, nil
}

func GetRoomById(id string) *Room {
	roomsMutex.Lock()
	defer roomsMutex.Unlock()
	return rooms[id]
}

func (r *Room) TransferRoomOwnership(userId string) (bool, error) {
	for _, u := range r.Users {
		if u.id == userId {
			r.Owner_id = userId

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
		if from_id != nil && *from_id == user.GetId() {
			continue
		}

		user.GetClient().SendMessage(message)
	}

	return true, nil
}

func (r *Room) LockMutex() {
	r.roomMutex.Lock()
}

func (r *Room) UnlockMutex() {
	r.roomMutex.Unlock()
}
