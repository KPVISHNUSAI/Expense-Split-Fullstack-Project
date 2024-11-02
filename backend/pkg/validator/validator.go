// pkg/validator/validator.go

package validator

import (
	"regexp"
	"strings"
)

type Validator struct {
	emailRegex *regexp.Regexp
}

func NewValidator() *Validator {
	return &Validator{
		emailRegex: regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`),
	}
}

func (v *Validator) ValidateEmail(email string) bool {
	return v.emailRegex.MatchString(email)
}

func (v *Validator) ValidatePassword(password string) bool {
	return len(password) >= 8
}

func (v *Validator) ValidateName(name string) bool {
	return len(strings.TrimSpace(name)) > 0
}
