# Avelabo.com
## Business Requirements Document & Execution Plan

**Document Version:** 1.0  
**Date:** November 2025  
**Prepared By:** Avelabo Project Team  
**Status:** Draft for Review

---

# Part 1: Business Requirements Document

## 1. Executive Summary

### 1.1 Project Overview
Avelabo.com is a multi-vendor ecommerce marketplace designed to serve Malawi as its primary market, with expansion potential across Southern Africa. The platform enables local and international sellers to reach Malawian consumers while addressing unique regional challenges including limited payment infrastructure, currency volatility, and product availability gaps.

### 1.2 Vision Statement
To become Malawi's leading online marketplace, making quality products accessible to all Malawians while empowering local entrepreneurs to build successful online businesses.

### 1.3 Mission Statement
Provide a seamless, trustworthy ecommerce experience that bridges the gap between global product availability and local market needs through innovative payment solutions, competitive pricing, and reliable delivery.

### 1.4 Strategic Value Proposition

| Stakeholder | Value Delivered |
|-------------|-----------------|
| **Customers** | Access to products unavailable locally, competitive pricing in local currency, multiple payment options including mobile money |
| **Sellers** | Ready-made storefront, access to Malawian market, simplified logistics, multi-currency support |
| **Platform** | Transaction commissions, data insights, market positioning for regional expansion |

### 1.5 Key Differentiators
1. **Automated Product Sourcing** - Daily scraping from Takealot and Noon provides extensive catalog without manual effort
2. **Local Payment Integration** - TNM Mpamba, Airtel Money, and other Malawian payment methods
3. **Multi-Currency Transparency** - Prices displayed in MWK, ZAR, or USD with real-time conversion
4. **Low Barrier to Entry** - Simple KYC and onboarding for local sellers
5. **Cross-Border Commerce** - Seamless purchasing from South African and international suppliers

---

## 2. Business Objectives

### 2.1 Primary Objectives

| Objective | Description | Success Metric | Timeline |
|-----------|-------------|----------------|----------|
| **Market Entry** | Establish Avelabo as a recognized ecommerce platform in Malawi | 10,000 registered users | Month 6 |
| **Transaction Volume** | Process meaningful transaction volume | MWK 50M monthly GMV | Month 12 |
| **Seller Ecosystem** | Build active seller community | 100 approved sellers | Month 9 |
| **Customer Retention** | Create repeat purchase behavior | 25% repeat purchase rate | Month 12 |

### 2.2 Secondary Objectives

1. **Product Catalog Depth** - Maintain 50,000+ active SKUs through scraping and seller additions
2. **Payment Success Rate** - Achieve 85%+ payment completion rate
3. **Customer Satisfaction** - Maintain 4.0+ star platform rating
4. **Seller Success** - Enable 20% of sellers to earn MWK 500,000+ monthly
5. **Operational Efficiency** - Automate 80% of routine operations

### 2.3 Long-term Strategic Goals (Year 2-3)

- Expand to Zambia, Zimbabwe, and Mozambique
- Launch Avelabo-branded products
- Introduce Avelabo Logistics (warehousing and delivery)
- Develop B2B marketplace segment
- Achieve profitability through scale

---

## 3. Stakeholder Analysis

### 3.1 Internal Stakeholders

| Stakeholder | Role | Interest | Influence |
|-------------|------|----------|-----------|
| **Founders/Owners** | Strategic direction, funding | High | High |
| **Operations Team** | Daily management, seller support | High | Medium |
| **Technical Team** | Platform development, maintenance | High | Medium |
| **Finance Team** | Revenue, payouts, compliance | High | Medium |

### 3.2 External Stakeholders

| Stakeholder | Role | Interest | Influence |
|-------------|------|----------|-----------|
| **Customers** | End users, revenue source | High | High |
| **Sellers** | Product suppliers, partners | High | High |
| **Payment Providers** | Transaction processing | Medium | High |
| **Logistics Partners** | Order fulfillment | Medium | Medium |
| **Regulators** | Compliance oversight | Low | High |
| **Investors** | Funding, governance | High | High |

### 3.3 Stakeholder Requirements Matrix

**Customers Need:**
- Easy product discovery and search
- Trustworthy seller verification
- Secure payment processing
- Clear pricing (no hidden fees)
- Order tracking and updates
- Easy returns process
- Responsive customer support

**Sellers Need:**
- Simple onboarding process
- Low/competitive commission rates
- Timely payouts
- Sales analytics and insights
- Inventory management tools
- Customer communication tools
- Marketing support

**Platform Needs:**
- Sustainable revenue model
- Scalable infrastructure
- Risk management (fraud, disputes)
- Regulatory compliance
- Data for decision making
- Brand reputation protection

---

## 4. Functional Requirements

### 4.1 Customer Portal

#### 4.1.1 Account Management
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| CP-001 | User registration via email | Must Have | Simple form: name, email, password, phone |
| CP-002 | Social login (Google, Facebook) | Should Have | Phase 2 implementation |
| CP-003 | Phone number verification | Must Have | OTP via SMS |
| CP-004 | Profile management | Must Have | Name, addresses, preferences |
| CP-005 | Multiple delivery addresses | Must Have | Label as Home, Work, etc. |
| CP-006 | Order history access | Must Have | View all past orders |
| CP-007 | Wishlist functionality | Should Have | Save products for later |
| CP-008 | Currency preference setting | Must Have | Default display currency |

#### 4.1.2 Product Discovery
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| CP-009 | Category browsing | Must Have | Hierarchical categories |
| CP-010 | Product search | Must Have | Full-text search with filters |
| CP-011 | Search filters | Must Have | Price, brand, rating, availability |
| CP-012 | Sort options | Must Have | Price, popularity, newest, rating |
| CP-013 | Product recommendations | Should Have | Based on browsing history |
| CP-014 | Recently viewed products | Should Have | Track last 20 products |
| CP-015 | Shop/Seller pages | Must Have | Browse products by seller |
| CP-016 | Deal/Sale sections | Must Have | Highlighted discounted items |

#### 4.1.3 Product Details
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| CP-017 | Product images gallery | Must Have | Multiple images, zoom |
| CP-018 | Product description | Must Have | Rich text with specifications |
| CP-019 | Variant selection | Must Have | Color, size, etc. |
| CP-020 | Price display | Must Have | Current, original, discount % |
| CP-021 | Multi-currency pricing | Must Have | Toggle between currencies |
| CP-022 | Stock availability | Must Have | In stock, low stock, out of stock |
| CP-023 | Seller information | Must Have | Shop name, rating, link |
| CP-024 | Customer reviews | Should Have | Ratings and written reviews |
| CP-025 | Related products | Should Have | Similar items |
| CP-026 | Add to cart | Must Have | With quantity selector |
| CP-027 | Buy now | Should Have | Skip cart, direct checkout |

#### 4.1.4 Shopping Cart
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| CP-028 | Add/remove items | Must Have | Basic cart operations |
| CP-029 | Update quantities | Must Have | Increase/decrease |
| CP-030 | Cart persistence | Must Have | Survive sessions (72 hrs) |
| CP-031 | Guest cart to user merge | Must Have | On login/registration |
| CP-032 | Price updates | Must Have | Reflect current prices |
| CP-033 | Stock validation | Must Have | Check availability at checkout |
| CP-034 | Subtotal display | Must Have | In selected currency |
| CP-035 | Proceed to checkout | Must Have | Clear CTA button |

#### 4.1.5 Checkout Process
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| CP-036 | Guest checkout | Must Have | No account required |
| CP-037 | Address selection/entry | Must Have | Saved or new address |
| CP-038 | Payment method selection | Must Have | Show available gateways |
| CP-039 | Currency selection | Must Have | Display vs gateway currency |
| CP-040 | Price breakdown | Must Have | Subtotal, fees, total |
| CP-041 | Exchange rate display | Must Have | If currencies differ |
| CP-042 | Order notes | Should Have | Special instructions |
| CP-043 | Order review | Must Have | Final confirmation step |
| CP-044 | Payment processing | Must Have | Redirect or in-app |
| CP-045 | Order confirmation | Must Have | Success page + email |

#### 4.1.6 Order Management
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| CP-046 | Order status tracking | Must Have | Real-time status updates |
| CP-047 | Order details view | Must Have | Items, prices, addresses |
| CP-048 | Shipment tracking | Should Have | Carrier tracking integration |
| CP-049 | Order cancellation | Must Have | Before shipping only |
| CP-050 | Return requests | Should Have | Phase 2 - returns policy |
| CP-051 | Reorder functionality | Should Have | Quick reorder past items |

### 4.2 Seller Portal

#### 4.2.1 Onboarding & KYC
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| SP-001 | Seller registration | Must Have | Basic account creation |
| SP-002 | Shop profile setup | Must Have | Name, description, logo |
| SP-003 | Business type selection | Must Have | Individual, Company |
| SP-004 | Phone verification (OTP) | Must Have | Primary KYC step |
| SP-005 | Document upload | Must Have | ID front/back, selfie |
| SP-006 | Document type selection | Must Have | National ID, Passport, Driver's License |
| SP-007 | Business documents | Should Have | For registered companies |
| SP-008 | Bank account setup | Must Have | For payouts |
| SP-009 | Currency selection | Must Have | Default selling currency |
| SP-010 | KYC status tracking | Must Have | View application status |
| SP-011 | Resubmission flow | Must Have | If documents rejected |

#### 4.2.2 Product Management
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| SP-012 | Add single product | Must Have | Full product form |
| SP-013 | Bulk product upload | Should Have | CSV import |
| SP-014 | Product image upload | Must Have | Multiple images |
| SP-015 | Category assignment | Must Have | Select from hierarchy |
| SP-016 | Brand assignment | Must Have | Select or create |
| SP-017 | Pricing setup | Must Have | Price, compare price |
| SP-018 | Inventory management | Must Have | Stock quantities |
| SP-019 | Variant creation | Must Have | Color, size, etc. |
| SP-020 | Product status control | Must Have | Draft, active, inactive |
| SP-021 | Product editing | Must Have | Update any field |
| SP-022 | Product deletion | Must Have | Soft delete |
| SP-023 | Low stock alerts | Should Have | Configurable threshold |

#### 4.2.3 Order Management
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| SP-024 | Order notifications | Must Have | Email + dashboard |
| SP-025 | Order list view | Must Have | Filterable, sortable |
| SP-026 | Order detail view | Must Have | Customer info, items |
| SP-027 | Order status updates | Must Have | Confirm, ship, deliver |
| SP-028 | Tracking number entry | Must Have | With carrier selection |
| SP-029 | Packing slip generation | Should Have | Printable format |
| SP-030 | Order cancellation | Must Have | With reason |
| SP-031 | Refund initiation | Should Have | Full or partial |

#### 4.2.4 Financial Management
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| SP-032 | Earnings dashboard | Must Have | Revenue overview |
| SP-033 | Transaction history | Must Have | All order payments |
| SP-034 | Commission breakdown | Must Have | Per order visibility |
| SP-035 | Payout history | Must Have | All payouts made |
| SP-036 | Payout requests | Should Have | Manual payout requests |
| SP-037 | Bank account management | Must Have | Add/edit accounts |
| SP-038 | Invoice generation | Should Have | For payouts received |

#### 4.2.5 Analytics & Reports
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| SP-039 | Sales overview | Must Have | Revenue, orders, items |
| SP-040 | Product performance | Should Have | Views, sales, conversion |
| SP-041 | Customer insights | Should Have | New vs returning |
| SP-042 | Report exports | Should Have | CSV download |

### 4.3 Admin Portal

#### 4.3.1 Dashboard & Overview
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| AP-001 | Platform metrics dashboard | Must Have | GMV, orders, users |
| AP-002 | Real-time activity feed | Should Have | Recent orders, signups |
| AP-003 | Alert notifications | Must Have | Issues requiring attention |
| AP-004 | Quick action buttons | Should Have | Common admin tasks |

#### 4.3.2 User Management
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| AP-005 | Customer list | Must Have | Search, filter, view |
| AP-006 | Customer detail view | Must Have | Profile, orders, activity |
| AP-007 | Customer status management | Must Have | Active, suspend, ban |
| AP-008 | Admin user management | Must Have | Create admin accounts |
| AP-009 | Role/permission management | Should Have | Granular permissions |

#### 4.3.3 Seller Management
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| AP-010 | Pending KYC queue | Must Have | Applications to review |
| AP-011 | KYC document viewer | Must Have | View uploaded documents |
| AP-012 | KYC approval workflow | Must Have | Approve with notes |
| AP-013 | KYC rejection workflow | Must Have | Reject with reasons |
| AP-014 | Seller list | Must Have | All sellers with filters |
| AP-015 | Seller detail view | Must Have | Profile, products, orders |
| AP-016 | Seller status management | Must Have | Suspend, ban actions |
| AP-017 | Commission override | Should Have | Per-seller commission |
| AP-018 | Manual seller creation | Must Have | Admin-created sellers |

#### 4.3.4 Product Management
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| AP-019 | Product catalog view | Must Have | All products |
| AP-020 | Product moderation | Should Have | Approve/reject new products |
| AP-021 | Category management | Must Have | CRUD categories |
| AP-022 | Brand management | Must Have | CRUD brands |
| AP-023 | Attribute management | Must Have | Define product attributes |
| AP-024 | Featured product control | Must Have | Set featured items |
| AP-025 | Product removal | Must Have | Remove policy violations |

#### 4.3.5 Order Management
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| AP-026 | Order list view | Must Have | All orders |
| AP-027 | Order detail view | Must Have | Full order information |
| AP-028 | Order status override | Must Have | Admin status changes |
| AP-029 | Refund processing | Must Have | Process refunds |
| AP-030 | Dispute management | Should Have | Handle conflicts |

#### 4.3.6 Financial Management
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| AP-031 | Revenue dashboard | Must Have | Platform earnings |
| AP-032 | Seller payouts management | Must Have | Approve/process payouts |
| AP-033 | Transaction reconciliation | Must Have | Payment verification |
| AP-034 | Commission reports | Must Have | Earnings breakdown |
| AP-035 | Financial exports | Must Have | For accounting |

#### 4.3.7 Configuration Management
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| AP-036 | Currency management | Must Have | Add/edit currencies |
| AP-037 | Exchange rate management | Must Have | Manual + API updates |
| AP-038 | Payment gateway config | Must Have | Enable/disable, configure |
| AP-039 | Platform commission settings | Must Have | Default commission % |
| AP-040 | Scraping configuration | Must Have | Enable/disable sources |
| AP-041 | General settings | Must Have | Site name, contact, etc. |

#### 4.3.8 Scraping Management
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| AP-042 | Scraping job dashboard | Must Have | Status, stats |
| AP-043 | Manual scrape trigger | Must Have | Run on-demand |
| AP-044 | Scraping logs | Must Have | View job history |
| AP-045 | Source seller mapping | Must Have | Assign scraped products |
| AP-046 | Category mapping | Should Have | Map external categories |

#### 4.3.9 Reports & Analytics
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| AP-047 | Sales reports | Must Have | By period, seller, category |
| AP-048 | User reports | Must Have | Registrations, activity |
| AP-049 | Product reports | Must Have | Performance, inventory |
| AP-050 | Custom report builder | Could Have | Phase 2+ |

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

| Requirement | Specification | Measurement |
|-------------|---------------|-------------|
| Page Load Time | < 3 seconds | 95th percentile |
| API Response Time | < 500ms | Average |
| Search Results | < 1 second | 95th percentile |
| Checkout Process | < 5 seconds total | End-to-end |
| Concurrent Users | 1,000 minimum | Without degradation |
| Database Queries | < 100ms | Average |
| Image Loading | < 2 seconds | Largest image |

### 5.2 Scalability Requirements

| Aspect | Current Target | Growth Target |
|--------|---------------|---------------|
| Products | 100,000 SKUs | 1,000,000 SKUs |
| Daily Orders | 500 orders | 5,000 orders |
| Registered Users | 50,000 | 500,000 |
| Active Sellers | 500 | 5,000 |
| Page Views/Day | 100,000 | 1,000,000 |

### 5.3 Availability & Reliability

| Requirement | Target |
|-------------|--------|
| Uptime | 99.5% |
| Planned Maintenance Window | Sundays 2-4 AM CAT |
| Recovery Time Objective (RTO) | 4 hours |
| Recovery Point Objective (RPO) | 1 hour |
| Backup Frequency | Daily full, hourly incremental |

### 5.4 Security Requirements

| Category | Requirements |
|----------|--------------|
| **Data Encryption** | TLS 1.3 for transit, AES-256 for stored sensitive data |
| **Authentication** | Password hashing (bcrypt), session management, optional 2FA |
| **Authorization** | Role-based access control (RBAC) |
| **Payment Security** | PCI-DSS compliance via payment providers, no card storage |
| **Personal Data** | GDPR-aligned practices, data minimization |
| **API Security** | Rate limiting, API key authentication, CORS policies |
| **Infrastructure** | Firewall, DDoS protection, intrusion detection |
| **Audit Logging** | All admin actions, financial transactions, login attempts |

### 5.5 Usability Requirements

| Aspect | Requirement |
|--------|-------------|
| Mobile Responsiveness | Full functionality on mobile devices |
| Browser Support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| Accessibility | WCAG 2.1 Level AA compliance |
| Language | English (primary), Chichewa (Phase 2) |
| Error Messages | Clear, actionable error messages |
| Help Documentation | FAQ, help articles, contact support |

### 5.6 Compliance Requirements

| Regulation | Applicability | Actions Required |
|------------|---------------|------------------|
| Malawi E-Transactions Act | All online transactions | Terms of service, dispute resolution |
| Consumer Protection | Customer rights | Returns policy, clear pricing |
| Data Protection | Personal data handling | Privacy policy, consent mechanisms |
| Tax Compliance | VAT/Sales tax | Tax calculation, reporting |
| Anti-Money Laundering | Financial transactions | Seller KYC, transaction monitoring |

---

## 6. User Stories

### 6.1 Customer User Stories

**Account & Profile**
- As a customer, I want to register with my email and phone so that I can start shopping
- As a customer, I want to save multiple delivery addresses so that I can easily ship to different locations
- As a customer, I want to set my preferred currency so that I see prices in familiar terms

**Shopping**
- As a customer, I want to search for products by name so that I can quickly find what I need
- As a customer, I want to filter products by price range so that I can find items within my budget
- As a customer, I want to see product ratings and reviews so that I can make informed decisions
- As a customer, I want to compare prices in different currencies so that I can understand the true cost
- As a customer, I want to add items to my cart without logging in so that I can browse freely

**Checkout**
- As a customer, I want to checkout as a guest so that I can complete my purchase quickly
- As a customer, I want to pay with mobile money (TNM Mpamba) so that I can use my preferred payment method
- As a customer, I want to see the exact amount I'll be charged in the payment currency so there are no surprises
- As a customer, I want to receive order confirmation via email and SMS so that I have records

**Post-Purchase**
- As a customer, I want to track my order status so that I know when to expect delivery
- As a customer, I want to contact the seller about my order so that I can resolve any issues
- As a customer, I want to leave a review after receiving my order so that I can help other customers

### 6.2 Seller User Stories

**Onboarding**
- As a seller, I want to register my shop with basic information so that I can start selling quickly
- As a seller, I want to verify my phone number so that I can prove my identity
- As a seller, I want to upload my ID documents so that I can complete KYC
- As a seller, I want to see my KYC application status so that I know what to expect

**Product Management**
- As a seller, I want to add products with images and descriptions so that customers can see what I'm selling
- As a seller, I want to set prices in my preferred currency so that I can manage my business effectively
- As a seller, I want to create product variants (sizes, colors) so that I can offer options
- As a seller, I want to manage my inventory levels so that I don't oversell

**Orders**
- As a seller, I want to receive notifications for new orders so that I can fulfill them promptly
- As a seller, I want to update order status so that customers know their order progress
- As a seller, I want to add tracking numbers so that customers can track shipments
- As a seller, I want to see my earnings and pending payouts so that I can manage cash flow

### 6.3 Admin User Stories

**Seller Management**
- As an admin, I want to review KYC applications so that I can approve legitimate sellers
- As an admin, I want to view seller documents so that I can verify identity
- As an admin, I want to suspend sellers who violate policies so that I can protect customers
- As an admin, I want to manually create seller accounts so that I can onboard partners

**Platform Management**
- As an admin, I want to manage product categories so that the catalog is organized
- As an admin, I want to set exchange rates so that pricing is accurate
- As an admin, I want to configure payment gateways so that customers have payment options
- As an admin, I want to run product scraping manually so that I can update the catalog on demand

**Operations**
- As an admin, I want to view all orders so that I can monitor platform activity
- As an admin, I want to process refunds so that I can resolve customer issues
- As an admin, I want to generate sales reports so that I can track business performance

---

## 7. Business Rules

### 7.1 Seller Rules

| Rule ID | Rule Description |
|---------|------------------|
| SR-001 | Sellers must complete phone verification before KYC document submission |
| SR-002 | Sellers must upload valid government-issued ID (front and back) plus selfie |
| SR-003 | Sellers cannot list products until KYC is approved |
| SR-004 | Sellers must respond to orders within 48 hours or face penalties |
| SR-005 | Seller payouts are processed weekly for balances above minimum threshold |
| SR-006 | Sellers are responsible for product accuracy and fulfillment |
| SR-007 | Platform reserves right to remove products violating policies |
| SR-008 | Seller commission is deducted at time of order payment |
| SR-009 | Sellers may set prices in their chosen currency only |
| SR-010 | Scraped product sellers (Takealot, Noon) are system-managed accounts |

### 7.2 Customer Rules

| Rule ID | Rule Description |
|---------|------------------|
| CR-001 | Customers may checkout as guests or registered users |
| CR-002 | Cart items expire after 72 hours of inactivity |
| CR-003 | Maximum 50 items per cart |
| CR-004 | Customers can cancel orders only before shipment |
| CR-005 | Refunds are processed to original payment method |
| CR-006 | Customers must verify phone for certain high-value orders |
| CR-007 | One account per email address |
| CR-008 | Reviews can only be submitted for purchased products |

### 7.3 Pricing & Currency Rules

| Rule ID | Rule Description |
|---------|------------------|
| PR-001 | All seller prices are stored in seller's chosen currency |
| PR-002 | Display prices are converted using current exchange rates |
| PR-003 | Payment amount is converted to gateway currency at checkout |
| PR-004 | Exchange rates are updated minimum once daily |
| PR-005 | Platform may add markup percentage to exchange rates |
| PR-006 | Final payment amount is locked at checkout initiation |
| PR-007 | Sellers receive payout in their registered bank account currency |
| PR-008 | Commission is calculated on gateway currency amount |

### 7.4 Payment Rules

| Rule ID | Rule Description |
|---------|------------------|
| PM-001 | Orders remain pending until payment is confirmed |
| PM-002 | Failed payments automatically cancel order after 30 minutes |
| PM-003 | Payment gateway fees are absorbed by platform (not customer) |
| PM-004 | Refunds must be processed within 7 business days |
| PM-005 | Partial refunds are supported for multi-item orders |
| PM-006 | Payment gateway selection based on order currency and customer preference |

### 7.5 Scraping Rules

| Rule ID | Rule Description |
|---------|------------------|
| SC-001 | Scraping runs daily at 2:00 AM CAT |
| SC-002 | Scraped prices are converted to MWK as base |
| SC-003 | Products not found in scrape are marked inactive, not deleted |
| SC-004 | New products from scraping go live immediately (no moderation) |
| SC-005 | Scraping respects rate limits of source websites |
| SC-006 | Scraping failures trigger admin alerts |

---

## 8. Data Requirements

### 8.1 Core Data Entities

| Entity | Description | Volume Estimate |
|--------|-------------|-----------------|
| Users | Customer accounts | 50,000 Year 1 |
| Sellers | Vendor accounts | 500 Year 1 |
| Products | Product listings | 100,000 Year 1 |
| Orders | Customer orders | 50,000 Year 1 |
| Payments | Payment transactions | 50,000 Year 1 |
| Categories | Product categories | 500 |
| Brands | Product brands | 2,000 |

### 8.2 Data Retention Policy

| Data Type | Retention Period | Notes |
|-----------|------------------|-------|
| Order Data | 7 years | Legal/tax requirements |
| Payment Data | 7 years | Financial compliance |
| Customer Accounts | Until deletion request | GDPR compliance |
| KYC Documents | 5 years post-verification | AML compliance |
| Product Data | Indefinite | Soft deleted only |
| Analytics Data | 3 years | Aggregated after |
| Logs | 1 year | Security and debugging |

### 8.3 Data Backup Strategy

| Backup Type | Frequency | Retention | Location |
|-------------|-----------|-----------|----------|
| Full Database | Daily | 30 days | Primary + DR site |
| Incremental | Hourly | 7 days | Primary + DR site |
| File Storage | Daily | 30 days | Primary + DR site |
| Configuration | On change | 90 days | Version control |

---

## 9. Integration Requirements

### 9.1 Payment Gateway Integrations

| Gateway | Type | Region | Priority | Currency |
|---------|------|--------|----------|----------|
| PayChangu | Card, Mobile Money, Bank | Malawi | Must Have | MWK |
| TNM Mpamba | Mobile Money | Malawi | Must Have | MWK |
| Airtel Money | Mobile Money | Malawi | Should Have | MWK |
| PayFast | Card, EFT | South Africa | Must Have | ZAR |

**Integration Requirements per Gateway:**
- API authentication and security
- Payment initiation
- Payment verification/callback
- Refund processing
- Transaction status queries
- Webhook handling

### 9.2 External Service Integrations

| Service | Purpose | Priority |
|---------|---------|----------|
| SMS Provider (Twilio/Local) | OTP, notifications | Must Have |
| Email Service (SendGrid/SES) | Transactional emails | Must Have |
| Exchange Rate API | Currency conversion | Must Have |
| Cloud Storage (S3/equivalent) | File storage | Must Have |
| Analytics (Google Analytics) | User behavior tracking | Should Have |
| Error Tracking (Sentry) | Error monitoring | Should Have |

### 9.3 Scraping Targets

| Source | Region | Product Types | API/Scraping |
|--------|--------|---------------|--------------|
| Takealot | South Africa | General merchandise | API + Scraping |
| Noon | UAE/Middle East | General merchandise | API + Scraping |

---

## 10. Risks and Mitigations

### 10.1 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low customer adoption | Medium | High | Marketing investment, competitive pricing |
| Seller quality issues | Medium | High | Strong KYC, ratings system, quick suspension |
| Payment failures | Medium | High | Multiple gateway options, retry logic |
| Currency volatility | High | Medium | Real-time rates, short settlement periods |
| Competition entry | Medium | Medium | First-mover advantage, local focus |

### 10.2 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Scraping blocked | High | Medium | Rotate IPs, respect rate limits, API alternatives |
| Payment gateway downtime | Low | High | Multiple backup gateways |
| Data breach | Low | Critical | Security best practices, encryption, monitoring |
| Scalability issues | Medium | High | Cloud infrastructure, performance monitoring |
| Third-party API changes | Medium | Medium | Abstraction layers, monitoring, quick response |

### 10.3 Operational Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Fraud (customer/seller) | Medium | High | KYC, transaction monitoring, limits |
| Logistics failures | Medium | Medium | Multiple logistics partners, tracking |
| Customer support overload | Medium | Medium | Self-service tools, FAQ, chatbot |
| Regulatory changes | Low | High | Legal monitoring, compliance buffer |

---

## 11. Assumptions and Dependencies

### 11.1 Assumptions

1. Mobile money (TNM Mpamba, Airtel Money) remains the dominant payment method in Malawi
2. Internet penetration in Malawi continues to grow
3. Takealot and Noon APIs/websites remain accessible for scraping
4. Exchange rates can be obtained reliably via API
5. Local logistics partners are available for delivery
6. Target customers have smartphones with internet access

### 11.2 Dependencies

| Dependency | Type | Risk if Unavailable |
|------------|------|---------------------|
| Payment gateway APIs | External | Cannot process payments |
| SMS provider | External | Cannot verify phones, send notifications |
| Cloud hosting | External | Platform unavailable |
| Exchange rate API | External | Cannot convert currencies (fallback to manual) |
| Scraping targets | External | Reduced product catalog |

---

## 12. Acceptance Criteria

### 12.1 Phase 1 (MVP) Acceptance Criteria

**Customer Portal**
- [ ] User can register, login, and manage profile
- [ ] User can browse products by category
- [ ] User can search products with filters
- [ ] User can view product details with images
- [ ] User can add products to cart
- [ ] User can complete checkout with PayChangu or TNM Mpamba
- [ ] User can view order history and status
- [ ] Prices display correctly in MWK, ZAR, USD

**Seller Portal**
- [ ] Seller can register and complete KYC
- [ ] Seller can add/edit products with images
- [ ] Seller can manage inventory
- [ ] Seller can view and process orders
- [ ] Seller can see earnings dashboard

**Admin Portal**
- [ ] Admin can review and approve/reject seller KYC
- [ ] Admin can manage products and categories
- [ ] Admin can view all orders
- [ ] Admin can configure currencies and exchange rates
- [ ] Admin can manage payment gateways
- [ ] Admin can trigger and monitor scraping jobs

**System**
- [ ] Daily scraping from Takealot works correctly
- [ ] Currency conversion works accurately
- [ ] Payment processing completes successfully
- [ ] Email notifications send correctly
- [ ] SMS OTP works correctly

### 12.2 Performance Acceptance Criteria

- [ ] Homepage loads in under 3 seconds
- [ ] Search returns results in under 2 seconds
- [ ] Checkout completes in under 30 seconds (excluding payment gateway)
- [ ] System handles 100 concurrent users without degradation

---
---

# Part 2: Execution Plan

## 13. Project Phases & Timeline

### 13.1 Phase Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AVELABO DEVELOPMENT TIMELINE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PHASE 0: Planning & Setup (Weeks 1-2)                                      │
│  ████████                                                                   │
│                                                                             │
│  PHASE 1: Foundation (Weeks 3-6)                                            │
│          ████████████████                                                   │
│                                                                             │
│  PHASE 2: Seller System (Weeks 7-10)                                        │
│                        ████████████████                                     │
│                                                                             │
│  PHASE 3: Shopping Experience (Weeks 11-16)                                 │
│                                        ████████████████████████             │
│                                                                             │
│  PHASE 4: Payments & Orders (Weeks 17-22)                                   │
│                                                              ██████████████ │
│                                                                             │
│  PHASE 5: Scraping & Automation (Weeks 23-26)                               │
│                                                                        ████ │
│                                                                             │
│  PHASE 6: Admin & Polish (Weeks 27-30)                                      │
│                                                                        ████ │
│                                                                             │
│  PHASE 7: Testing & Launch (Weeks 31-34)                                    │
│                                                                        ████ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Total Timeline: 34 Weeks (~8 months)**

### 13.2 Detailed Phase Breakdown

#### Phase 0: Planning & Setup (Weeks 1-2)

**Objectives:**
- Finalize technical architecture decisions
- Set up development environment and tools
- Establish project management workflows
- Secure necessary accounts and API access

**Deliverables:**
| Deliverable | Owner | Due |
|-------------|-------|-----|
| Technical architecture document | Tech Lead | Week 1 |
| Development environment setup | Developer | Week 1 |
| Git repository with branching strategy | Developer | Week 1 |
| Project management board (Trello/Jira) | PM | Week 1 |
| Payment gateway sandbox accounts | Finance/Dev | Week 2 |
| SMS provider account | Developer | Week 2 |
| Cloud hosting account | Developer | Week 2 |
| Domain and SSL certificates | DevOps | Week 2 |

**Exit Criteria:**
- All team members can run project locally
- CI/CD pipeline configured
- All external service accounts active

---

#### Phase 1: Foundation (Weeks 3-6)

**Objectives:**
- Establish database architecture
- Build core service layer
- Implement currency system
- Create base UI components

**Week 3-4: Database & Models**
| Task | Priority | Effort |
|------|----------|--------|
| Countries and currencies tables | Must Have | 4 hours |
| Exchange rates system | Must Have | 8 hours |
| Payment gateways configuration | Must Have | 6 hours |
| User and role system | Must Have | 8 hours |
| Base model relationships | Must Have | 6 hours |
| Database seeders | Must Have | 4 hours |

**Week 5-6: Core Services**
| Task | Priority | Effort |
|------|----------|--------|
| Currency conversion service | Must Have | 12 hours |
| Exchange rate update service | Must Have | 8 hours |
| Authentication system | Must Have | 10 hours |
| File upload service | Must Have | 6 hours |
| Base Inertia/Vue setup | Must Have | 8 hours |
| UI component library setup | Must Have | 8 hours |

**Deliverables:**
- Functional database with migrations
- Currency conversion working
- User authentication working
- Base admin layout

**Exit Criteria:**
- Users can register and login
- Currencies display correctly
- Exchange rates update via API

---

#### Phase 2: Seller System (Weeks 7-10)

**Objectives:**
- Build seller registration flow
- Implement KYC verification system
- Create seller dashboard foundation
- Enable admin seller management

**Week 7-8: Seller Onboarding**
| Task | Priority | Effort |
|------|----------|--------|
| Seller registration forms | Must Have | 8 hours |
| Shop profile setup | Must Have | 6 hours |
| Phone OTP verification | Must Have | 10 hours |
| SMS integration | Must Have | 6 hours |
| Business type selection | Must Have | 4 hours |

**Week 9-10: KYC System**
| Task | Priority | Effort |
|------|----------|--------|
| Document upload interface | Must Have | 8 hours |
| Document storage (secure) | Must Have | 6 hours |
| KYC status tracking | Must Have | 6 hours |
| Admin KYC review interface | Must Have | 12 hours |
| Approval/rejection workflows | Must Have | 8 hours |
| Notification emails for KYC status | Must Have | 4 hours |
| Bank account management | Must Have | 6 hours |

**Deliverables:**
- Complete seller registration flow
- Working phone verification
- Admin can review and approve sellers
- Seller dashboard shell

**Exit Criteria:**
- Seller can complete registration end-to-end
- Admin can approve seller in < 2 minutes
- Rejected sellers can resubmit

---

#### Phase 3: Shopping Experience (Weeks 11-16)

**Objectives:**
- Build product management system
- Create product catalog frontend
- Implement search and filtering
- Build shopping cart

**Week 11-12: Product Backend**
| Task | Priority | Effort |
|------|----------|--------|
| Category management | Must Have | 8 hours |
| Brand management | Must Have | 4 hours |
| Product CRUD | Must Have | 16 hours |
| Product images handling | Must Have | 8 hours |
| Product variants system | Must Have | 12 hours |
| Product attributes | Must Have | 8 hours |
| Multi-currency pricing | Must Have | 10 hours |

**Week 13-14: Seller Product Management**
| Task | Priority | Effort |
|------|----------|--------|
| Seller product list view | Must Have | 6 hours |
| Add product form | Must Have | 10 hours |
| Edit product form | Must Have | 6 hours |
| Image upload interface | Must Have | 8 hours |
| Variant management UI | Must Have | 10 hours |
| Inventory management | Must Have | 6 hours |
| Product status control | Must Have | 4 hours |

**Week 15-16: Customer Product Experience**
| Task | Priority | Effort |
|------|----------|--------|
| Homepage with featured products | Must Have | 10 hours |
| Category browse pages | Must Have | 8 hours |
| Product search implementation | Must Have | 12 hours |
| Search filters (price, brand, etc.) | Must Have | 10 hours |
| Product detail page | Must Have | 12 hours |
| Currency switcher | Must Have | 6 hours |
| Shopping cart system | Must Have | 16 hours |

**Deliverables:**
- Sellers can add and manage products
- Customers can browse and search products
- Shopping cart fully functional
- Currency switching works

**Exit Criteria:**
- 100 test products in system
- Search returns relevant results in < 2 seconds
- Cart persists across sessions

---

#### Phase 4: Payments & Orders (Weeks 17-22)

**Objectives:**
- Integrate all payment gateways
- Build checkout flow
- Implement order management
- Create seller order processing

**Week 17-18: Payment Gateway Integration**
| Task | Priority | Effort |
|------|----------|--------|
| Payment gateway abstraction layer | Must Have | 8 hours |
| PayChangu integration | Must Have | 16 hours |
| TNM Mpamba integration | Must Have | 16 hours |
| PayFast integration | Must Have | 12 hours |
| Webhook handlers | Must Have | 10 hours |
| Payment verification flows | Must Have | 8 hours |

**Week 19-20: Checkout System**
| Task | Priority | Effort |
|------|----------|--------|
| Checkout page design | Must Have | 8 hours |
| Address selection/entry | Must Have | 8 hours |
| Payment method selection | Must Have | 6 hours |
| Price calculation with currency conversion | Must Have | 10 hours |
| Guest checkout flow | Must Have | 8 hours |
| Order creation | Must Have | 10 hours |
| Payment initiation | Must Have | 8 hours |
| Order confirmation page/email | Must Have | 6 hours |

**Week 21-22: Order Management**
| Task | Priority | Effort |
|------|----------|--------|
| Customer order history | Must Have | 8 hours |
| Customer order detail view | Must Have | 6 hours |
| Seller order notifications | Must Have | 6 hours |
| Seller order list | Must Have | 8 hours |
| Seller order processing | Must Have | 10 hours |
| Order status updates | Must Have | 6 hours |
| Tracking number entry | Must Have | 4 hours |
| Admin order management | Must Have | 10 hours |
| Refund processing | Must Have | 12 hours |

**Deliverables:**
- All payment gateways working
- Complete checkout flow
- Order management for all user types
- Email notifications for orders

**Exit Criteria:**
- Successful test payments on all gateways
- Order flows from cart to delivery status
- Refund can be processed

---

#### Phase 5: Scraping & Automation (Weeks 23-26)

**Objectives:**
- Build product scraping infrastructure
- Implement Takealot scraper
- Implement Noon scraper
- Set up automated scheduling

**Week 23-24: Scraping Infrastructure**
| Task | Priority | Effort |
|------|----------|--------|
| Scraper interface design | Must Have | 4 hours |
| Rate limiting system | Must Have | 6 hours |
| Job queue setup | Must Have | 6 hours |
| Scraping job tracking | Must Have | 8 hours |
| Image download and storage | Must Have | 8 hours |
| Category mapping system | Must Have | 8 hours |
| Error handling and logging | Must Have | 6 hours |

**Week 25-26: Scraper Implementation**
| Task | Priority | Effort |
|------|----------|--------|
| Takealot API/scraper | Must Have | 20 hours |
| Product data transformation | Must Have | 8 hours |
| Noon API/scraper | Should Have | 16 hours |
| Price conversion (ZAR/AED to MWK) | Must Have | 6 hours |
| Scheduled job setup | Must Have | 4 hours |
| Admin scraping interface | Must Have | 10 hours |
| Monitoring and alerts | Must Have | 6 hours |

**Deliverables:**
- Working Takealot scraper
- Working Noon scraper (if time permits)
- Automated daily scraping
- Admin can monitor and trigger scrapes

**Exit Criteria:**
- 10,000+ products imported from Takealot
- Scraping runs successfully for 7 consecutive days
- Failed scrapes trigger alerts

---

#### Phase 6: Admin & Polish (Weeks 27-30)

**Objectives:**
- Complete admin dashboard
- Build reporting system
- Implement notifications
- UI/UX polish

**Week 27-28: Admin Features**
| Task | Priority | Effort |
|------|----------|--------|
| Admin dashboard metrics | Must Have | 10 hours |
| User management | Must Have | 8 hours |
| Product moderation | Should Have | 6 hours |
| Financial reports | Must Have | 12 hours |
| Sales reports | Must Have | 10 hours |
| Seller payout management | Must Have | 10 hours |
| Platform settings | Must Have | 8 hours |

**Week 29-30: Polish & Optimization**
| Task | Priority | Effort |
|------|----------|--------|
| Notification system (email templates) | Must Have | 10 hours |
| SMS notifications | Must Have | 6 hours |
| Performance optimization | Must Have | 12 hours |
| Caching implementation | Must Have | 8 hours |
| Mobile responsiveness fixes | Must Have | 10 hours |
| UI consistency review | Must Have | 8 hours |
| Error message improvements | Must Have | 4 hours |
| Loading states and feedback | Must Have | 6 hours |

**Deliverables:**
- Complete admin portal
- All reports functional
- Polished UI across all portals
- Performance targets met

**Exit Criteria:**
- All admin functions working
- Page load times under 3 seconds
- Mobile experience acceptable

---

#### Phase 7: Testing & Launch (Weeks 31-34)

**Objectives:**
- Comprehensive testing
- Security audit
- Soft launch with limited users
- Full public launch

**Week 31-32: Testing**
| Task | Priority | Effort |
|------|----------|--------|
| Unit test coverage | Must Have | 16 hours |
| Integration testing | Must Have | 12 hours |
| End-to-end testing | Must Have | 16 hours |
| Payment gateway testing (live) | Must Have | 10 hours |
| Load testing | Must Have | 8 hours |
| Security testing | Must Have | 12 hours |
| Bug fixes from testing | Must Have | 20 hours |

**Week 33: Soft Launch**
| Task | Priority | Effort |
|------|----------|--------|
| Production environment setup | Must Have | 8 hours |
| Data migration (if any) | Must Have | 4 hours |
| Monitoring setup | Must Have | 6 hours |
| Invite beta users (50-100) | Must Have | 4 hours |
| Beta feedback collection | Must Have | Ongoing |
| Critical bug fixes | Must Have | 20 hours |

**Week 34: Public Launch**
| Task | Priority | Effort |
|------|----------|--------|
| Final bug fixes | Must Have | 16 hours |
| Marketing site/landing page | Must Have | 8 hours |
| Documentation (help articles) | Must Have | 10 hours |
| Launch announcement | Must Have | 4 hours |
| Monitoring and support | Must Have | Ongoing |

**Deliverables:**
- Fully tested platform
- Production environment live
- Beta feedback incorporated
- Public launch completed

**Exit Criteria:**
- Zero critical bugs
- All acceptance criteria met
- Successful transactions in production

---

## 14. Resource Requirements

### 14.1 Team Structure

| Role | Count | Responsibility | Engagement |
|------|-------|----------------|------------|
| **Project Manager** | 1 | Planning, coordination, stakeholder management | Full-time |
| **Full-Stack Developer** | 2 | Laravel + Vue development | Full-time |
| **Frontend Developer** | 1 | Vue/Inertia, UI/UX implementation | Full-time |
| **DevOps Engineer** | 0.5 | Infrastructure, CI/CD, monitoring | Part-time |
| **QA Engineer** | 1 | Testing, quality assurance | Full-time (Phase 6+) |
| **UI/UX Designer** | 0.5 | Design systems, user flows | Part-time |

### 14.2 Skills Required

**Technical:**
- Laravel 12 expertise
- Vue 3 + InertiaJS
- PostgreSQL
- Redis
- RESTful API design
- Payment gateway integration
- Web scraping (PHP/Python)
- AWS/Cloud infrastructure

**Domain:**
- Ecommerce platform experience
- Payment processing knowledge
- Multi-currency handling
- Marketplace dynamics

### 14.3 Infrastructure Requirements

| Component | Specification | Monthly Cost (Est.) |
|-----------|---------------|---------------------|
| Web Server | 4 vCPU, 8GB RAM | $80 |
| Database Server | 2 vCPU, 4GB RAM, SSD | $60 |
| Redis Cache | 1GB | $15 |
| File Storage (S3) | 100GB | $5 |
| CDN | 100GB transfer | $20 |
| SSL Certificate | Wildcard | $10 |
| Email Service | 10,000 emails/month | $15 |
| SMS Service | 5,000 SMS/month | $50 |
| Monitoring | Basic plan | $20 |
| **Total Infrastructure** | | **~$275/month** |

### 14.4 Third-Party Services

| Service | Purpose | Setup Cost | Monthly Cost |
|---------|---------|------------|--------------|
| PayChangu | Payment gateway | Free | Transaction fees |
| TNM Mpamba | Mobile money | Varies | Transaction fees |
| PayFast | SA payments | Free | Transaction fees |
| Twilio/Local SMS | SMS delivery | Free | Per SMS |
| SendGrid | Email delivery | Free tier | $0-20 |
| Exchange Rate API | Currency rates | Free tier | $0-15 |
| Sentry | Error tracking | Free tier | $0 |
| Google Analytics | Analytics | Free | $0 |

---

## 15. Budget Estimate

### 15.1 Development Costs

| Category | Calculation | Cost (USD) |
|----------|-------------|------------|
| Full-Stack Developer (2) | $3,000/month × 8 months × 2 | $48,000 |
| Frontend Developer (1) | $2,500/month × 8 months | $20,000 |
| DevOps (0.5) | $2,000/month × 8 months × 0.5 | $8,000 |
| QA Engineer (1) | $2,000/month × 4 months | $8,000 |
| UI/UX Designer (0.5) | $2,000/month × 8 months × 0.5 | $8,000 |
| Project Manager (1) | $2,500/month × 8 months | $20,000 |
| **Total Development** | | **$112,000** |

*Note: Costs based on African market rates. Adjust for your specific situation.*

### 15.2 Infrastructure & Services (Year 1)

| Category | Monthly | Annual |
|----------|---------|--------|
| Cloud Infrastructure | $275 | $3,300 |
| Third-party Services | $100 | $1,200 |
| Domain & SSL | $10 | $120 |
| Contingency (20%) | $77 | $924 |
| **Total Infrastructure** | **$462** | **$5,544** |

### 15.3 Operational Costs (Post-Launch)

| Category | Monthly | Notes |
|----------|---------|-------|
| Customer Support | $500 | 1 part-time agent |
| Maintenance Dev | $1,500 | Bug fixes, minor features |
| Marketing | $1,000 | Initial growth phase |
| Payment Processing | Variable | ~2-3% of GMV |
| **Total Operations** | **$3,000+** | Excluding payment fees |

### 15.4 Total Budget Summary

| Phase | Cost (USD) |
|-------|------------|
| Development (8 months) | $112,000 |
| Infrastructure (Year 1) | $5,544 |
| Pre-launch Marketing | $3,000 |
| Contingency (15%) | $18,082 |
| **Total to Launch** | **$138,626** |
| Monthly Operations (Post-Launch) | $3,000+ |

---

## 16. Go-to-Market Strategy

### 16.1 Pre-Launch (Weeks 30-34)

**Activities:**
1. **Seller Recruitment**
   - Identify 20-30 quality local sellers
   - Personal outreach and onboarding assistance
   - Offer reduced commission for early adopters

2. **Beta User Program**
   - Recruit 100 beta customers
   - Provide incentives (discounts, free shipping)
   - Collect feedback actively

3. **Content Preparation**
   - Product photography guidelines for sellers
   - Help documentation
   - FAQ compilation
   - Social media content calendar

### 16.2 Launch Phase (Months 1-3)

**Week 1-2: Soft Launch**
- Limited marketing
- Focus on fixing issues
- Personal customer support

**Week 3-4: Public Launch**
- Press release to local media
- Social media announcement
- Launch promotions

**Month 2-3: Growth Push**
- Influencer partnerships
- Referral program launch
- Targeted Facebook/Instagram ads
- Partnership with local businesses

### 16.3 Marketing Channels

| Channel | Strategy | Budget Allocation |
|---------|----------|-------------------|
| Facebook/Instagram | Targeted ads, organic content | 40% |
| WhatsApp | Customer groups, broadcast lists | 10% |
| Local Radio | Brand awareness spots | 15% |
| Influencers | Product reviews, unboxing | 20% |
| Referral Program | Customer acquisition | 15% |

### 16.4 Launch Promotions

| Promotion | Details | Duration |
|-----------|---------|----------|
| Free Shipping | On orders above MWK 20,000 | First month |
| Welcome Discount | 10% off first order | Ongoing |
| Referral Bonus | MWK 2,000 credit per referral | Ongoing |
| Seller Incentive | 5% commission (vs 10%) | First 3 months |

---

## 17. Success Metrics & KPIs

### 17.1 Business KPIs

| Metric | Month 1 | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|---------|----------|
| Registered Users | 500 | 2,000 | 10,000 | 30,000 |
| Active Sellers | 15 | 40 | 100 | 250 |
| Monthly Orders | 100 | 500 | 2,000 | 5,000 |
| GMV (MWK millions) | 2 | 10 | 50 | 150 |
| Average Order Value | MWK 20,000 | MWK 20,000 | MWK 25,000 | MWK 30,000 |

### 17.2 Operational KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Payment Success Rate | >85% | Completed / Initiated |
| Order Fulfillment Rate | >95% | Shipped / Paid |
| Customer Satisfaction | >4.0/5 | Post-order survey |
| Seller Response Time | <24 hours | Order confirmation |
| Support Response Time | <4 hours | First response |
| Platform Uptime | >99.5% | Monitoring |

### 17.3 Financial KPIs

| Metric | Target | Notes |
|--------|--------|-------|
| Gross Margin | 10% | Commission - payment fees |
| Customer Acquisition Cost | <MWK 5,000 | Marketing / New customers |
| Customer Lifetime Value | >MWK 50,000 | Average revenue per customer |
| Monthly Burn Rate | <$5,000 | Until profitability |
| Break-even GMV | MWK 500M/month | At 10% commission |

### 17.4 Reporting Cadence

| Report | Frequency | Audience |
|--------|-----------|----------|
| Daily Metrics Dashboard | Daily | Operations Team |
| Weekly Business Review | Weekly | Management |
| Monthly Performance Report | Monthly | Stakeholders/Investors |
| Quarterly Strategy Review | Quarterly | Board/Founders |

---

## 18. Risk Management

### 18.1 Risk Register

| ID | Risk | Probability | Impact | Score | Mitigation | Owner |
|----|------|-------------|--------|-------|------------|-------|
| R01 | Payment gateway issues | Medium | High | High | Multiple backup gateways | Tech Lead |
| R02 | Scraping blocked by sources | High | Medium | High | API alternatives, IP rotation | Developer |
| R03 | Low seller adoption | Medium | High | High | Direct outreach, incentives | PM |
| R04 | Low customer trust | Medium | High | High | KYC, reviews, guarantees | PM |
| R05 | Currency volatility losses | High | Medium | High | Real-time rates, short settlement | Finance |
| R06 | Fraud (fake sellers) | Medium | High | High | Strong KYC, transaction limits | Operations |
| R07 | Logistics failures | Medium | Medium | Medium | Multiple partners, tracking | Operations |
| R08 | Technical scalability | Low | High | Medium | Cloud infrastructure, monitoring | Tech Lead |
| R09 | Regulatory compliance | Low | High | Medium | Legal review, compliance officer | PM |
| R10 | Key person dependency | Medium | Medium | Medium | Documentation, cross-training | PM |

### 18.2 Contingency Plans

**Payment Gateway Failure:**
- Primary: PayChangu
- Secondary: TNM Mpamba direct
- Tertiary: Manual bank transfer (temporary)

**Scraping Failure:**
- Short-term: Manual product entry
- Medium-term: Alternative sources
- Long-term: Direct supplier partnerships

**Low Adoption:**
- Increase marketing budget
- Pivot to B2B marketplace
- Partner with established retailers

---

## 19. Post-Launch Roadmap

### 19.1 Phase 2 Features (Months 4-6)

| Feature | Priority | Effort |
|---------|----------|--------|
| Airtel Money integration | High | 2 weeks |
| Customer reviews and ratings | High | 2 weeks |
| Seller analytics dashboard | Medium | 2 weeks |
| Bulk product upload (CSV) | Medium | 1 week |
| Wishlist functionality | Medium | 1 week |
| Email marketing integration | Medium | 1 week |
| Chichewa language support | Low | 3 weeks |

### 19.2 Phase 3 Features (Months 7-12)

| Feature | Priority | Effort |
|---------|----------|--------|
| Mobile app (React Native) | High | 8 weeks |
| Avelabo Logistics integration | High | 4 weeks |
| Flash sales and deals | Medium | 2 weeks |
| Seller subscription tiers | Medium | 2 weeks |
| Advanced analytics | Medium | 3 weeks |
| API for seller integrations | Low | 3 weeks |

### 19.3 Year 2 Vision

1. **Geographic Expansion**
   - Launch in Zambia
   - Explore Zimbabwe and Mozambique

2. **Vertical Expansion**
   - B2B marketplace
   - Avelabo-branded products
   - Fulfillment services

3. **Technology Enhancement**
   - AI-powered recommendations
   - Chatbot customer support
   - Advanced fraud detection

---

## 20. Appendices

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| GMV | Gross Merchandise Value - total value of goods sold |
| SKU | Stock Keeping Unit - unique product identifier |
| KYC | Know Your Customer - identity verification process |
| MWK | Malawian Kwacha |
| ZAR | South African Rand |
| CAT | Central Africa Time |
| OTP | One-Time Password |

### Appendix B: Reference Documents

1. Malawi E-Transactions Act
2. Consumer Protection Guidelines
3. Payment Gateway API Documentation
4. Competitor Analysis Report
5. Market Research Data

### Appendix C: Approval Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Sponsor | | | |
| Technical Lead | | | |
| Business Owner | | | |
| Finance Approval | | | |

---

**Document Control:**
- Version 1.0 - Initial Draft
- Review Date: [TBD]
- Next Update: [TBD]

---

*This document serves as the foundational business requirements and execution plan for Avelabo.com. All stakeholders should review and provide feedback before development commences.*
