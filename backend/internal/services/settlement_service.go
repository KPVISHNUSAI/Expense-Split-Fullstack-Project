package services

import (
	"errors"
	"expense-split-app/internal/models"
	"expense-split-app/internal/repositories"
	"time"

	"github.com/google/uuid"
)

type SettlementService struct {
	settlementRepo *repositories.SettlementRepository
	expenseRepo    *repositories.ExpenseRepository
	groupRepo      *repositories.GroupRepository
	userRepo       *repositories.UserRepository
}

func NewSettlementService(
	settlementRepo *repositories.SettlementRepository,
	expenseRepo *repositories.ExpenseRepository,
	groupRepo *repositories.GroupRepository,
	userRepo *repositories.UserRepository,
) *SettlementService {
	return &SettlementService{
		settlementRepo: settlementRepo,
		expenseRepo:    expenseRepo,
		groupRepo:      groupRepo,
		userRepo:       userRepo,
	}
}

// type CreateSettlementInput struct {
// 	FromUserID  uuid.UUID                  `json:"from_user_id" binding:"required"`
// 	ToUserID    uuid.UUID                  `json:"to_user_id" binding:"required"`
// 	GroupID     uuid.UUID                  `json:"group_id" binding:"required"`
// 	Amount      float64                    `json:"amount" binding:"required,gt=0"`
// 	Description string                     `json:"description"`
// 	Deadline    *time.Time                 `json:"deadline"`
// 	IsRecurring bool                       `json:"is_recurring"`
// 	Frequency   models.SettlementFrequency `json:"frequency"`
// }

// CreateSettlement creates a new settlement
func (s *SettlementService) CreateSettlement(input CreateSettlementInput) (*models.Settlement, error) {
	if err := s.ValidateSettlement(input.FromUserID, input.ToUserID, input.GroupID, input.Amount); err != nil {
		return nil, err
	}

	settlement := &models.Settlement{
		FromUserID:  input.FromUserID,
		ToUserID:    input.ToUserID,
		GroupID:     input.GroupID,
		Amount:      input.Amount,
		Description: input.Description,
		Status:      models.SettlementStatusPending,
		Deadline:    input.Deadline,
		IsRecurring: input.IsRecurring,
		Frequency:   input.Frequency,
	}

	if err := s.settlementRepo.Create(settlement); err != nil {
		return nil, err
	}

	return settlement, nil
}

// GetSettlement retrieves a settlement by ID
func (s *SettlementService) GetSettlement(settlementID uuid.UUID) (*models.Settlement, error) {
	return s.settlementRepo.GetByID(settlementID)
}

// UpdateSettlementStatus updates the status of a settlement
func (s *SettlementService) UpdateSettlementStatus(settlementID uuid.UUID, status models.SettlementStatus) error {
	settlement, err := s.settlementRepo.GetByID(settlementID)
	if err != nil {
		return err
	}

	if status == models.SettlementStatusCompleted && settlement.IsRecurring {
		// Create next recurring settlement
		nextSettlement := &models.Settlement{
			FromUserID:  settlement.FromUserID,
			ToUserID:    settlement.ToUserID,
			GroupID:     settlement.GroupID,
			Amount:      settlement.Amount,
			Description: settlement.Description,
			Status:      models.SettlementStatusPending,
			IsRecurring: true,
			Frequency:   settlement.Frequency,
		}

		// Set next deadline if current settlement has a deadline
		if settlement.Deadline != nil {
			nextDeadline := calculateNextDeadline(*settlement.Deadline, settlement.Frequency)
			nextSettlement.Deadline = &nextDeadline
		}

		if err := s.settlementRepo.Create(nextSettlement); err != nil {
			return err
		}
	}

	return s.settlementRepo.UpdateStatus(settlementID, status)
}

// DeleteSettlement deletes a settlement
func (s *SettlementService) DeleteSettlement(settlementID uuid.UUID) error {
	return s.settlementRepo.Delete(settlementID)
}

// GetGroupSettlements gets all settlements for a group
func (s *SettlementService) GetGroupSettlements(groupID uuid.UUID) ([]models.Settlement, error) {
	return s.settlementRepo.GetByGroupID(groupID)
}

// GetUserSettlements gets all settlements for a user
func (s *SettlementService) GetUserSettlements(userID uuid.UUID) ([]models.Settlement, error) {
	return s.settlementRepo.GetUserSettlements(userID)
}

// GetPendingSettlements gets pending settlements for a user
func (s *SettlementService) GetPendingSettlements(userID uuid.UUID) ([]models.Settlement, error) {
	return s.settlementRepo.GetPendingSettlements(userID)
}

// CalculateGroupBalances calculates current balances for all users in a group
func (s *SettlementService) CalculateGroupBalances(groupID uuid.UUID) (map[uuid.UUID]float64, error) {
	expenses, err := s.expenseRepo.GetByGroupID(groupID)
	if err != nil {
		return nil, err
	}

	settlements, err := s.settlementRepo.GetByGroupID(groupID)
	if err != nil {
		return nil, err
	}

	balances := make(map[uuid.UUID]float64)

	// Calculate balances from expenses
	for _, expense := range expenses {
		balances[expense.PaidBy] += expense.Amount
		for _, split := range expense.Splits {
			balances[split.UserID] -= split.Amount
		}
	}

	// Adjust balances based on completed settlements
	for _, settlement := range settlements {
		if settlement.Status == models.SettlementStatusCompleted {
			balances[settlement.FromUserID] += settlement.Amount
			balances[settlement.ToUserID] -= settlement.Amount
		}
	}

	return balances, nil
}

// Helper function to calculate next deadline for recurring settlements
func calculateNextDeadline(currentDeadline time.Time, frequency models.SettlementFrequency) time.Time {
	switch frequency {
	case models.FrequencyMonthly:
		return currentDeadline.AddDate(0, 1, 0)
	default:
		return currentDeadline
	}
}

// ValidateSettlement validates if a settlement can be created
func (s *SettlementService) ValidateSettlement(fromUserID, toUserID, groupID uuid.UUID, amount float64) error {
	if amount <= 0 {
		return errors.New("settlement amount must be positive")
	}

	if fromUserID == toUserID {
		return errors.New("cannot create settlement between same user")
	}

	group, err := s.groupRepo.GetByID(groupID)
	if err != nil {
		return errors.New("invalid group")
	}

	fromUserInGroup, toUserInGroup := false, false
	for _, user := range group.Users {
		if user.ID == fromUserID {
			fromUserInGroup = true
		}
		if user.ID == toUserID {
			toUserInGroup = true
		}
	}

	if !fromUserInGroup {
		return errors.New("paying user not in group")
	}
	if !toUserInGroup {
		return errors.New("receiving user not in group")
	}

	return nil
}
