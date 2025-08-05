package services

import (
	"encoding/json"
	"fmt"

	"github.com/PashaBudzin/memegame/db"
)

type attachOperationData struct {
	Name string `json:"name"`
}

func handleAttachUserOperation(client *db.Client, message db.JSONMessage) (bool, error) {
	var data attachOperationData

	err := json.Unmarshal(message.Data, &data)

	if err != nil {
		return false, fmt.Errorf("invalid json in data")
	}

	_, err = client.AttachNewUser(data.Name)

	if err != nil {
		client.SendError("create-user", err.Error())

		return false, fmt.Errorf("failed to attach user")
	}

	client.SendOk("create-user")

	return true, nil
}
