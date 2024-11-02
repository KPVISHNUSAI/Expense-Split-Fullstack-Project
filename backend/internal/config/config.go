// internal/config/config.go

package config

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"os"
	"path/filepath"
	"strconv"
	"time"
)

type Config struct {
	// Server
	ServerPort  string
	Environment string
	GinMode     string // Added GinMode field

	// Database
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string

	// Database Pool
	MaxIdleConnections    int
	MaxOpenConnections    int
	ConnectionMaxLifetime time.Duration

	// JWT
	JWTSecret string
}

// findEnvFile looks for .env file in multiple possible locations
func findEnvFile() (string, error) {
	// Get current working directory
	wd, err := os.Getwd()
	if err != nil {
		return "", fmt.Errorf("failed to get working directory: %v", err)
	}

	// Possible locations to check for .env file
	possiblePaths := []string{
		filepath.Join(wd, ".env"),
		filepath.Join(wd, "../.env"),
		filepath.Join(wd, "../../.env"),
	}

	// Try each path
	for _, path := range possiblePaths {
		if _, err := os.Stat(path); err == nil {
			absPath, err := filepath.Abs(path)
			if err == nil {
				return absPath, nil
			}
		}
	}

	return "", fmt.Errorf(".env file not found in any of the possible locations")
}

// LoadConfig loads configuration from environment variables
func LoadConfig() (*Config, error) {
	// Find and load .env file
	envPath, err := findEnvFile()
	if err != nil {
		fmt.Printf("Warning: %v\n", err)
	} else {
		fmt.Printf("Loading .env from: %s\n", envPath)
		if err := godotenv.Load(envPath); err != nil {
			return nil, fmt.Errorf("error loading .env file: %v", err)
		}
	}

	// Determine Gin mode based on environment
	ginMode := gin.DebugMode
	env := getEnv("ENVIRONMENT", "development")
	switch env {
	case "production":
		ginMode = gin.ReleaseMode
	case "test":
		ginMode = gin.TestMode
	}

	config := &Config{
		// Server
		ServerPort:  getEnv("SERVER_PORT", "9000"),
		Environment: env,
		GinMode:     ginMode,

		// Database
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBUser:     getEnv("DB_USER", "postgres"),
		DBPassword: getEnv("DB_PASSWORD", "postgres"),
		DBName:     getEnv("DB_NAME", "expense_split"),
		DBSSLMode:  getEnv("DB_SSL_MODE", "disable"),

		// JWT
		JWTSecret: getEnv("JWT_SECRET", ""),

		// Database Pool
		MaxIdleConnections:    getEnvAsInt("MAX_IDLE_CONNECTIONS", 10),
		MaxOpenConnections:    getEnvAsInt("MAX_OPEN_CONNECTIONS", 100),
		ConnectionMaxLifetime: getEnvAsDuration("CONNECTION_MAX_LIFETIME", time.Hour),
	}

	// Validate required configurations
	if err := config.validate(); err != nil {
		return nil, err
	}

	return config, nil
}

// getEnv gets environment variable with a default value
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

// getEnvAsInt gets environment variable as integer with a default value
func getEnvAsInt(key string, defaultValue int) int {
	valueStr := getEnv(key, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultValue
}

// getEnvAsDuration gets environment variable as duration with a default value
func getEnvAsDuration(key string, defaultValue time.Duration) time.Duration {
	valueStr := getEnv(key, "")
	if value, err := time.ParseDuration(valueStr); err == nil {
		return value
	}
	return defaultValue
}

// validate checks if all required configurations are present
func (c *Config) validate() error {
	if c.DBPassword == "" {
		return fmt.Errorf("database password is required")
	}

	if c.JWTSecret == "" {
		return fmt.Errorf("JWT secret key is required")
	}

	return nil
}

// GetDSN returns the PostgreSQL connection string
func (c *Config) GetDSN() string {
	return fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.DBHost,
		c.DBPort,
		c.DBUser,
		c.DBPassword,
		c.DBName,
		c.DBSSLMode,
	)
}

// IsProduction checks if the environment is production
func (c *Config) IsProduction() bool {
	return c.Environment == "production"
}

// IsDevelopment checks if the environment is development
func (c *Config) IsDevelopment() bool {
	return c.Environment == "development"
}

// IsTest checks if the environment is test
func (c *Config) IsTest() bool {
	return c.Environment == "test"
}
