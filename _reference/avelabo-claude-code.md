# Avelabo.com - Multi-Shop Ecommerce Platform
## Complete Development Specification for Claude Code

**Project:** Avelabo.com Multi-Vendor Marketplace  
**Tech Stack:** Laravel 12, InertiaJS, Vue 3, PostgreSQL, Redis  
**Target Market:** Malawi (Primary), Southern Africa (Secondary)

---

# SECTION 1: PROJECT OVERVIEW

## 1.1 Executive Summary

Avelabo.com is a multi-vendor ecommerce marketplace designed to serve Malawi as its primary market. The platform enables local and international sellers to reach Malawian consumers while addressing unique regional challenges including limited payment infrastructure, currency volatility, and product availability gaps.

## 1.2 Core Value Propositions

**For Customers:**
- Access to products unavailable locally
- Competitive pricing in local currency
- Multiple payment options including mobile money

**For Sellers:**
- Ready-made storefront
- Access to Malawian market
- Multi-currency support

**For Platform (Avelabo):**
- Revenue through seller price markups (primary profit model)
- Transaction fees where applicable
- Market positioning for regional expansion

## 1.3 Key Differentiators

1. **Automated Product Sourcing** - Daily scraping from Takealot.com and Noon.com
2. **Local Payment Integration** - TNM Mpamba, Airtel Money, and other Malawian payment methods
3. **Multi-Currency Transparency** - Prices in MWK, ZAR, USD with real-time conversion
4. **Seller-Based Markup System** - Price range markups set per seller for platform profit
5. **Low Barrier to Entry** - Simple KYC and onboarding for local sellers

---

# SECTION 2: REVENUE MODEL - SELLER PRICE MARKUP SYSTEM

## 2.1 Overview

**THIS IS THE PRIMARY PROFIT MECHANISM FOR AVELABO.COM**

The platform generates profit by adding markup amounts to product prices. These markups are:
- Configured at the **SELLER level** (not per product) to minimize administrative work
- Based on **price ranges** defined by admins
- Applied automatically to all products from that seller
- The markup amount is added to the base price before displaying to customers

## 2.2 How It Works

```
CUSTOMER SEES: Single Total Price Only (Base + Markup combined)

Example for Takealot Seller:
- Product base price: 350 ZAR
- Price falls in range: 100-500 ZAR
- Markup for this range: 100 ZAR
- Customer sees: 450 ZAR (or equivalent in their selected currency)

IMPORTANT: Customer ONLY sees "450 ZAR" - never a breakdown.
The markup is invisible to the customer.
```

## 2.3 Customer Price Display Rules

**CRITICAL: Customers must NEVER see markup breakdowns.**

| What Customer Sees | What Customer Does NOT See |
|--------------------|---------------------------|
| Single total price (e.g., "450 ZAR") | Base price |
| Discount from compare_at_price | Markup amount |
| Currency conversion rates | Markup percentage |
| Payment gateway fees (if any) | Internal pricing structure |

This applies to:
- Product listing pages
- Product detail pages
- Shopping cart
- Checkout page
- Order confirmation
- Order history
- Email notifications
- SMS notifications

The markup system is purely an internal/admin concern. From the customer's perspective, the displayed price IS the product price.

## 2.3 Markup Configuration Structure

Each seller has a set of price range markups configured by admin:

| Price Range (Min) | Price Range (Max) | Markup Amount | Currency |
|-------------------|-------------------|---------------|----------|
| 0.01 | 100.00 | 50.00 | ZAR |
| 100.01 | 500.00 | 100.00 | ZAR |
| 500.01 | 1000.00 | 200.00 | ZAR |
| 1000.01 | 2500.00 | 350.00 | ZAR |
| 2500.01 | 5000.00 | 500.00 | ZAR |
| 5000.01 | 10000.00 | 750.00 | ZAR |
| 10000.01 | 999999.99 | 1000.00 | ZAR |

**Key Rules:**
- Price ranges must not overlap
- Price ranges must cover all possible prices (no gaps)
- Each seller can have different markup configurations
- Markup currency should match seller's default currency
- Admins can create, edit, and delete markup ranges per seller
- Default markup template can be created and applied to new sellers

## 2.4 Database Schema for Markup System

```
Table: seller_price_markups
- id (primary key)
- seller_id (foreign key to sellers)
- min_price (decimal 15,2) - Start of price range
- max_price (decimal 15,2) - End of price range
- markup_amount (decimal 15,2) - Amount to add
- currency_id (foreign key to currencies) - Currency of the markup
- is_active (boolean) - Enable/disable this range
- created_at
- updated_at

Table: seller_markup_templates (optional - for quick setup)
- id (primary key)
- name (string) - e.g., "Standard Markup", "Premium Markup"
- description (text)
- is_default (boolean)
- created_at
- updated_at

Table: seller_markup_template_ranges
- id (primary key)
- template_id (foreign key)
- min_price (decimal 15,2)
- max_price (decimal 15,2)
- markup_amount (decimal 15,2)
- created_at
- updated_at
```

## 2.5 Price Calculation Flow

```
1. Get product base price from seller's catalog
2. Identify seller's default currency
3. Find applicable markup range for that price
4. Add markup amount to base price = Total Price
5. Convert to customer's selected currency (if different)
6. Display ONLY the final total price to customer

Function: calculateDisplayPrice(product, seller, customerCurrency)
{
    basePrice = product.price
    sellerCurrency = seller.defaultCurrency
    
    // Find applicable markup
    markup = seller.priceMarkups
        .where('min_price', '<=', basePrice)
        .where('max_price', '>=', basePrice)
        .where('is_active', true)
        .first()
    
    markupAmount = markup ? markup.markup_amount : 0
    
    // Calculate total price in seller currency
    totalPriceInSellerCurrency = basePrice + markupAmount
    
    // Convert to customer currency if needed
    if (sellerCurrency != customerCurrency) {
        displayPrice = convertCurrency(
            totalPriceInSellerCurrency, 
            sellerCurrency, 
            customerCurrency
        )
    } else {
        displayPrice = totalPriceInSellerCurrency
    }
    
    // IMPORTANT: Only displayPrice is shown to customers
    // basePrice and markupAmount are for internal use only
    
    return {
        basePrice: basePrice,           // INTERNAL ONLY - for admin/reports
        markupAmount: markupAmount,     // INTERNAL ONLY - for admin/reports
        displayPrice: displayPrice,     // THIS IS SHOWN TO CUSTOMER
        currency: customerCurrency
    }
}

// When rendering to customer UI, ONLY use displayPrice:
// e.g., "MK 45,000" - never "MK 35,000 + MK 10,000 markup"
```

## 2.6 Admin Interface Requirements for Markups

**Seller Markup Management Page:**
- List all markup ranges for a seller in a table
- Add new price range with min, max, and markup amount
- Edit existing ranges
- Delete ranges (with confirmation)
- Validation: prevent overlapping ranges, require complete coverage
- Copy markups from template or another seller
- Bulk enable/disable ranges

**Markup Templates Page:**
- Create named templates with predefined ranges
- Set a default template for new sellers
- Apply template to existing sellers (overwrite or merge)

**Seller List Enhancement:**
- Show "Markup Configured" status column
- Quick link to configure markups
- Bulk apply template to multiple sellers

## 2.7 Order & Financial Tracking

When an order is placed, store both:
- **Base price** (original seller price)
- **Markup amount** (platform profit)
- **Final price** (what customer paid)

This enables:
- Accurate profit reporting
- Seller payout calculations (they get base price minus any commission)
- Platform revenue tracking

---

# SECTION 3: BUSINESS OBJECTIVES

## 3.1 Primary Objectives

| Objective | Success Metric | Timeline |
|-----------|----------------|----------|
| Market Entry | 10,000 registered users | Month 6 |
| Transaction Volume | MWK 50M monthly GMV | Month 12 |
| Seller Ecosystem | 100 approved sellers | Month 9 |
| Customer Retention | 25% repeat purchase rate | Month 12 |

## 3.2 Secondary Objectives

1. Maintain 50,000+ active SKUs through scraping and seller additions
2. Achieve 85%+ payment completion rate
3. Maintain 4.0+ star platform rating
4. Enable 20% of sellers to earn MWK 500,000+ monthly

---

# SECTION 4: FUNCTIONAL REQUIREMENTS

## 4.1 Customer Portal Requirements

### 4.1.1 Account Management
| ID | Requirement | Priority |
|----|-------------|----------|
| CP-001 | User registration via email | Must Have |
| CP-002 | Social login (Google, Facebook) | Should Have |
| CP-003 | Phone number verification via OTP | Must Have |
| CP-004 | Profile management (name, addresses, preferences) | Must Have |
| CP-005 | Multiple delivery addresses with labels | Must Have |
| CP-006 | Order history access | Must Have |
| CP-007 | Wishlist functionality | Should Have |
| CP-008 | Currency preference setting | Must Have |

### 4.1.2 Product Discovery
| ID | Requirement | Priority |
|----|-------------|----------|
| CP-009 | Hierarchical category browsing | Must Have |
| CP-010 | Full-text product search | Must Have |
| CP-011 | Search filters (price, brand, rating, availability) | Must Have |
| CP-012 | Sort options (price, popularity, newest, rating) | Must Have |
| CP-013 | Product recommendations | Should Have |
| CP-014 | Recently viewed products | Should Have |
| CP-015 | Shop/Seller pages | Must Have |
| CP-016 | Deals and sale sections | Must Have |

### 4.1.3 Product Details
| ID | Requirement | Priority |
|----|-------------|----------|
| CP-017 | Product images gallery with zoom | Must Have |
| CP-018 | Rich text description with specifications | Must Have |
| CP-019 | Variant selection (color, size, etc.) | Must Have |
| CP-020 | Price display (single total price, original if discounted, discount %) | Must Have |
| CP-021 | Multi-currency price toggle | Must Have |
| CP-022 | Stock availability indicator | Must Have |
| CP-023 | Seller information and rating | Must Have |
| CP-024 | Customer reviews and ratings | Should Have |
| CP-025 | Related products | Should Have |
| CP-026 | Add to cart with quantity | Must Have |
| CP-027 | Buy now (direct checkout) | Should Have |

**IMPORTANT: All prices shown to customers are TOTAL prices (base + markup). Customers never see the base price or markup breakdown. The markup is completely invisible to customers.**

### 4.1.4 Shopping Cart
| ID | Requirement | Priority |
|----|-------------|----------|
| CP-028 | Add/remove items | Must Have |
| CP-029 | Update quantities | Must Have |
| CP-030 | Cart persistence (72 hours) | Must Have |
| CP-031 | Guest cart merge on login | Must Have |
| CP-032 | Real-time price updates | Must Have |
| CP-033 | Stock validation before checkout | Must Have |
| CP-034 | Subtotal in selected currency | Must Have |
| CP-035 | Clear proceed to checkout CTA | Must Have |

### 4.1.5 Checkout Process
| ID | Requirement | Priority |
|----|-------------|----------|
| CP-036 | Guest checkout (no account required) | Must Have |
| CP-037 | Address selection or new entry | Must Have |
| CP-038 | Payment method selection | Must Have |
| CP-039 | Display currency selection | Must Have |
| CP-040 | Price breakdown (subtotal, shipping, total - NO markup breakdown) | Must Have |
| CP-041 | Exchange rate display when currencies differ | Must Have |
| CP-042 | Order notes field | Should Have |
| CP-043 | Order review before payment | Must Have |
| CP-044 | Payment processing (redirect or in-app) | Must Have |
| CP-045 | Order confirmation page and email | Must Have |

### 4.1.6 Order Management
| ID | Requirement | Priority |
|----|-------------|----------|
| CP-046 | Real-time order status tracking | Must Have |
| CP-047 | Order details view | Must Have |
| CP-048 | Shipment tracking integration | Should Have |
| CP-049 | Order cancellation (before shipping) | Must Have |
| CP-050 | Return requests | Should Have |
| CP-051 | Reorder functionality | Should Have |

---

## 4.2 Seller Portal Requirements

### 4.2.1 Onboarding & KYC
| ID | Requirement | Priority |
|----|-------------|----------|
| SP-001 | Seller registration form | Must Have |
| SP-002 | Shop profile setup (name, description, logo) | Must Have |
| SP-003 | Business type selection (Individual/Company) | Must Have |
| SP-004 | Phone verification via OTP | Must Have |
| SP-005 | Document upload (ID front/back, selfie) | Must Have |
| SP-006 | Document type selection | Must Have |
| SP-007 | Business documents for companies | Should Have |
| SP-008 | Bank account setup for payouts | Must Have |
| SP-009 | Default currency selection | Must Have |
| SP-010 | KYC status tracking | Must Have |
| SP-011 | Document resubmission flow | Must Have |

### 4.2.2 Product Management
| ID | Requirement | Priority |
|----|-------------|----------|
| SP-012 | Add single product with full form | Must Have |
| SP-013 | Bulk product upload via CSV | Should Have |
| SP-014 | Multiple product images | Must Have |
| SP-015 | Category assignment | Must Have |
| SP-016 | Brand selection or creation | Must Have |
| SP-017 | Pricing setup (price, compare price) | Must Have |
| SP-018 | Inventory/stock management | Must Have |
| SP-019 | Variant creation (color, size) | Must Have |
| SP-020 | Product status control (draft, active, inactive) | Must Have |
| SP-021 | Product editing | Must Have |
| SP-022 | Product deletion (soft delete) | Must Have |
| SP-023 | Low stock alerts | Should Have |

**NOTE: Sellers enter BASE prices. They do NOT see or control the markup amounts. Markups are admin-controlled.**

### 4.2.3 Order Management
| ID | Requirement | Priority |
|----|-------------|----------|
| SP-024 | New order notifications | Must Have |
| SP-025 | Order list with filters and sorting | Must Have |
| SP-026 | Order detail view | Must Have |
| SP-027 | Order status updates (confirm, ship, deliver) | Must Have |
| SP-028 | Tracking number entry | Must Have |
| SP-029 | Packing slip generation | Should Have |
| SP-030 | Order cancellation with reason | Must Have |
| SP-031 | Refund initiation | Should Have |

### 4.2.4 Financial Management
| ID | Requirement | Priority |
|----|-------------|----------|
| SP-032 | Earnings dashboard | Must Have |
| SP-033 | Transaction history | Must Have |
| SP-034 | Per-order earnings breakdown | Must Have |
| SP-035 | Payout history | Must Have |
| SP-036 | Payout requests | Should Have |
| SP-037 | Bank account management | Must Have |
| SP-038 | Invoice generation | Should Have |

**NOTE: Seller earnings are based on BASE product prices minus any commission. Markup revenue goes entirely to Avelabo.**

### 4.2.5 Analytics
| ID | Requirement | Priority |
|----|-------------|----------|
| SP-039 | Sales overview (revenue, orders, items) | Must Have |
| SP-040 | Product performance metrics | Should Have |
| SP-041 | Customer insights | Should Have |
| SP-042 | Report exports (CSV) | Should Have |

---

## 4.3 Admin Portal Requirements

### 4.3.1 Dashboard
| ID | Requirement | Priority |
|----|-------------|----------|
| AP-001 | Platform metrics (GMV, orders, users, profit) | Must Have |
| AP-002 | Real-time activity feed | Should Have |
| AP-003 | Alert notifications | Must Have |
| AP-004 | Quick action buttons | Should Have |
| AP-005 | Markup revenue summary | Must Have |

### 4.3.2 User Management
| ID | Requirement | Priority |
|----|-------------|----------|
| AP-006 | Customer list with search/filter | Must Have |
| AP-007 | Customer detail view | Must Have |
| AP-008 | Customer status management | Must Have |
| AP-009 | Admin user management | Must Have |
| AP-010 | Role/permission management | Should Have |

### 4.3.3 Seller Management
| ID | Requirement | Priority |
|----|-------------|----------|
| AP-011 | Pending KYC application queue | Must Have |
| AP-012 | KYC document viewer | Must Have |
| AP-013 | KYC approval workflow | Must Have |
| AP-014 | KYC rejection with reasons | Must Have |
| AP-015 | Seller list with filters | Must Have |
| AP-016 | Seller detail view | Must Have |
| AP-017 | Seller status management (suspend, ban) | Must Have |
| AP-018 | Manual seller creation | Must Have |

### 4.3.4 SELLER PRICE MARKUP MANAGEMENT (CRITICAL)
| ID | Requirement | Priority |
|----|-------------|----------|
| AP-019 | View markup configuration per seller | Must Have |
| AP-020 | Add price range with markup amount | Must Have |
| AP-021 | Edit existing markup ranges | Must Have |
| AP-022 | Delete markup ranges | Must Have |
| AP-023 | Validate no overlapping ranges | Must Have |
| AP-024 | Validate complete price coverage | Must Have |
| AP-025 | Create markup templates | Must Have |
| AP-026 | Apply template to seller | Must Have |
| AP-027 | Set default template for new sellers | Must Have |
| AP-028 | Copy markups from another seller | Should Have |
| AP-029 | Bulk apply template to multiple sellers | Should Have |
| AP-030 | Preview markup impact on sample prices | Should Have |

### 4.3.5 Product Management
| ID | Requirement | Priority |
|----|-------------|----------|
| AP-031 | Product catalog view | Must Have |
| AP-032 | Product moderation | Should Have |
| AP-033 | Category CRUD | Must Have |
| AP-034 | Brand CRUD | Must Have |
| AP-035 | Attribute management | Must Have |
| AP-036 | Featured product control | Must Have |
| AP-037 | Product removal for violations | Must Have |

### 4.3.6 Order Management
| ID | Requirement | Priority |
|----|-------------|----------|
| AP-038 | All orders list | Must Have |
| AP-039 | Order detail view | Must Have |
| AP-040 | Order status override | Must Have |
| AP-041 | Refund processing | Must Have |
| AP-042 | Dispute management | Should Have |

### 4.3.7 Financial Management
| ID | Requirement | Priority |
|----|-------------|----------|
| AP-043 | Revenue dashboard (total, by markup, by seller) | Must Have |
| AP-044 | Markup profit reports | Must Have |
| AP-045 | Seller payout management | Must Have |
| AP-046 | Transaction reconciliation | Must Have |
| AP-047 | Financial exports | Must Have |

### 4.3.8 Configuration
| ID | Requirement | Priority |
|----|-------------|----------|
| AP-048 | Currency management | Must Have |
| AP-049 | Exchange rate management | Must Have |
| AP-050 | Payment gateway configuration | Must Have |
| AP-051 | Scraping configuration | Must Have |
| AP-052 | General platform settings | Must Have |

### 4.3.9 Scraping Management
| ID | Requirement | Priority |
|----|-------------|----------|
| AP-053 | Scraping job dashboard | Must Have |
| AP-054 | Manual scrape trigger | Must Have |
| AP-055 | Scraping logs and history | Must Have |
| AP-056 | Source-to-seller mapping | Must Have |
| AP-057 | Category mapping | Should Have |

### 4.3.10 Reports
| ID | Requirement | Priority |
|----|-------------|----------|
| AP-058 | Sales reports by period/seller/category | Must Have |
| AP-059 | Markup revenue reports | Must Have |
| AP-060 | User registration reports | Must Have |
| AP-061 | Product performance reports | Must Have |

---

# SECTION 5: NON-FUNCTIONAL REQUIREMENTS

## 5.1 Performance

| Requirement | Target |
|-------------|--------|
| Page Load Time | < 3 seconds (95th percentile) |
| API Response Time | < 500ms average |
| Search Results | < 1 second |
| Checkout Process | < 5 seconds (excluding payment) |
| Concurrent Users | 1,000 minimum |
| Price Calculation (with markup) | < 50ms |

## 5.2 Scalability

| Aspect | Initial | Growth Target |
|--------|---------|---------------|
| Products | 100,000 SKUs | 1,000,000 SKUs |
| Daily Orders | 500 | 5,000 |
| Registered Users | 50,000 | 500,000 |
| Active Sellers | 500 | 5,000 |

## 5.3 Security

| Category | Requirement |
|----------|-------------|
| Data Encryption | TLS 1.3 transit, AES-256 stored data |
| Authentication | Bcrypt passwords, session management, optional 2FA |
| Authorization | Role-based access control (RBAC) |
| Payment Security | PCI-DSS via providers, no card storage |
| API Security | Rate limiting, authentication, CORS |
| Audit Logging | All admin actions, financial transactions |

## 5.4 Availability

| Requirement | Target |
|-------------|--------|
| Uptime | 99.5% |
| Recovery Time Objective | 4 hours |
| Recovery Point Objective | 1 hour |
| Backup Frequency | Daily full, hourly incremental |

---

# SECTION 6: BUSINESS RULES

## 6.1 Seller Rules

| ID | Rule |
|----|------|
| SR-001 | Sellers must complete phone verification before KYC submission |
| SR-002 | Sellers must upload valid government ID (front/back) plus selfie |
| SR-003 | Sellers cannot list products until KYC approved |
| SR-004 | Sellers must respond to orders within 48 hours |
| SR-005 | Seller payouts processed weekly for balances above threshold |
| SR-006 | Sellers enter BASE prices only; markups controlled by admin |
| SR-007 | Sellers receive BASE price minus commission on sales |
| SR-008 | Scraped seller accounts (Takealot, Noon) are system-managed |

## 6.2 Markup Rules

| ID | Rule |
|----|------|
| MR-001 | Every seller must have markup configuration before products go live |
| MR-002 | Markup ranges must not overlap |
| MR-003 | Markup ranges must cover all possible prices (no gaps) |
| MR-004 | Markup amounts are in seller's default currency |
| MR-005 | Markups apply automatically to all seller products |
| MR-006 | Markup revenue belongs entirely to Avelabo |
| MR-007 | Markup changes apply immediately to all product displays |
| MR-008 | Orders lock markup at time of purchase |
| MR-009 | Default template auto-applied to new sellers |
| MR-010 | Admin can override markups per seller at any time |
| MR-011 | **Customers ONLY see total price - markup is NEVER shown or broken down** |
| MR-012 | **No UI element should ever display "base price" or "markup" to customers** |

## 6.3 Customer Rules

| ID | Rule |
|----|------|
| CR-001 | Customers may checkout as guests or registered |
| CR-002 | Cart items expire after 72 hours |
| CR-003 | Maximum 50 items per cart |
| CR-004 | Cancellation only before shipment |
| CR-005 | Refunds to original payment method |
| CR-006 | One account per email |

## 6.4 Pricing & Currency Rules

| ID | Rule |
|----|------|
| PR-001 | All seller prices stored in seller's currency |
| PR-002 | Markup added before currency conversion |
| PR-003 | Display price = Base Price + Markup (shown as single total to customer) |
| PR-004 | Exchange rates updated minimum daily |
| PR-005 | Final payment amount locked at checkout |
| PR-006 | Order stores: base price, markup amount, final price (internal only) |
| PR-007 | **Customer-facing UI only shows final total price, never breakdown** |

## 6.5 Payment Rules

| ID | Rule |
|----|------|
| PM-001 | Orders pending until payment confirmed |
| PM-002 | Failed payments cancel order after 30 minutes |
| PM-003 | Payment fees absorbed by platform |
| PM-004 | Refunds within 7 business days |

## 6.6 Scraping Rules

| ID | Rule |
|----|------|
| SC-001 | Scraping runs daily at 2:00 AM CAT |
| SC-002 | Scraped products use source's base prices |
| SC-003 | Markup applied based on scraped seller's configuration |
| SC-004 | Missing products marked inactive, not deleted |
| SC-005 | New scraped products live immediately |

---

# SECTION 7: DATA REQUIREMENTS

## 7.1 Core Entities

| Entity | Description | Volume Estimate |
|--------|-------------|-----------------|
| Users | Customer accounts | 50,000 Year 1 |
| Sellers | Vendor accounts | 500 Year 1 |
| Products | Product listings | 100,000 Year 1 |
| Orders | Customer orders | 50,000 Year 1 |
| Seller Markups | Price range configurations | ~5,000 ranges |
| Payments | Transactions | 50,000 Year 1 |

## 7.2 Key Database Tables

### Users & Authentication
- users
- roles
- user_roles
- user_addresses
- password_resets
- sessions

### Sellers
- sellers
- seller_kyc
- seller_bank_accounts
- **seller_price_markups** (CRITICAL)
- **seller_markup_templates**
- **seller_markup_template_ranges**

### Products
- categories
- brands
- products
- product_images
- product_attributes
- product_attribute_values
- product_variants
- product_prices (multi-currency cache)
- product_discounts

### Orders & Payments
- carts
- cart_items
- orders
- order_items (includes base_price, markup_amount, final_price)
- payments
- refunds

### Configuration
- countries
- currencies
- exchange_rates
- payment_gateways
- payment_gateway_currencies

### Scraping
- scraping_jobs
- scraping_logs

### Analytics
- product_views
- search_queries

---

# SECTION 8: INTEGRATION REQUIREMENTS

## 8.1 Payment Gateways

| Gateway | Type | Region | Priority | Currency |
|---------|------|--------|----------|----------|
| PayChangu | Card, Mobile, Bank | Malawi | Must Have | MWK |
| TNM Mpamba | Mobile Money | Malawi | Must Have | MWK |
| Airtel Money | Mobile Money | Malawi | Should Have | MWK |
| PayFast | Card, EFT | South Africa | Must Have | ZAR |

**Each gateway requires:**
- API authentication
- Payment initiation
- Payment verification/webhook
- Refund processing
- Transaction queries

## 8.2 External Services

| Service | Purpose | Priority |
|---------|---------|----------|
| SMS Provider | OTP, notifications | Must Have |
| Email Service | Transactional emails | Must Have |
| Exchange Rate API | Currency conversion | Must Have |
| Cloud Storage | File/image storage | Must Have |

## 8.3 Scraping Targets

| Source | Region | Seller Account |
|--------|--------|----------------|
| Takealot | South Africa | Primary seller (system-managed) |
| Noon | UAE | Secondary seller (system-managed) |

---

# SECTION 9: USER STORIES

## 9.1 Customer Stories

**Shopping:**
- As a customer, I want to see clear prices in my preferred currency so I know exactly what I'll pay
- As a customer, I want to search and filter products to find what I need quickly
- As a customer, I want to checkout as a guest so I can buy without creating an account
- As a customer, I want to pay with mobile money (TNM Mpamba) using my preferred method

**Orders:**
- As a customer, I want to track my order status so I know when to expect delivery
- As a customer, I want to view my order history so I can reorder items

## 9.2 Seller Stories

**Onboarding:**
- As a seller, I want to register my shop quickly so I can start selling
- As a seller, I want to verify my identity via phone so I can prove legitimacy
- As a seller, I want to see my KYC status so I know when I'm approved

**Products:**
- As a seller, I want to add products with images so customers can see what I'm selling
- As a seller, I want to set my prices in my local currency so I can manage my business
- As a seller, I want to manage inventory so I don't oversell

**Orders:**
- As a seller, I want to receive notifications for new orders so I can fulfill promptly
- As a seller, I want to see my earnings so I can manage cash flow

**NOTE: Sellers do NOT interact with markup configuration. They only see and set base prices.**

## 9.3 Admin Stories

**Markup Management:**
- As an admin, I want to configure price markups per seller so I can control platform profit
- As an admin, I want to create markup templates so I can quickly set up new sellers
- As an admin, I want to see markup revenue reports so I can track profitability
- As an admin, I want to adjust markups at any time so I can respond to market conditions

**Seller Management:**
- As an admin, I want to review KYC applications so I can approve legitimate sellers
- As an admin, I want to suspend sellers who violate policies

**Operations:**
- As an admin, I want to view all orders so I can monitor platform activity
- As an admin, I want to trigger product scraping so I can update the catalog

---

# SECTION 10: ACCEPTANCE CRITERIA

## 10.1 MVP Acceptance Criteria

**Customer Portal:**
- [ ] User can register, login, manage profile
- [ ] User can browse products by category
- [ ] User can search with filters
- [ ] User can view product details with images
- [ ] User can add to cart and checkout
- [ ] User can pay with PayChangu or TNM Mpamba
- [ ] Prices display correctly with markups applied
- [ ] Multi-currency display works (MWK, ZAR, USD)

**Seller Portal:**
- [ ] Seller can register and complete KYC
- [ ] Seller can add/edit products
- [ ] Seller can manage inventory
- [ ] Seller can process orders
- [ ] Seller sees earnings based on base prices

**Admin Portal:**
- [ ] Admin can review and approve/reject seller KYC
- [ ] Admin can configure seller price markups
- [ ] Admin can create and apply markup templates
- [ ] Admin can manage products and categories
- [ ] Admin can view all orders
- [ ] Admin can see markup revenue reports
- [ ] Admin can configure currencies and exchange rates
- [ ] Admin can trigger and monitor scraping

**Markup System:**
- [ ] Markups apply correctly to all product prices
- [ ] Price ranges work without gaps or overlaps
- [ ] Orders store base price, markup, and final price (internally)
- [ ] Reports show markup revenue accurately
- [ ] **Customers see ONLY total price - no markup breakdown anywhere**
- [ ] **Product pages show single price, not base + markup**
- [ ] **Cart shows single price per item, not breakdown**
- [ ] **Checkout shows subtotal and total, no markup line items**
- [ ] **Order confirmation shows total paid, no markup breakdown**
- [ ] **Order history shows total price, no markup details**

**System:**
- [ ] Daily scraping from Takealot works
- [ ] Currency conversion accurate
- [ ] Payment processing works
- [ ] Email/SMS notifications send

## 10.2 Performance Criteria

- [ ] Homepage loads < 3 seconds
- [ ] Search results < 2 seconds
- [ ] Price calculation < 50ms
- [ ] 100 concurrent users without degradation

---

# SECTION 11: DEVELOPMENT PHASES

## Phase 1: Foundation (Weeks 1-4)
- Database schema and migrations
- Core models and relationships
- Currency and exchange rate system
- Authentication system
- Base UI components

## Phase 2: Seller System (Weeks 5-8)
- Seller registration flow
- KYC verification system
- **Seller price markup system**
- **Markup templates**
- Admin seller management
- Admin markup configuration UI

## Phase 3: Products (Weeks 9-12)
- Category and brand management
- Product CRUD
- Product variants and attributes
- Multi-currency pricing with markups
- Product images

## Phase 4: Shopping Experience (Weeks 13-16)
- Product catalog pages
- Search and filtering
- Shopping cart
- Checkout flow with markup calculation

## Phase 5: Payments & Orders (Weeks 17-22)
- Payment gateway integrations
- Order management (all portals)
- Financial tracking (base + markup)
- Refund processing

## Phase 6: Scraping (Weeks 23-26)
- Scraping infrastructure
- Takealot scraper
- Noon scraper
- Automated scheduling

## Phase 7: Admin & Reports (Weeks 27-30)
- Admin dashboard
- Markup revenue reports
- Sales reports
- User reports

## Phase 8: Testing & Launch (Weeks 31-34)
- Comprehensive testing
- Performance optimization
- Security audit
- Soft launch
- Public launch

---

# SECTION 12: TECHNICAL NOTES FOR IMPLEMENTATION

## 12.1 Markup Calculation Service

Create a dedicated service class for markup calculations:

```
App\Services\Markup\MarkupService
- calculateMarkup(Product $product): float
- getDisplayPrice(Product $product, Currency $displayCurrency): float
- getMarkupForPriceRange(Seller $seller, float $price): ?SellerPriceMarkup
- validateMarkupRanges(Seller $seller): bool
- applyTemplate(Seller $seller, MarkupTemplate $template): void
```

## 12.2 Order Item Storage

When creating order items, store all price components FOR INTERNAL/ADMIN USE ONLY:

```
order_items:
- base_price (decimal) - Original product price [INTERNAL ONLY]
- markup_amount (decimal) - Platform markup at time of order [INTERNAL ONLY]
- display_price (decimal) - Price shown to customer [THIS IS WHAT CUSTOMER SEES]
- currency_id - Customer's selected currency
- seller_currency_id - Seller's original currency
- exchange_rate_used - Rate at time of order

IMPORTANT: When displaying order details to CUSTOMERS, only show:
- display_price (as "Price")
- quantity
- line total (display_price × quantity)

NEVER show base_price or markup_amount to customers.
These fields are for admin reporting and seller payouts only.
```

## 12.3 Caching Strategy

Cache markup lookups for performance:
- Cache seller markup ranges (clear on update)
- Cache product display prices (TTL: 1 hour or on markup change)
- Use cache tags for easy invalidation

## 12.4 Admin UI Considerations

Markup configuration should be:
- Accessible from seller detail page
- Have its own dedicated management page
- Show validation errors inline
- Preview price impact before saving
- Support bulk operations

---

**END OF SPECIFICATION DOCUMENT**

This document contains all requirements for building Avelabo.com. The seller price markup system is the PRIMARY revenue mechanism and should be implemented as a core feature in Phase 2.
