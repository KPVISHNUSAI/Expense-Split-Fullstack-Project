// internal/models/expense.go
package models

import (
	"time"

	"github.com/google/uuid"
)

type Expense struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primary_key"`
	GroupID     uuid.UUID `json:"group_id" gorm:"type:uuid;not null"`
	PaidBy      uuid.UUID `json:"paid_by" gorm:"type:uuid;not null"`
	Amount      float64   `json:"amount" gorm:"not null"`
	Description string    `json:"description" gorm:"not null"`
	Splits      []Split   `json:"splits" gorm:"foreignKey:ExpenseID"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Split struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primary_key"`
	ExpenseID uuid.UUID `json:"expense_id" gorm:"type:uuid;not null"`
	UserID    uuid.UUID `json:"user_id" gorm:"type:uuid;not null"`
	Amount    float64   `json:"amount" gorm:"not null"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
