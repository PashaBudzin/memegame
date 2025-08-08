package db

import (
	"encoding/json"
	"fmt"
)

type RoundType string

const (
	TextRound RoundType = "text"
	DrawRound RoundType = "draw"
)

func (rt *RoundType) UnmarshalJSON(data []byte) error {
	var s string

	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}

	switch RoundType(s) {
	case TextRound, DrawRound:
		*rt = RoundType(s)
		return nil
	default:
		return fmt.Errorf("invalid RoundType: %q", s)
	}
}

func (rt RoundType) String() string {
	return string(rt)
}

type Round struct {
	Type          RoundType             `json:"type"`
	LengthSeconds int64                 `json:"lengthSeconds"`
	Submissions   map[string]Submission `json:"submissions"`
}
