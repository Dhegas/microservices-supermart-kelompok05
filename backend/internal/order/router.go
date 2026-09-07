package order

import (
	"github.com/gofiber/fiber/v3"
	"github.com/nusantara-supermart/backend/pkg/config"
	"github.com/nusantara-supermart/backend/pkg/middleware"
)

func RegisterRoutes(router fiber.Router, handler *Handler, cfg *config.Config) {
	orderGroup := router.Group("/orders")

	authRequired := middleware.AuthRequired(cfg)
	staffOrAdmin := middleware.RolesRequired("SUPER_ADMIN", "WAREHOUSE_STAFF")

	// Cart routes
	orderGroup.Get("/cart", authRequired, handler.GetCart)
	orderGroup.Post("/cart", authRequired, handler.AddToCart)
	orderGroup.Put("/cart/:id", authRequired, handler.UpdateCartItem)
	orderGroup.Delete("/cart/:id", authRequired, handler.RemoveCartItem)
	orderGroup.Post("/checkout", authRequired, handler.Checkout)

	// Order routes
	orderGroup.Get("/statuses", authRequired, handler.GetStatuses)
	orderGroup.Get("/", authRequired, handler.GetOrders)
	orderGroup.Get("/:id", authRequired, handler.GetOrderByID)
	orderGroup.Post("/:id/cancel", authRequired, handler.CancelOrder)
	orderGroup.Post("/:id/notes", authRequired, handler.AddOrderNote)

	// Staff/Admin status update
	orderGroup.Put("/:id/status", authRequired, staffOrAdmin, handler.UpdateOrderStatus)
}
