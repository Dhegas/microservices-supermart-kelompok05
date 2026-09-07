package logistics

import (
	"github.com/gofiber/fiber/v3"
	"github.com/nusantara-supermart/backend/pkg/config"
	"github.com/nusantara-supermart/backend/pkg/middleware"
)

func RegisterRoutes(router fiber.Router, handler *Handler, cfg *config.Config) {
	logisticsGroup := router.Group("/logistics")

	// Public
	logisticsGroup.Get("/couriers", handler.GetCouriers)
	logisticsGroup.Get("/services", handler.GetServices)
	logisticsGroup.Get("/rates", handler.GetRates)

	// Authenticated
	authRequired := middleware.AuthRequired(cfg)
	logisticsGroup.Get("/shipments/:id", authRequired, handler.GetShipmentByID)
	logisticsGroup.Get("/order/:order_id", authRequired, handler.GetShipmentByOrderID)

	// Staff / Courier / Admin
	opsOrAdmin := middleware.RolesRequired("SUPER_ADMIN", "WAREHOUSE_STAFF", "COURIER")
	logisticsGroup.Get("/shipments", authRequired, opsOrAdmin, handler.GetShipments)
	logisticsGroup.Post("/shipments", authRequired, opsOrAdmin, handler.CreateShipment)
	logisticsGroup.Put("/shipments/:id/status", authRequired, opsOrAdmin, handler.UpdateStatus)
	logisticsGroup.Post("/shipments/:id/pod", authRequired, opsOrAdmin, handler.SubmitPOD)
	logisticsGroup.Get("/runs", authRequired, opsOrAdmin, handler.GetDeliveryRuns)
	logisticsGroup.Get("/drivers", authRequired, opsOrAdmin, handler.GetDrivers)
	logisticsGroup.Get("/vehicles", authRequired, opsOrAdmin, handler.GetVehicles)
}
