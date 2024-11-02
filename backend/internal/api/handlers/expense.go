// internal/api/handlers/expense.go

package handlers

import (
	"expense-split-app/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ExpenseHandler struct {
	expenseService *services.ExpenseService
}

func NewExpenseHandler(expenseService *services.ExpenseService) *ExpenseHandler {
	return &ExpenseHandler{
		expenseService: expenseService,
	}
}

func (h *ExpenseHandler) Create(c *gin.Context) {
	var input services.CreateExpenseInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("userID")
	input.PaidByID = userID.(uuid.UUID)

	expense, err := h.expenseService.CreateExpense(input)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, expense)
}

func (h *ExpenseHandler) GetByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	expense, err := h.expenseService.GetExpense(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Expense not found"})
		return
	}

	c.JSON(http.StatusOK, expense)
}

func (h *ExpenseHandler) GetGroupExpenses(c *gin.Context) {
	groupID, err := uuid.Parse(c.Param("groupId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid group ID format"})
		return
	}

	expenses, err := h.expenseService.GetGroupExpenses(groupID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, expenses)
}

func (h *ExpenseHandler) UpdateExpense(c *gin.Context) {
	// Get expense ID from URL parameter
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid expense ID format"})
		return
	}

	// Get current user ID from context
	userID, _ := c.Get("userID")
	currentUserID := userID.(uuid.UUID)

	// Validate if the expense exists and user has permission
	expense, err := h.expenseService.GetExpense(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Expense not found"})
		return
	}

	// Check if the current user is the one who paid for the expense
	if expense.PaidBy != currentUserID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to update this expense"})
		return
	}

	// Bind update input from request body
	var input services.UpdateExpenseInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate total split amount equals expense amount
	var totalSplit float64
	for _, split := range input.Splits {
		totalSplit += split.Amount
	}
	if totalSplit != input.Amount {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Total split amount must equal expense amount"})
		return
	}

	// Update the expense
	if err := h.expenseService.UpdateExpense(id, input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Get updated expense
	updatedExpense, err := h.expenseService.GetExpense(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch updated expense"})
		return
	}

	c.JSON(http.StatusOK, updatedExpense)
}

func (h *ExpenseHandler) DeleteExpense(c *gin.Context) {
	// Get expense ID from URL parameter
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid expense ID format"})
		return
	}

	// Get current user ID from context
	userID, _ := c.Get("userID")
	currentUserID := userID.(uuid.UUID)

	// Validate if the expense exists and user has permission
	expense, err := h.expenseService.GetExpense(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Expense not found"})
		return
	}

	// Check if the current user is the one who paid for the expense
	if expense.PaidBy != currentUserID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to delete this expense"})
		return
	}

	// Delete the expense
	if err := h.expenseService.DeleteExpense(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Expense deleted successfully"})
}
