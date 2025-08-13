package db

type Submission interface {
	GetType() RoundType
}

type TextSubmission struct {
	Type string `json:"type"`
	Data string `json:"data"`
}

func (_ TextSubmission) GetType() RoundType {
	return TextRound
}
