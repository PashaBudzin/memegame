package db_test

import (
	"testing"

	"github.com/PashaBudzin/memegame/db"
)

func TestCreateRoom(t *testing.T) {
	t.Run("Creates room", func(t *testing.T) {
		user := db.CreateUser("testuser")

		db.CreateRoom(user)

		if db.GetRoomById(1) == nil {
			t.Errorf("Expected to have room with id 1")
		}
	})
}

func CanModifyRoom(t *testing.T) {
	t.Run("Creates room", func(t *testing.T) {
		user := db.CreateUser("test")

		db.CreateRoom(user)

		user.Name = "test2"

		room := db.GetRoomById(1)

		if room.Users[0].Name != "test2" {
			t.Errorf("expected to modify user to have name test2")
		}
	})
}

func TestRoom_Delete(t *testing.T) {
	t.Run("No room after deletion", func(t *testing.T) {
		user := db.CreateUser("test_user")
		room := db.CreateRoom(user)

		roomId := room.GetId()

		room.Delete()

		if db.GetRoomById(roomId) != nil {
			t.Errorf("Expected to not have room after deletion")
		}
	})
}
