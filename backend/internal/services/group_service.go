// internal/services/group_service.go

package services

import (
	"errors"
	"expense-split-app/internal/models"
	"expense-split-app/internal/repositories"

	"github.com/google/uuid"
)

type GroupService struct {
	groupRepo *repositories.GroupRepository
	userRepo  *repositories.UserRepository
}

func NewGroupService(
	groupRepo *repositories.GroupRepository,
	userRepo *repositories.UserRepository,
) *GroupService {
	return &GroupService{
		groupRepo: groupRepo,
		userRepo:  userRepo,
	}
}

// type CreateGroupInput struct {
// 	Name        string      `json:"name" binding:"required"`
// 	UserIDs     []uuid.UUID `json:"user_ids" binding:"required"`
// 	CreatedByID uuid.UUID   `json:"created_by_id" binding:"required"`
// }

// type UpdateGroupInput struct {
// 	Name string `json:"name" binding:"required"`
// }

// CreateGroup creates a new group
func (s *GroupService) CreateGroup(input CreateGroupInput) (*models.Group, error) {
	// Verify all users exist
	for _, userID := range input.UserIDs {
		if _, err := s.userRepo.GetByID(userID); err != nil {
			return nil, errors.New("invalid user ID in group members")
		}
	}

	// Create the group
	group := &models.Group{
		Name:      input.Name,
		CreatedBy: input.CreatedByID,
		Users:     make([]models.User, len(input.UserIDs)),
	}

	for i, userID := range input.UserIDs {
		group.Users[i] = models.User{ID: userID}
	}

	if err := s.groupRepo.Create(group); err != nil {
		return nil, err
	}

	return group, nil
}

// GetGroup retrieves a group by ID
func (s *GroupService) GetGroup(groupID uuid.UUID) (*models.Group, error) {
	return s.groupRepo.GetByID(groupID)
}

// UpdateGroup updates group information
func (s *GroupService) UpdateGroup(groupID uuid.UUID, input UpdateGroupInput) error {
	group, err := s.groupRepo.GetByID(groupID)
	if err != nil {
		return err
	}

	group.Name = input.Name
	return s.groupRepo.Update(group)
}

// DeleteGroup deletes a group
func (s *GroupService) DeleteGroup(groupID uuid.UUID) error {
	return s.groupRepo.Delete(groupID)
}

// AddUserToGroup adds a user to a group
func (s *GroupService) AddUserToGroup(groupID, userID uuid.UUID) error {
	// Verify user exists
	if _, err := s.userRepo.GetByID(userID); err != nil {
		return errors.New("user not found")
	}

	// Verify group exists
	if _, err := s.groupRepo.GetByID(groupID); err != nil {
		return errors.New("group not found")
	}

	return s.groupRepo.AddUser(groupID, userID)
}

// RemoveUserFromGroup removes a user from a group
func (s *GroupService) RemoveUserFromGroup(groupID, userID uuid.UUID) error {
	return s.groupRepo.RemoveUser(groupID, userID)
}

// GetUserGroups gets all groups for a user
func (s *GroupService) GetUserGroups(userID uuid.UUID) ([]models.Group, error) {
	return s.groupRepo.ListByUserID(userID)
}

// IsUserInGroup checks if a user is member of a group
func (s *GroupService) IsUserInGroup(groupID, userID uuid.UUID) (bool, error) {
	group, err := s.groupRepo.GetByID(groupID)
	if err != nil {
		return false, err
	}

	for _, user := range group.Users {
		if user.ID == userID {
			return true, nil
		}
	}

	return false, nil
}
