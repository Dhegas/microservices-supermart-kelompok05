# Task Checklist: Nusantara SuperMart Monolith Seed Project

## Phase 1: Infrastructure & Foundation
- [x] 1.1 Create `docker-compose.yml` (mysql 8.0, backend, frontend)
- [x] 1.2 Create `.env.example` and `.env`
- [x] 1.3 Create `scripts/init-db.sh`
- [x] 1.4 Expand `seed.sql` with comprehensive data for all 9 clusters & valid bcrypt password hashes
- [x] 1.5 Initialize Go backend module (`backend/go.mod`, `backend/Dockerfile`, dependencies)
- [x] 1.6 Implement shared backend packages: `pkg/config`, `pkg/database`, `pkg/middleware`, `pkg/response`, `pkg/validator`
- [x] 1.7 Scaffold Angular 22 frontend (`frontend/` using `@angular/cli@22`)
- [x] 1.8 Create root `README.md` with student instructions and architecture documentation

## Phase 2: Core Backend Domains
- [x] 2.1 Domain 1: `internal/auth` (handlers, services, repositories, models, DTOs, routes)
- [x] 2.2 Domain 2: `internal/catalog` (handlers, services, repositories, models, DTOs, routes)
- [x] 2.3 Domain 3: `internal/inventory` (handlers, services, repositories, models, DTOs, routes)

## Phase 3: Transaction Backend Domains
- [x] 3.1 Domain 4: `internal/order` (handlers, services, repositories, models, DTOs, routes)
- [x] 3.2 Domain 5: `internal/payment` (handlers, services, repositories, models, DTOs, routes)
- [x] 3.3 Domain 6: `internal/promotion` (handlers, services, repositories, models, DTOs, routes)

## Phase 4: Operations Backend Domains
- [x] 4.1 Domain 7: `internal/logistics` (handlers, services, repositories, models, DTOs, routes)
- [x] 4.2 Domain 8: `internal/procurement` (handlers, services, repositories, models, DTOs, routes)
- [x] 4.3 Domain 9: `internal/support` (handlers, services, repositories, models, DTOs, routes)
- [x] 4.4 Wire all 9 domains into `backend/main.go` and verify backend builds & tests pass

## Phase 5: Angular 22 Frontend Application
- [x] 5.1 Configure Angular 22 core: routing, auth interceptor, auth guard, role guard, auth service
- [x] 5.2 Build shared UI layout & design system: navbar, role-aware sidebar, notifications, modern styling
- [x] 5.3 Implement Customer Portal features: catalog browsing, product detail, cart, checkout, my orders, order tracking, wallet/credits, support tickets
- [x] 5.4 Implement Admin & Operations Portals:
  - Admin Dashboard & user/role management
  - Warehouse Staff Portal (inventory stocks, warehouse zones, stock mutations, goods receipt)
  - Courier Portal (delivery runs, shipment status updates, proof of delivery)
  - CS Agent Portal (support ticket queue, messaging, dispute resolution)
  - Procurement & Promotions management screens
- [x] 5.5 Verify frontend builds cleanly with Angular 22 and passes tests

## Phase 6: Docker Integration & Verification
- [x] 6.1 Configure Dockerfiles (multi-stage Go build, multi-stage Angular build with Nginx reverse proxy)
- [x] 6.2 Test and verify local and containerized operation
- [x] 6.3 Create Walkthrough artifact summarizing architecture, credentials, and decomposition guide
