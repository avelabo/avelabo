# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Avelabo is a multi-vendor ecommerce marketplace platform for Malawi built with Laravel 12, React 19, and InertiaJS 2. The platform connects South African/Middle Eastern suppliers with Malawian customers through local sellers who handle last-mile delivery.

## Development Commands

```bash
# Full-stack development (recommended)
composer run dev       # Runs Laravel server, queue worker, log streamer, and Vite concurrently

# Individual servers
npm run dev            # Vite dev server for frontend
php artisan serve      # Laravel dev server only

# Build & Test
npm run build          # Production frontend build
composer run test      # Run PHPUnit test suite (clears config cache first)

# Project setup (fresh install)
composer run setup     # Installs dependencies, runs migrations, builds assets
```

## Architecture

### Tech Stack
- **Backend:**  PostgreSQL
- **Backend:** Laravel 12 (PHP 8.2+), Eloquent ORM
- **Frontend:** React 19 with InertiaJS 2 (server-side routing, client-side rendering)
- **Styling:** Tailwind CSS 4 via Vite
- **Build:** Vite 7 with Laravel and React plugins

### How InertiaJS Works
Routes in `routes/web.php` return `Inertia::render('PageName', $props)` which renders the corresponding React component from `resources/js/Pages/`. The frontend handles navigation without full page reloads while the backend controls routing.

### Directory Structure
```
resources/js/
├── Pages/                    # Page components (route endpoints)
│   ├── Frontend/            # Customer-facing pages (Home, Shop, Cart, etc.)
│   └── Admin/               # Admin portal pages (Dashboard, Products, Orders, etc.)
├── Components/
│   ├── Frontend/            # Reusable customer-facing components
│   └── Admin/               # Reusable admin components
└── Layouts/
    ├── FrontendLayout.jsx   # Wraps all customer pages
    └── AdminLayout.jsx      # Wraps all admin pages
```

### Path Alias
`@` resolves to `/resources/js` (configured in vite.config.js)

## Critical Business Logic: Seller Price Markup System

The primary revenue mechanism is an **invisible markup applied at the seller level**:

1. Markup is based on price ranges (e.g., 100-500 ZAR = 100 ZAR markup)
2. Applied automatically to all products from a seller
3. **CRITICAL:** Customers must NEVER see the markup breakdown
   - Display only total price: "MWK 45,000"
   - Never show: base price, markup amount, or any breakdown
   - Applies everywhere: product pages, cart, checkout, orders, emails, SMS
4. Order items track internally: `base_price`, `markup_amount`, `display_price`
5. Markup revenue goes to Avelabo; seller earnings based on base price minus commission

## Platform Structure

Three separate portals:
- **Customer Portal:** Browse, cart, checkout, order tracking
- **Seller Portal:** Product management, order fulfillment, earnings dashboard
- **Admin Portal:** User management, reports, markup configuration, product scraping oversight

## Key Integrations (To Be Implemented)

- **Payments:** PayChangu, TNM Mpamba, Airtel Money, PayFast
- **Currency:** Multi-currency support (MWK, ZAR, USD) with live conversion
- **Product Scraping:** Automated product import from Takealot/Noon

## Conventions

- Wrap pages in `FrontendLayout` or `AdminLayout`
- Use Tailwind CSS for all styling (no component-scoped CSS)
- Pascal case for components and pages
- Routes use dot notation: `products.index`, `admin.dashboard`

## Reference Documentation

Detailed specifications are in `ai_context/`:
- `avelabo-claude-code.md` - Technical specification with all features and database schema
- `avelabo-brd.md` - Business requirements and development phases
