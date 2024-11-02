// internal/api/handlers/settlement.go

package handlers

import (
	"expense-split-app/internal/models"
	"expense-split-app/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type SettlementHandler struct {
	settlementService *services.SettlementService
}

func NewSettlementHandler(settlementService *services.SettlementService) *SettlementHandler {
	return &SettlementHandler{
		settlementService: settlementService,
	}
}

func (h *SettlementHandler) Create(c *gin.Context) {
	var input services.CreateSettlementInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	settlement, err := h.settlementService.CreateSettlement(input)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, settlement)
}

func (h *SettlementHandler) GetGroupSettlements(c *gin.Context) {
	groupID, err := uuid.Parse(c.Param("groupId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid group ID format"})
		return
	}

	settlements, err := h.settlementService.GetGroupSettlements(groupID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, settlements)
}

func (h *SettlementHandler) GetPendingSettlements(c *gin.Context) {
	userID, _ := c.Get("userID")
	settlements, err := h.settlementService.GetPendingSettlements(userID.(uuid.UUID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, settlements)
}

func (h *SettlementHandler) UpdateStatus(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var input struct {
		Status models.SettlementStatus `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.settlementService.UpdateSettlementStatus(id, input.Status); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusOK)
}

func (h *SettlementHandler) GetSettlement(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid settlement ID format"})
		return
	}

	settlement, err := h.settlementService.GetSettlement(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Settlement not found"})
		return
	}

	c.JSON(http.StatusOK, settlement)
}
