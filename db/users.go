package db

import (
	"fmt"
	"sync"
)

type User struct {
	id              int
	Name            string
	current_room_id *int
	userMutex       sync.Mutex
}

var (
	usersMutex   sync.Mutex
	latestUserId = 1
)

func (u *User) GetId() int {
	return u.id
}

func CreateUser(name string) *User {
	usersMutex.Lock()
	user := User{Name: name, id: latestUserId}

	latestUserId += 1

	usersMutex.Unlock()
	return &user
}

func (u *User) JoinRoom(roomId int) error {
	u.userMutex.Lock()
	defer u.userMutex.Unlock()

	room := GetRoomById(roomId)

	if room == nil {
		return fmt.Errorf("no such room with id %d", roomId)
	}

	room.RoomMutex.Lock()

	defer room.RoomMutex.Unlock()

	for _, user := range room.Users {
		if user.id == u.id {
			return fmt.Errorf("user with id %d is already in room %d", u.id, room.GetId())
		}
	}

	room.Users = append(room.Users, u)

	u.current_room_id = &room.id

	return nil
}

func (u *User) LeaveRoom() error {
	u.userMutex.Lock()
	defer u.userMutex.Unlock()

	room := GetRoomById(*u.current_room_id)

	if room == nil {
		return fmt.Errorf("user's room doesn't exist")
	}

	room.RoomMutex.Lock()

	defer room.RoomMutex.Unlock()

	u.current_room_id = nil

	if len(room.Users) <= 1 {
		room.Delete()

		return nil
	}

	for i, user := range room.Users {
		if u.id == user.id {
			room.Users = append(room.Users[:i], room.Users[i+1:]...)
			break
		}
	}

	any_user := room.Users[0]

	if any_user == nil {
		panic("expected room to have users left")
	}

	room.TransferRoomOwnership(any_user.id)

	return nil
}

func (u *User) GetCurrentRoomId() int {
	return *u.current_room_id
}
