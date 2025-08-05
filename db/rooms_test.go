package db_test

import (
	"fmt"
	"testing"

	"github.com/PashaBudzin/memegame/db"
)

func TestCreateRoom(t *testing.T) {
	t.Run("Creates room", func(t *testing.T) {
		user := db.CreateUser("testuser", "1")

		room := db.CreateRoom(user)

		fmt.Println(room.GetId())

		if db.GetRoomById(room.GetId()) == nil {
			t.Errorf("Expected to create room")
		}
	})
}

func CanModifyRoom(t *testing.T) {
	t.Run("Can modify users from room", func(t *testing.T) {
		user := db.CreateUser("test", "1")

		room := db.CreateRoom(user)

		user.Name = "test2"

		if room.Users[0].Name != "test2" {
			t.Errorf("expected to modify user to have name test2")
		}
	})
}

func TestRoom_Delete(t *testing.T) {
	t.Run("No room after deletion", func(t *testing.T) {
		user := db.CreateUser("test_user", "1")
		room := db.CreateRoom(user)

		roomId := room.GetId()

		room.Delete()

		if db.GetRoomById(roomId) != nil {
			t.Errorf("Expected to not have room after deletion")
		}
	})
}
