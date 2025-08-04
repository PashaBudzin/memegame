package db

import (
	"fmt"
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

func CreateRoom(owner *User) *Room {
	roomsMutex.Lock()
	room := Room{uuid.New().String(), []*User{owner}, owner.id, sync.Mutex{}}

	rooms[room.id] = &room

	owner.current_room_id = &room.id

	roomsMutex.Unlock()

	return &room
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
