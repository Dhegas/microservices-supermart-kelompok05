package support

import (
	"github.com/gofiber/fiber/v3"
	"github.com/nusantara-supermart/backend/pkg/config"
	"github.com/nusantara-supermart/backend/pkg/middleware"
)

func RegisterRoutes(router fiber.Router, handler *Handler, cfg *config.Config) {
	supportGroup := router.Group("/support")

	// Public
	supportGroup.Get("/faq", handler.GetFAQs)
	supportGroup.Get("/categories", handler.GetCategories)

	// Authenticated
	authRequired := middleware.AuthRequired(cfg)
	supportGroup.Get("/tickets", authRequired, handler.GetTickets)
	supportGroup.Get("/tickets/:id", authRequired, handler.GetTicketByID)
	supportGroup.Post("/tickets", authRequired, handler.CreateTicket)
	supportGroup.Post("/tickets/:id/messages", authRequired, handler.AddMessage)
	supportGroup.Post("/tickets/:id/rate", authRequired, handler.RateTicket)
	supportGroup.Get("/disputes", authRequired, handler.GetDisputes)
	supportGroup.Post("/disputes", authRequired, handler.CreateDispute)

	// Support Agent / Admin
	agentOrAdmin := middleware.RolesRequired("SUPER_ADMIN", "CS_AGENT")
	supportGroup.Put("/tickets/:id/status", authRequired, agentOrAdmin, handler.UpdateStatus)
	supportGroup.Put("/tickets/:id/assign", authRequired, agentOrAdmin, handler.AssignTicket)
	supportGroup.Post("/faq", authRequired, agentOrAdmin, handler.CreateFAQ)
}
