// internal/services/container.go

package services

import (
	"expense-split-app/internal/config"
	"expense-split-app/internal/repositories"

	"gorm.io/gorm"
)

// Container holds all services
type Container struct {
	Auth       *AuthService
	User       *UserService
	Group      *GroupService
	Expense    *ExpenseService
	Settlement *SettlementService
}

// NewContainer creates a new container with all services
func NewContainer(db *gorm.DB, cfg *config.Config) *Container {
	// Initialize repositories
	userRepo := repositories.NewUserRepository(db)
	groupRepo := repositories.NewGroupRepository(db)
	expenseRepo := repositories.NewExpenseRepository(db)
	settlementRepo := repositories.NewSettlementRepository(db)

	// Initialize services
	return &Container{
		Auth:       NewAuthService(userRepo, cfg),
		User:       NewUserService(userRepo),
		Group:      NewGroupService(groupRepo, userRepo),
		Expense:    NewExpenseService(expenseRepo, groupRepo, userRepo),
		Settlement: NewSettlementService(settlementRepo, expenseRepo, groupRepo, userRepo),
	}
}
