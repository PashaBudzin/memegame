package db

type Submission interface {
	GetType() RoundType
}

type TextSubmission struct {
	Text string `json:"text"`
}

func (_ TextSubmission) GetType() RoundType {
	return TextRound
}
