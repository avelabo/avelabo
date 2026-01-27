# Avelabo

A multi-vendor ecommerce marketplace platform for Malawi connecting South African and Middle Eastern suppliers with Malawian customers through local sellers who handle last-mile delivery.

## Tech Stack

- **Backend:** Laravel 12 (PHP 8.2+), PostgreSQL
- **Frontend:** React 19 with InertiaJS 2
- **Styling:** Tailwind CSS 4
- **Build:** Vite 7

## Setup

```bash
composer run setup
```

This installs dependencies, runs migrations, and builds frontend assets.

## Development

```bash
# Full-stack dev server (recommended)
composer run dev

# Individual servers
php artisan serve    # Laravel only
npm run dev          # Vite only
```

## Build & Test

```bash
npm run build        # Production frontend build
composer run test    # Run test suite
```

## Architecture

The application uses InertiaJS for server-side routing with client-side React rendering. Routes in `routes/web.php` return `Inertia::render()` calls that map to React components in `resources/js/Pages/`.

### Portals

- **Customer Portal** - Browse products, cart, checkout, order tracking
- **Seller Portal** - Product management, order fulfillment, earnings
- **Admin Portal** - User management, reports, configuration

### Directory Structure

```
resources/js/
├── Pages/
│   ├── Frontend/    # Customer-facing pages
│   └── Admin/       # Admin portal pages
├── Components/
│   ├── Frontend/    # Reusable customer components
│   └── Admin/       # Reusable admin components
└── Layouts/
    ├── FrontendLayout.jsx
    └── AdminLayout.jsx
```

## Key Integrations (Planned)

- Payment gateways: PayChangu, TNM Mpamba, Airtel Money, PayFast
- Multi-currency support: MWK, ZAR, USD
- Automated product import from suppliers
