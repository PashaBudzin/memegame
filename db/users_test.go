package db_test

import (
	"github.com/PashaBudzin/memegame/db"
	"testing"
)

func TestUser_LeaveRoom(t *testing.T) {
	t.Run("deletes room if none users left", func(t *testing.T) {
		user := db.CreateUser("test_user", "1")
		room := db.CreateRoom(user)

		roomId := room.GetId()

		user.LeaveRoom()

		if db.GetRoomById(roomId) != nil {
			t.Errorf("room wasn't deleted")
		}
	})

	t.Run("leaves room if there are users left", func(t *testing.T) {
		user1 := db.CreateUser("test_user", "1")
		user2 := db.CreateUser("test_user", "1")

		room := db.CreateRoom(user1)
		user2.JoinRoom(room.GetId())

		if len(room.Users) != 2 {
			t.Errorf("room doesn't have 2 users")
		}

		roomId := room.GetId()

		user1.LeaveRoom()

		if db.GetRoomById(roomId) == nil {
			t.Errorf("room was deleted")
		}
	})
}
