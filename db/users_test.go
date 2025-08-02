package db_test

import (
	"github.com/PashaBudzin/memegame/db"
	"testing"
)

func TestUser_LeaveRoom(t *testing.T) {
	t.Run("deletes room if none users left", func(t *testing.T) {
		user := db.CreateUser("test_user")
		room := db.CreateRoom(user)

		user.LeaveRoom(room.GetId())
	})
}
