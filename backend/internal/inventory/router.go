package inventory

import (
	"github.com/gofiber/fiber/v3"
	"github.com/nusantara-supermart/backend/pkg/config"
	"github.com/nusantara-supermart/backend/pkg/middleware"
)

func RegisterRoutes(router fiber.Router, handler *Handler, cfg *config.Config) {
	inventoryGroup := router.Group("/inventory")

	authRequired := middleware.AuthRequired(cfg)
	staffOrAdmin := middleware.RolesRequired("SUPER_ADMIN", "WAREHOUSE_STAFF")

	inventoryGroup.Get("/warehouses", authRequired, handler.GetWarehouses)
	inventoryGroup.Get("/warehouses/:id/zones", authRequired, handler.GetWarehouseZones)

	inventoryGroup.Get("/stocks", authRequired, staffOrAdmin, handler.GetStocks)
	inventoryGroup.Put("/stocks/:id/adjust", authRequired, staffOrAdmin, handler.AdjustStock)
	inventoryGroup.Post("/mutations", authRequired, staffOrAdmin, handler.CreateMutation)
	inventoryGroup.Get("/mutations", authRequired, staffOrAdmin, handler.GetMutations)
	inventoryGroup.Get("/alerts", authRequired, staffOrAdmin, handler.GetLowStockAlerts)
	inventoryGroup.Get("/opnames", authRequired, staffOrAdmin, handler.GetOpnames)
	inventoryGroup.Post("/opnames", authRequired, staffOrAdmin, handler.CreateOpname)

	adminOnly := middleware.RolesRequired("SUPER_ADMIN")
	inventoryGroup.Post("/warehouses", authRequired, adminOnly, handler.CreateWarehouse)
}
