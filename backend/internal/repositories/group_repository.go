// internal/repositories/group_repository.go

package repositories

import (
	"expense-split-app/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type GroupRepository struct {
	db *gorm.DB
}

func NewGroupRepository(db *gorm.DB) *GroupRepository {
	return &GroupRepository{db: db}
}

func (r *GroupRepository) Create(group *models.Group) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		group.ID = uuid.New()
		group.CreatedAt = time.Now()
		group.UpdatedAt = time.Now()

		if err := tx.Create(group).Error; err != nil {
			return err
		}

		return nil
	})
}

func (r *GroupRepository) GetByID(id uuid.UUID) (*models.Group, error) {
	var group models.Group
	if err := r.db.Preload("Users").First(&group, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &group, nil
}

func (r *GroupRepository) Update(group *models.Group) error {
	group.UpdatedAt = time.Now()
	return r.db.Save(group).Error
}

func (r *GroupRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Group{}, "id = ?", id).Error
}

func (r *GroupRepository) AddUser(groupID, userID uuid.UUID) error {
	return r.db.Exec("INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)",
		userID, groupID).Error
}

func (r *GroupRepository) RemoveUser(groupID, userID uuid.UUID) error {
	return r.db.Exec("DELETE FROM user_groups WHERE user_id = ? AND group_id = ?",
		userID, groupID).Error
}

func (r *GroupRepository) ListByUserID(userID uuid.UUID) ([]models.Group, error) {
	var groups []models.Group
	err := r.db.Joins("JOIN user_groups ON user_groups.group_id = groups.id").
		Where("user_groups.user_id = ?", userID).
		Preload("Users").
		Find(&groups).Error
	return groups, err
}
