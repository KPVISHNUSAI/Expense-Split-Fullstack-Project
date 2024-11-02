// internal/repositories/settlement_repository.go

package repositories

import (
	"expense-split-app/internal/models"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SettlementRepository struct {
	db *gorm.DB
}

func NewSettlementRepository(db *gorm.DB) *SettlementRepository {
	return &SettlementRepository{db: db}
}

func (r *SettlementRepository) Create(settlement *models.Settlement) error {
	settlement.ID = uuid.New()
	settlement.CreatedAt = time.Now()
	settlement.UpdatedAt = time.Now()
	return r.db.Create(settlement).Error
}

func (r *SettlementRepository) GetByID(id uuid.UUID) (*models.Settlement, error) {
	var settlement models.Settlement
	err := r.db.Preload("FromUser").
		Preload("ToUser").
		Preload("Group").
		First(&settlement, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &settlement, nil
}

func (r *SettlementRepository) Update(settlement *models.Settlement) error {
	settlement.UpdatedAt = time.Now()
	return r.db.Save(settlement).Error
}

func (r *SettlementRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Settlement{}, "id = ?", id).Error
}

func (r *SettlementRepository) GetByGroupID(groupID uuid.UUID) ([]models.Settlement, error) {
	var settlements []models.Settlement
	err := r.db.Preload("FromUser").
		Preload("ToUser").
		Where("group_id = ?", groupID).
		Find(&settlements).Error
	return settlements, err
}

func (r *SettlementRepository) GetUserSettlements(userID uuid.UUID) ([]models.Settlement, error) {
	var settlements []models.Settlement
	err := r.db.Preload("FromUser").
		Preload("ToUser").
		Preload("Group").
		Where("from_user_id = ? OR to_user_id = ?", userID, userID).
		Find(&settlements).Error
	return settlements, err
}

func (r *SettlementRepository) UpdateStatus(id uuid.UUID, status models.SettlementStatus) error {
	return r.db.Model(&models.Settlement{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":     status,
			"updated_at": time.Now(),
		}).Error
}

func (r *SettlementRepository) GetPendingSettlements(userID uuid.UUID) ([]models.Settlement, error) {
	var settlements []models.Settlement
	err := r.db.Preload("FromUser").
		Preload("ToUser").
		Preload("Group").
		Where("(from_user_id = ? OR to_user_id = ?) AND status = ?",
			userID, userID, models.SettlementStatusPending).
		Find(&settlements).Error
	return settlements, err
}
