// internal/api/routes/routes.go

package routes

import (
	"expense-split-app/internal/api/handlers"
	"expense-split-app/internal/api/middleware"
	"expense-split-app/internal/config"
	"expense-split-app/internal/services"
	"expense-split-app/pkg/logger"

	"github.com/gin-gonic/gin"
)

type Router struct {
	engine            *gin.Engine
	config            *config.Config
	logger            *logger.Logger
	authHandler       *handlers.AuthHandler
	userHandler       *handlers.UserHandler
	groupHandler      *handlers.GroupHandler
	expenseHandler    *handlers.ExpenseHandler
	settlementHandler *handlers.SettlementHandler
}

func NewRouter(
	config *config.Config,
	logger *logger.Logger,
	services *services.Container,
) *Router {
	gin.SetMode(config.GinMode)
	engine := gin.New()

	return &Router{
		engine:            engine,
		config:            config,
		logger:            logger,
		authHandler:       handlers.NewAuthHandler(services.Auth),
		userHandler:       handlers.NewUserHandler(services.User),
		groupHandler:      handlers.NewGroupHandler(services.Group),
		expenseHandler:    handlers.NewExpenseHandler(services.Expense),
		settlementHandler: handlers.NewSettlementHandler(services.Settlement),
	}
}

func (r *Router) Setup() *gin.Engine {
	// Global middleware
	r.engine.Use(gin.Recovery())
	r.engine.Use(middleware.LoggerMiddleware(r.logger))
	r.engine.Use(middleware.CorsMiddleware())

	// API versioning
	v1 := r.engine.Group("/api/v1")

	// Health check
	v1.GET("/health", r.healthCheck)

	// Public routes
	r.setupPublicRoutes(v1)

	// Protected routes
	r.setupProtectedRoutes(v1)

	return r.engine
}

func (r *Router) setupPublicRoutes(rg *gin.RouterGroup) {
	auth := rg.Group("/auth")
	{
		auth.POST("/register", r.authHandler.Register)
		auth.POST("/login", r.authHandler.Login)
	}
}

func (r *Router) setupProtectedRoutes(rg *gin.RouterGroup) {
	protected := rg.Group("")
	protected.Use(middleware.AuthMiddleware(r.config.JWTSecret))

	// User routes
	users := protected.Group("/users")
	{
		users.GET("/me", r.userHandler.GetProfile)
		users.PUT("/me", r.userHandler.UpdateProfile)
		users.GET("", r.userHandler.ListUsers)
	}

	// Group routes
	groups := protected.Group("/groups")
	{
		groups.POST("", r.groupHandler.Create)
		groups.GET("", r.groupHandler.List)
		groups.GET("/:id", r.groupHandler.GetByID)
		groups.PUT("/:id", r.groupHandler.Update)
		groups.DELETE("/:id", r.groupHandler.Delete)

		// Group members
		groups.POST("/:id/users", r.groupHandler.AddUser)
		groups.DELETE("/:id/users/:userId", r.groupHandler.RemoveUser)

		// Group expenses
		groups.GET("/:id/expenses", r.expenseHandler.GetGroupExpenses)

		// Group settlements
		groups.GET("/:id/settlements", r.settlementHandler.GetGroupSettlements)
	}

	// Expense routes
	expenses := protected.Group("/expenses")
	{
		expenses.POST("", r.expenseHandler.Create)
		expenses.GET("/:id", r.expenseHandler.GetByID)
		expenses.PUT("/:id", r.expenseHandler.UpdateExpense)
		expenses.DELETE("/:id", r.expenseHandler.DeleteExpense)
	}

	// Settlement routes
	settlements := protected.Group("/settlements")
	{
		settlements.POST("", r.settlementHandler.Create)
		settlements.GET("/pending", r.settlementHandler.GetPendingSettlements)
		settlements.GET("/:id", r.settlementHandler.GetSettlement)
		settlements.PUT("/:id/status", r.settlementHandler.UpdateStatus)
	}
}

// Health check handler
func (r *Router) healthCheck(c *gin.Context) {
	c.JSON(200, gin.H{
		"status":  "ok",
		"version": "1.0.0",
	})
}

// API Documentation
type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// Router configuration
type RouterConfig struct {
	BasePath    string
	Environment string
}

func DefaultRouterConfig() RouterConfig {
	return RouterConfig{
		BasePath:    "/api/v1",
		Environment: gin.ReleaseMode,
	}
}

// Error response helper
func ErrorResponse(message string) APIResponse {
	return APIResponse{
		Success: false,
		Error:   message,
	}
}

// Success response helper
func SuccessResponse(data interface{}) APIResponse {
	return APIResponse{
		Success: true,
		Data:    data,
	}
}

// Sample usage in handlers:
/*
func (h *SomeHandler) SomeEndpoint(c *gin.Context) {
    result, err := h.service.SomeOperation()
    if err != nil {
        c.JSON(http.StatusBadRequest, ErrorResponse(err.Error()))
        return
    }
    c.JSON(http.StatusOK, SuccessResponse(result))
}
*/
