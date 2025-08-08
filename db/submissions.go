package db

type Submission interface {
	GetType() string
}

type TextSubmission struct {
	Text string `json:"text"`
}

func (_ TextSubmission) GetType() RoundType {
	return TextRound
}
