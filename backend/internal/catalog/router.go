package catalog

import (
	"github.com/gofiber/fiber/v3"
	"github.com/nusantara-supermart/backend/pkg/config"
	"github.com/nusantara-supermart/backend/pkg/middleware"
)

func RegisterRoutes(router fiber.Router, handler *Handler, cfg *config.Config) {
	catalogGroup := router.Group("/catalog")

	// Public routes
	catalogGroup.Get("/products", handler.ListProducts)
	catalogGroup.Get("/products/:id", handler.GetProduct)
	catalogGroup.Get("/products/:id/reviews", handler.GetReviews)
	catalogGroup.Get("/categories", handler.GetCategories)
	catalogGroup.Get("/brands", handler.GetBrands)

	// Authenticated routes
	authRequired := middleware.AuthRequired(cfg)
	catalogGroup.Post("/products/:id/reviews", authRequired, handler.AddReview)

	// Admin routes
	adminOnly := middleware.RolesRequired("SUPER_ADMIN")
	catalogGroup.Post("/products", authRequired, adminOnly, handler.CreateProduct)
	catalogGroup.Put("/products/:id", authRequired, adminOnly, handler.UpdateProduct)
	catalogGroup.Delete("/products/:id", authRequired, adminOnly, handler.DeleteProduct)
	catalogGroup.Post("/categories", authRequired, adminOnly, handler.CreateCategory)
	catalogGroup.Post("/brands", authRequired, adminOnly, handler.CreateBrand)
}
