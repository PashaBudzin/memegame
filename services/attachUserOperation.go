package services

import (
	"encoding/json"
	"fmt"

	"github.com/PashaBudzin/memegame/db"
)

type attachOperationData struct {
	Name string `json:"name"`
}

func handleAttachUserOperation(client Client, message JSONMessage) (bool, error) {
	var data attachOperationData

	err := json.Unmarshal(message.Data, &data)

	if err != nil {
		return false, fmt.Errorf("invalid json in data")
	}

	user := db.CreateUser(data.Name)
	client.User = user

	client.SendOk()

	return true, nil
}
