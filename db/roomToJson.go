package db

import "encoding/json"

func (r *Room) RoomToJson() ([]byte, error) {
	r.LockMutex()
	defer r.UnlockMutex()

	return json.Marshal(r)
}
