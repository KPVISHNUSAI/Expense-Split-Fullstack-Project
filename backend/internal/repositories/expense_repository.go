package repositories

import (
	"expense-split-app/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type ExpenseRepository struct {
	db *gorm.DB
}

func NewExpenseRepository(db *gorm.DB) *ExpenseRepository {
	return &ExpenseRepository{db: db}
}

func (r *ExpenseRepository) Create(expense *models.Expense) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		expense.ID = uuid.New()
		expense.CreatedAt = time.Now()
		expense.UpdatedAt = time.Now()

		if err := tx.Create(expense).Error; err != nil {
			return err
		}

		// Create splits
		for i := range expense.Splits {
			expense.Splits[i].ID = uuid.New()
			expense.Splits[i].ExpenseID = expense.ID
			expense.Splits[i].CreatedAt = time.Now()
			expense.Splits[i].UpdatedAt = time.Now()
		}

		if err := tx.Create(&expense.Splits).Error; err != nil {
			return err
		}

		return nil
	})
}

func (r *ExpenseRepository) GetByID(id uuid.UUID) (*models.Expense, error) {
	var expense models.Expense
	if err := r.db.Preload("Splits").First(&expense, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &expense, nil
}

func (r *ExpenseRepository) Update(expense *models.Expense) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		expense.UpdatedAt = time.Now()

		// Update expense
		if err := tx.Save(expense).Error; err != nil {
			return err
		}

		// Update splits
		for i := range expense.Splits {
			expense.Splits[i].UpdatedAt = time.Now()
		}

		// Delete old splits and create new ones
		if err := tx.Delete(&models.Split{}, "expense_id = ?", expense.ID).Error; err != nil {
			return err
		}

		if err := tx.Create(&expense.Splits).Error; err != nil {
			return err
		}

		return nil
	})
}

func (r *ExpenseRepository) Delete(id uuid.UUID) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Delete splits first
		if err := tx.Delete(&models.Split{}, "expense_id = ?", id).Error; err != nil {
			return err
		}

		// Delete expense
		if err := tx.Delete(&models.Expense{}, "id = ?", id).Error; err != nil {
			return err
		}

		return nil
	})
}

func (r *ExpenseRepository) GetByGroupID(groupID uuid.UUID) ([]models.Expense, error) {
	var expenses []models.Expense
	err := r.db.Preload("Splits").Where("group_id = ?", groupID).Find(&expenses).Error
	return expenses, err
}

func (r *ExpenseRepository) GetUserExpenses(userID uuid.UUID) ([]models.Expense, error) {
	var expenses []models.Expense
	err := r.db.Preload("Splits").
		Where("paid_by = ?", userID).
		Or("id IN (SELECT expense_id FROM splits WHERE user_id = ?)", userID).
		Find(&expenses).Error
	return expenses, err
}
