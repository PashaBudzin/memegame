package services

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/PashaBudzin/memegame/db"
)

type StartGameOperation struct {
	GameType      string `json:"gameType"`
	RoundModifier int    `json:"roundModifier"`
}

func handleStartGameOpearation(client *db.Client, message db.JSONMessage) (bool, error) {
	if client.User.CurrentRoom().OwnerId != client.User.Id {
		client.SendError("start-game", "user doesn't have permissions to start game")
		return false, fmt.Errorf("User doesn't have permissions to start game")
	}

	var startGameOpearation StartGameOperation

	err := json.Unmarshal(message.Data, &startGameOpearation)

	if err != nil {
		client.SendError("start-game", "invalid data")
		return false, fmt.Errorf("Failed to Unmarshal data")
	}

	client.SendOk("start-game", nil)

	switch startGameOpearation.GameType {
	case "classic":
		startClassicGame(client, 10)
	case "test":
		startTestGame(client, 10)
	default:
		client.SendError("start-game", "invalid game type")
		return false, fmt.Errorf("Invalid game type")
	}

	return true, nil
}

func startClassicGame(client *db.Client, roundCountModifier int) (bool, error) {
	panic("unimplemented")
}

func startTestGame(client *db.Client, _ int) (bool, error) {
	game := []*db.Round{{Type: "text", LengthSeconds: 100, Submissions: map[string]db.Submission{}}}

	ok, err := client.User.CurrentRoom().StartGame(game)

	if err != nil {
		log.Println(err.Error())
	}

	return ok, err
}
