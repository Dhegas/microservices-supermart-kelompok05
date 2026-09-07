package payment

import (
	"github.com/gofiber/fiber/v3"
	"github.com/nusantara-supermart/backend/pkg/config"
	"github.com/nusantara-supermart/backend/pkg/middleware"
)

func RegisterRoutes(router fiber.Router, handler *Handler, cfg *config.Config) {
	paymentGroup := router.Group("/payments")

	// Public
	paymentGroup.Get("/methods", handler.GetMethods)

	// Authenticated
	authRequired := middleware.AuthRequired(cfg)
	paymentGroup.Get("/invoices", authRequired, handler.GetInvoices)
	paymentGroup.Get("/invoices/:id", authRequired, handler.GetInvoiceByID)
	paymentGroup.Post("/pay", authRequired, handler.PayInvoice)
	paymentGroup.Get("/credits", authRequired, handler.GetStoreCredit)
	paymentGroup.Post("/credits/topup", authRequired, handler.TopupStoreCredit)
	paymentGroup.Get("/refunds", authRequired, handler.GetRefunds)
	paymentGroup.Post("/refunds", authRequired, handler.RequestRefund)

	// Admin
	adminOnly := middleware.RolesRequired("SUPER_ADMIN")
	paymentGroup.Put("/refunds/:id/approve", authRequired, adminOnly, handler.ApproveRefund)
}
