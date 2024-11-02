// internal/models/settlement.go

package models

import (
	"time"

	"github.com/google/uuid"
)

type SettlementStatus string

const (
	SettlementStatusPending   SettlementStatus = "PENDING"
	SettlementStatusCompleted SettlementStatus = "COMPLETED"
	SettlementStatusCancelled SettlementStatus = "CANCELLED"
)

type SettlementFrequency string

const (
	FrequencyOneTime SettlementFrequency = "ONE_TIME"
	FrequencyMonthly SettlementFrequency = "MONTHLY"
)

type Settlement struct {
	ID          uuid.UUID           `json:"id" gorm:"type:uuid;primary_key"`
	FromUserID  uuid.UUID           `json:"from_user_id" gorm:"type:uuid;not null"`
	ToUserID    uuid.UUID           `json:"to_user_id" gorm:"type:uuid;not null"`
	Amount      float64             `json:"amount" gorm:"not null"`
	Status      SettlementStatus    `json:"status" gorm:"type:varchar(20);not null"`
	GroupID     uuid.UUID           `json:"group_id" gorm:"type:uuid;not null"`
	Description string              `json:"description"`
	Deadline    *time.Time          `json:"deadline"`
	IsRecurring bool                `json:"is_recurring" gorm:"default:false"`
	Frequency   SettlementFrequency `json:"frequency" gorm:"type:varchar(20)"`
	FromUser    User                `json:"from_user" gorm:"foreignKey:FromUserID"`
	ToUser      User                `json:"to_user" gorm:"foreignKey:ToUserID"`
	Group       Group               `json:"group" gorm:"foreignKey:GroupID"`
	CreatedAt   time.Time           `json:"created_at"`
	UpdatedAt   time.Time           `json:"updated_at"`
}
