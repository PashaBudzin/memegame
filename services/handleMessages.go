package services

func HandleMessage(client Client, message JSONMessage) (bool, error) {
	switch message.Type {
	case "ping":
		client.SendMessage(JSONMessage{Type: "pong", Data: nil})
	}

	return true, nil
}
