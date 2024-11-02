// internal/services/user_service.go

package services

import (
	"errors"
	"expense-split-app/internal/models"
	"expense-split-app/internal/repositories"

	"github.com/google/uuid"
)

type UserService struct {
	userRepo *repositories.UserRepository
}

func NewUserService(userRepo *repositories.UserRepository) *UserService {
	return &UserService{
		userRepo: userRepo,
	}
}

// type UpdateUserInput struct {
// 	Name  string `json:"name" binding:"required"`
// 	Email string `json:"email" binding:"required,email"`
// }

// GetProfile retrieves user profile by ID
func (s *UserService) GetProfile(userID uuid.UUID) (*models.User, error) {
	return s.userRepo.GetByID(userID)
}

// UpdateProfile updates user profile information
func (s *UserService) UpdateProfile(userID uuid.UUID, input UpdateUserInput) error {
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return err
	}

	// Check if email is being changed and if it's already taken
	if user.Email != input.Email {
		existingUser, _ := s.userRepo.GetByEmail(input.Email)
		if existingUser != nil {
			return errors.New("email already in use")
		}
	}

	user.Name = input.Name
	user.Email = input.Email

	return s.userRepo.Update(user)
}

// DeleteUser deletes a user account
func (s *UserService) DeleteUser(userID uuid.UUID) error {
	return s.userRepo.Delete(userID)
}

// ListUsers returns all users
func (s *UserService) ListUsers() ([]models.User, error) {
	return s.userRepo.List()
}

// GetUserByEmail retrieves user by email
func (s *UserService) GetUserByEmail(email string) (*models.User, error) {
	return s.userRepo.GetByEmail(email)
}
