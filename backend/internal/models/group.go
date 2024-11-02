// internal/models/group.go
package models

import (
	"time"

	"github.com/google/uuid"
)

type Group struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primary_key"`
	Name      string    `json:"name" gorm:"not null"`
	CreatedBy uuid.UUID `json:"created_by" gorm:"type:uuid;not null"`
	Users     []User    `json:"users" gorm:"many2many:user_groups;"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
