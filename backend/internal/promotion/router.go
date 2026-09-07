package promotion

import (
	"github.com/gofiber/fiber/v3"
	"github.com/nusantara-supermart/backend/pkg/config"
	"github.com/nusantara-supermart/backend/pkg/middleware"
)

func RegisterRoutes(router fiber.Router, handler *Handler, cfg *config.Config) {
	promoGroup := router.Group("/promotions")

	// Public
	promoGroup.Get("/", handler.GetPromotions)
	promoGroup.Get("/vouchers", handler.GetVouchers)
	promoGroup.Get("/flash-sales", handler.GetFlashSales)

	// Authenticated
	authRequired := middleware.AuthRequired(cfg)
	promoGroup.Post("/vouchers/validate", authRequired, handler.ValidateVoucher)
	promoGroup.Get("/loyalty", authRequired, handler.GetLoyalty)
	promoGroup.Post("/loyalty/redeem", authRequired, handler.RedeemPoints)

	// Admin
	adminOnly := middleware.RolesRequired("SUPER_ADMIN")
	promoGroup.Post("/", authRequired, adminOnly, handler.CreatePromotion)
	promoGroup.Post("/vouchers", authRequired, adminOnly, handler.CreateVoucher)
}
