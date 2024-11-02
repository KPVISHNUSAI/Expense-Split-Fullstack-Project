// internal/services/interfaces.go

package services

import (
	"expense-split-app/internal/models"
	"time"

	"github.com/google/uuid"
)

type AuthServiceInterface interface {
	Register(input RegisterInput) (*AuthResponse, error)
	Login(input LoginInput) (*AuthResponse, error)
}

type UserServiceInterface interface {
	GetProfile(userID uuid.UUID) (*models.User, error)
	UpdateProfile(userID uuid.UUID, input UpdateUserInput) error
	ListUsers() ([]models.User, error)
}

type GroupServiceInterface interface {
	CreateGroup(input CreateGroupInput) (*models.Group, error)
	GetGroup(groupID uuid.UUID) (*models.Group, error)
	UpdateGroup(groupID uuid.UUID, input UpdateGroupInput) error
	DeleteGroup(groupID uuid.UUID) error
	AddUserToGroup(groupID, userID uuid.UUID) error
	RemoveUserFromGroup(groupID, userID uuid.UUID) error
	GetUserGroups(userID uuid.UUID) ([]models.Group, error)
}

type ExpenseServiceInterface interface {
	CreateExpense(input CreateExpenseInput) (*models.Expense, error)
	GetExpense(expenseID uuid.UUID) (*models.Expense, error)
	UpdateExpense(expenseID uuid.UUID, input UpdateExpenseInput) error
	DeleteExpense(expenseID uuid.UUID) error
	GetGroupExpenses(groupID uuid.UUID) ([]models.Expense, error)
	GetUserExpenses(userID uuid.UUID) ([]models.Expense, error)
}

type SettlementServiceInterface interface {
	CreateSettlement(input CreateSettlementInput) (*models.Settlement, error)
	GetSettlement(settlementID uuid.UUID) (*models.Settlement, error)
	UpdateSettlementStatus(settlementID uuid.UUID, status models.SettlementStatus) error
	GetGroupSettlements(groupID uuid.UUID) ([]models.Settlement, error)
	GetUserSettlements(userID uuid.UUID) ([]models.Settlement, error)
	GetPendingSettlements(userID uuid.UUID) ([]models.Settlement, error)
	CalculateGroupBalances(groupID uuid.UUID) (map[uuid.UUID]float64, error)
}

// Input/Output structures for services
type RegisterInput struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	Token string      `json:"token"`
	User  models.User `json:"user"`
}

type UpdateUserInput struct {
	Name  string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required,email"`
}

type CreateGroupInput struct {
	Name        string      `json:"name" binding:"required"`
	UserIDs     []uuid.UUID `json:"user_ids" binding:"required"`
	CreatedByID uuid.UUID   `json:"-"`
}

type UpdateGroupInput struct {
	Name string `json:"name" binding:"required"`
}

type CreateExpenseInput struct {
	GroupID     uuid.UUID          `json:"group_id" binding:"required"`
	PaidByID    uuid.UUID          `json:"paid_by_id" binding:"required"`
	Amount      float64            `json:"amount" binding:"required,gt=0"`
	Description string             `json:"description" binding:"required"`
	Splits      []CreateSplitInput `json:"splits" binding:"required,dive"`
}

type CreateSplitInput struct {
	UserID uuid.UUID `json:"user_id" binding:"required"`
	Amount float64   `json:"amount" binding:"required,gt=0"`
}

type UpdateExpenseInput struct {
	Amount      float64            `json:"amount" binding:"required,gt=0"`
	Description string             `json:"description" binding:"required"`
	Splits      []CreateSplitInput `json:"splits" binding:"required,dive"`
}

type CreateSettlementInput struct {
	FromUserID  uuid.UUID                  `json:"from_user_id" binding:"required"`
	ToUserID    uuid.UUID                  `json:"to_user_id" binding:"required"`
	GroupID     uuid.UUID                  `json:"group_id" binding:"required"`
	Amount      float64                    `json:"amount" binding:"required,gt=0"`
	Description string                     `json:"description"`
	Deadline    *time.Time                 `json:"deadline"`
	IsRecurring bool                       `json:"is_recurring"`
	Frequency   models.SettlementFrequency `json:"frequency"`
}
