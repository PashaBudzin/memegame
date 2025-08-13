package services

import (
	"encoding/json"
	"fmt"

	"github.com/PashaBudzin/memegame/db"
)

type AttachOperation struct {
	Type string          `json:"type"`
	Data json.RawMessage `json:"data"`
}

func handleAttachSubmissionOperation(client *db.Client, message db.JSONMessage) (bool, error) {
	var attachOperation AttachOperation

	err := json.Unmarshal(message.Data, &attachOperation)

	if err != nil {
		client.SendError("attach-submission", "failed to Unmarshal message")
		return false, fmt.Errorf("failed to Unmarshal data")
	}

	switch attachOperation.Type {
	case "text":
		ok, err := handleTextSubmission(client, attachOperation.Data)

		if err != nil {
			client.SendError("attach-submission", err.Error())
		} else {
			client.SendOk("attach-submission", nil)
		}

		return ok, err

	default:
		client.SendError("attach-submission", "invalid attachment type")
		return false, fmt.Errorf("invalid attachment type")
	}
}

func handleTextSubmission(client *db.Client, data json.RawMessage) (bool, error) {
	var content string

	err := json.Unmarshal(data, &content)

	if err != nil {
		return false, fmt.Errorf("failed to unmarshal data")
	}

	submission := db.TextSubmission{Data: content, Type: "text"}

	return client.User.AttachSubmission(submission)
}
