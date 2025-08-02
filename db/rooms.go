package db

import (
	"fmt"
	"sync"
)

type Room struct {
	id        int
	Users     []*User
	Owner_id  int
	RoomMutex sync.Mutex
}

var (
	rooms        = make(map[int]*Room)
	roomsMutex   sync.Mutex
	latestRoomId = 1
)

func (r *Room) GetId() int {
	return r.id
}

func (r *Room) Delete() (bool, error) {
	roomsMutex.Lock()
	defer roomsMutex.Unlock()

	for _, u := range r.Users {
		u.current_room_id = nil
	}

	delete(rooms, r.id)

	return true, nil
}

func CreateRoom(owner *User) *Room {
	room := Room{latestRoomId, []*User{owner}, owner.id, sync.Mutex{}}

	roomsMutex.Lock()

	rooms[latestRoomId] = &room

	latestRoomId += 1

	roomsMutex.Unlock()

	return &room
}

func GetRoomById(id int) *Room {
	roomsMutex.Lock()
	defer roomsMutex.Unlock()
	return rooms[id]
}

func (r *Room) TransferRoomOwnership(userId int) (bool, error) {
	r.RoomMutex.Lock()
	defer roomsMutex.Unlock()

	for _, u := range r.Users {
		if u.id == userId {
			r.Owner_id = userId

			return true, nil
		}
	}

	return false, fmt.Errorf("no such user with id %d", userId)
}
