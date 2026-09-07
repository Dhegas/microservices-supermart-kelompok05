package auth

import (
	"github.com/gofiber/fiber/v3"
	"github.com/nusantara-supermart/backend/pkg/config"
	"github.com/nusantara-supermart/backend/pkg/middleware"
)

func RegisterRoutes(router fiber.Router, handler *Handler, cfg *config.Config) {
	authGroup := router.Group("/auth")

	// Public routes
	authGroup.Post("/login", handler.Login)
	authGroup.Post("/register", handler.Register)

	// Authenticated routes
	authRequired := middleware.AuthRequired(cfg)
	authGroup.Get("/me", authRequired, handler.GetMe)
	authGroup.Put("/me", authRequired, handler.UpdateProfile)
	authGroup.Get("/addresses", authRequired, handler.GetAddresses)
	authGroup.Post("/addresses", authRequired, handler.AddAddress)
	authGroup.Delete("/addresses/:id", authRequired, handler.DeleteAddress)
	authGroup.Get("/kyc", authRequired, handler.GetKYC)
	authGroup.Post("/kyc", authRequired, handler.SubmitKYC)

	// Admin routes
	adminOnly := middleware.RolesRequired("SUPER_ADMIN")
	authGroup.Get("/users", authRequired, adminOnly, handler.GetAllUsers)
	authGroup.Get("/roles", authRequired, adminOnly, handler.GetRoles)
	authGroup.Get("/permissions", authRequired, adminOnly, handler.GetPermissions)
	authGroup.Put("/kyc/:id/verify", authRequired, adminOnly, handler.VerifyKYC)
}
