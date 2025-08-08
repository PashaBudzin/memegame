package db_test

import (
	"encoding/json"
	"testing"

	"github.com/PashaBudzin/memegame/db"
)

func TestRoundTypeUnmarshalJSON(t *testing.T) {
	tests := []struct {
		name      string
		input     string
		want      db.RoundType
		wantError bool
	}{
		{
			name:      "valid text",
			input:     `"text"`,
			want:      db.TextRound,
			wantError: false,
		},
		{
			name:      "valid draw",
			input:     `"draw"`,
			want:      db.DrawRound,
			wantError: false,
		},
		{
			name:      "invalid value",
			input:     `"banana"`,
			wantError: true,
		},
		{
			name:      "not a string",
			input:     `123`,
			wantError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var rt db.RoundType

			err := json.Unmarshal([]byte(tt.input), &rt)

			if tt.wantError {
				if err == nil {
					t.Errorf("expected error, got nil (value: %v)", rt)
				}
				return
			}

			if err != nil {
				t.Errorf("unexpected error: %v", err)
				return
			}

			if rt != tt.want {
				t.Errorf("expected %q, got %q", tt.want, rt)
			}
		})
	}
}
