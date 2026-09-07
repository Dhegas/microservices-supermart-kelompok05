package procurement

import (
	"github.com/gofiber/fiber/v3"
	"github.com/nusantara-supermart/backend/pkg/config"
	"github.com/nusantara-supermart/backend/pkg/middleware"
)

func RegisterRoutes(router fiber.Router, handler *Handler, cfg *config.Config) {
	procGroup := router.Group("/procurement")

	authRequired := middleware.AuthRequired(cfg)
	staffOrAdmin := middleware.RolesRequired("SUPER_ADMIN", "WAREHOUSE_STAFF")

	procGroup.Get("/suppliers", authRequired, staffOrAdmin, handler.GetSuppliers)
	procGroup.Post("/suppliers", authRequired, staffOrAdmin, handler.CreateSupplier)
	procGroup.Get("/purchase-orders", authRequired, staffOrAdmin, handler.GetPurchaseOrders)
	procGroup.Get("/purchase-orders/:id", authRequired, staffOrAdmin, handler.GetPurchaseOrderByID)
	procGroup.Post("/purchase-orders", authRequired, staffOrAdmin, handler.CreatePurchaseOrder)
	procGroup.Post("/purchase-orders/:id/approve", authRequired, staffOrAdmin, handler.ApprovePO)
	procGroup.Get("/grn", authRequired, staffOrAdmin, handler.GetGRNs)
	procGroup.Post("/grn", authRequired, staffOrAdmin, handler.CreateGRN)
	procGroup.Get("/invoices", authRequired, staffOrAdmin, handler.GetInvoices)
}
