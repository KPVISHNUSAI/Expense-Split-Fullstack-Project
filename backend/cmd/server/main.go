// cmd/server/main.go

package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"expense-split-app/internal/api/routes"
	"expense-split-app/internal/config"
	"expense-split-app/internal/db"
	"expense-split-app/internal/services"
	"expense-split-app/pkg/logger"
)

func main() {
	// Initialize logger
	log := logger.NewLogger()
	log.Info("Starting expense split application...")

	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Error("Failed to load configuration: %v", err)
		os.Exit(1)
	}

	// Initialize database
	log.Info("Connecting to database...")
	dbConfig := db.NewConfig(cfg)
	database, err := db.Connect(dbConfig)
	if err != nil {
		log.Error("Failed to connect to database: %v", err)
		os.Exit(1)
	}

	// Get underlying SQL DB instance
	sqlDB, err := database.DB()
	if err != nil {
		log.Error("Failed to get database instance: %v", err)
		os.Exit(1)
	}
	defer sqlDB.Close()

	// Initialize services
	log.Info("Initializing services...")
	services := services.NewContainer(database, cfg)

	// Initialize router
	log.Info("Setting up routes...")
	router := routes.NewRouter(cfg, log, services)
	engine := router.Setup()

	// Configure server
	srv := &http.Server{
		Addr:         ":" + cfg.ServerPort,
		Handler:      engine,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in a goroutine
	go func() {
		log.Info("Server is starting on port %s", cfg.ServerPort)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Error("Failed to start server: %v", err)
			os.Exit(1)
		}
	}()

	// Set up graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Info("Server is shutting down...")

	// Create shutdown context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	// Shutdown server
	if err := srv.Shutdown(ctx); err != nil {
		log.Error("Server forced to shutdown: %v", err)
	}

	log.Info("Server exited properly")
}

// Optional: Add deployment configuration
const (
	defaultPort     = "9000"
	defaultEnv      = "development"
	shutdownTimeout = 15 * time.Second
)

type Application struct {
	logger     *logger.Logger
	config     *config.Config
	services   *services.Container
	httpServer *http.Server
}

func NewApplication() *Application {
	return &Application{
		logger: logger.NewLogger(),
	}
}

func (app *Application) Initialize() error {
	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		return fmt.Errorf("failed to load config: %w", err)
	}
	app.config = cfg

	// Initialize database
	dbConfig := db.NewConfig(cfg)
	database, err := db.Connect(dbConfig)
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	// Initialize services
	app.services = services.NewContainer(database, cfg)

	// Initialize HTTP server
	router := routes.NewRouter(cfg, app.logger, app.services)
	engine := router.Setup()

	app.httpServer = &http.Server{
		Addr:         ":" + cfg.ServerPort,
		Handler:      engine,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	return nil
}

func (app *Application) Start() error {
	// Start HTTP server
	go func() {
		app.logger.Info("Server is starting on port %s", app.config.ServerPort)
		if err := app.httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			app.logger.Error("Server failed: %v", err)
			os.Exit(1)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	app.logger.Info("Server is shutting down...")

	// Create shutdown context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), shutdownTimeout)
	defer cancel()

	// Shutdown server
	if err := app.httpServer.Shutdown(ctx); err != nil {
		return fmt.Errorf("server forced to shutdown: %w", err)
	}

	app.logger.Info("Server exited properly")
	return nil
}
