// internal/services/expense_service.go

package services

import (
	"errors"
	"expense-split-app/internal/models"
	"expense-split-app/internal/repositories"

	"github.com/google/uuid"
)

type ExpenseService struct {
	expenseRepo *repositories.ExpenseRepository
	groupRepo   *repositories.GroupRepository
	userRepo    *repositories.UserRepository
}

func NewExpenseService(
	expenseRepo *repositories.ExpenseRepository,
	groupRepo *repositories.GroupRepository,
	userRepo *repositories.UserRepository,
) *ExpenseService {
	return &ExpenseService{
		expenseRepo: expenseRepo,
		groupRepo:   groupRepo,
		userRepo:    userRepo,
	}
}

// type CreateExpenseInput struct {
// 	GroupID     uuid.UUID          `json:"group_id" binding:"required"`
// 	PaidByID    uuid.UUID          `json:"paid_by_id" binding:"required"`
// 	Amount      float64            `json:"amount" binding:"required,gt=0"`
// 	Description string             `json:"description" binding:"required"`
// 	Splits      []CreateSplitInput `json:"splits" binding:"required,dive"`
// }

// type CreateSplitInput struct {
// 	UserID uuid.UUID `json:"user_id" binding:"required"`
// 	Amount float64   `json:"amount" binding:"required,gt=0"`
// }

// type UpdateExpenseInput struct {
// 	Amount      float64            `json:"amount" binding:"required,gt=0"`
// 	Description string             `json:"description" binding:"required"`
// 	Splits      []CreateSplitInput `json:"splits" binding:"required,dive"`
// }

// CreateExpense creates a new expense with splits
func (s *ExpenseService) CreateExpense(input CreateExpenseInput) (*models.Expense, error) {
	// Validate group exists
	group, err := s.groupRepo.GetByID(input.GroupID)
	if err != nil {
		return nil, errors.New("invalid group")
	}

	// Validate paid by user is in group
	paidByInGroup := false
	for _, user := range group.Users {
		if user.ID == input.PaidByID {
			paidByInGroup = true
			break
		}
	}
	if !paidByInGroup {
		return nil, errors.New("paying user not in group")
	}

	// Validate split amounts sum up to total
	var splitSum float64
	for _, split := range input.Splits {
		// Verify user is in group
		userInGroup := false
		for _, groupUser := range group.Users {
			if groupUser.ID == split.UserID {
				userInGroup = true
				break
			}
		}
		if !userInGroup {
			return nil, errors.New("split user not in group")
		}

		splitSum += split.Amount
	}

	if splitSum != input.Amount {
		return nil, errors.New("split amounts must equal total amount")
	}

	// Create expense with splits
	expense := &models.Expense{
		GroupID:     input.GroupID,
		PaidBy:      input.PaidByID,
		Amount:      input.Amount,
		Description: input.Description,
		Splits:      make([]models.Split, len(input.Splits)),
	}

	for i, split := range input.Splits {
		expense.Splits[i] = models.Split{
			UserID: split.UserID,
			Amount: split.Amount,
		}
	}

	if err := s.expenseRepo.Create(expense); err != nil {
		return nil, err
	}

	return expense, nil
}

// GetExpense retrieves an expense by ID
func (s *ExpenseService) GetExpense(expenseID uuid.UUID) (*models.Expense, error) {
	return s.expenseRepo.GetByID(expenseID)
}

// UpdateExpense updates an existing expense
func (s *ExpenseService) UpdateExpense(expenseID uuid.UUID, input UpdateExpenseInput) error {
	expense, err := s.expenseRepo.GetByID(expenseID)
	if err != nil {
		return err
	}

	// Validate split amounts
	var splitSum float64
	for _, split := range input.Splits {
		splitSum += split.Amount
	}

	if splitSum != input.Amount {
		return errors.New("split amounts must equal total amount")
	}

	// Update expense
	expense.Amount = input.Amount
	expense.Description = input.Description
	expense.Splits = make([]models.Split, len(input.Splits))

	for i, split := range input.Splits {
		expense.Splits[i] = models.Split{
			UserID: split.UserID,
			Amount: split.Amount,
		}
	}

	return s.expenseRepo.Update(expense)
}

// DeleteExpense deletes an expense
func (s *ExpenseService) DeleteExpense(expenseID uuid.UUID) error {
	return s.expenseRepo.Delete(expenseID)
}

// GetGroupExpenses gets all expenses for a group
func (s *ExpenseService) GetGroupExpenses(groupID uuid.UUID) ([]models.Expense, error) {
	return s.expenseRepo.GetByGroupID(groupID)
}

// GetUserExpenses gets all expenses for a user
func (s *ExpenseService) GetUserExpenses(userID uuid.UUID) ([]models.Expense, error) {
	return s.expenseRepo.GetUserExpenses(userID)
}
