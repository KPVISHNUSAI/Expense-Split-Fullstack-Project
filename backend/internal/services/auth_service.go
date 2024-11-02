// internal/services/auth_service.go

package services

import (
	"errors"
	"expense-split-app/internal/config"
	"expense-split-app/internal/models"
	"expense-split-app/internal/repositories"
	"expense-split-app/pkg/utils"

	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	userRepo *repositories.UserRepository
	config   *config.Config
}

func NewAuthService(userRepo *repositories.UserRepository, config *config.Config) *AuthService {
	return &AuthService{
		userRepo: userRepo,
		config:   config,
	}
}

// type RegisterInput struct {
// 	Name     string `json:"name" binding:"required"`
// 	Email    string `json:"email" binding:"required,email"`
// 	Password string `json:"password" binding:"required,min=6"`
// }

// type LoginInput struct {
// 	Email    string `json:"email" binding:"required,email"`
// 	Password string `json:"password" binding:"required"`
// }

// type AuthResponse struct {
// 	Token string      `json:"token"`
// 	User  models.User `json:"user"`
// }

func (s *AuthService) Register(input RegisterInput) (*AuthResponse, error) {
	// Check if user exists
	existingUser, _ := s.userRepo.GetByEmail(input.Email)
	if existingUser != nil {
		return nil, errors.New("email already registered")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Create user
	user := &models.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: string(hashedPassword),
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	// Generate token
	token, err := utils.GenerateToken(user.ID, s.config.JWTSecret)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

func (s *AuthService) Login(input LoginInput) (*AuthResponse, error) {
	user, err := s.userRepo.GetByEmail(input.Email)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	token, err := utils.GenerateToken(user.ID, s.config.JWTSecret)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}
