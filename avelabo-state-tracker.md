## Breakdown
These are the baseline requirements/features I want to have for a working application for Avelabo.
Features are defined per version and sometimes grouped per layer of functionality, sometimes by non-fui
Features can be moved from one version to the next depending on timelines and current workload.

## V0.2

# Non-Functional (Code)
- Move notification logic to events 

# Business Logic Layer
- Subscribe/Unsubscribe options to (marketing, promotions, you cannot unsubscribe to notifications)
- WhatsApp Notifications
- Web push notifications (UI as well)


## V0.1.1

#Misc
- Email logo using Google Profile or BIMI
- Bulk Message Sender 
    - (email or sms or both, you can choose)
    - (you can select one user from or multiple or all)
    - You can send to email or to sms 
- Assigning products discounts/promotion based on price of product in a particular category 

## V0.1 (Go Live)

# Business Logic Layer

- Product, Category, Brand listing - Working
- Data Importation Mgt. - Working (improvements can be done)
- Product/Category/Brand Search (extensive full-text) - Working (Needs work before live)
- Seller Management - Working (improvements can be done)
- Product, Category, Brand Management - Working (improvements can be done)
- Coupon Management - Exists (Not tested thoroughly)
- Discounts/Promotion Management - Exists (Not tested thoroughly)
- Discount/Promotion Push 2 Comms 
- Discount/Promotion connected to particular coupon  
- Order Management 
- Order Placement and Updates push 2 comms  - Working
- Refund Management 
- Invoice Management  - Working (improvements can be done)
- Reviews and Ratings - Deferred
- Currency Management - Working (improvements can be done)
- Currency Conversion Mgt - Working (improvements can be done)
- Markup Management (multi-currency) - Working (improvements can be done)
- Markup Applied on Prods - Working
- Tag Management - Working (Need to create a way to tag on importation)
- Content Management (About, Privacy Policy, Refund Policy, Return Policy, Terms and Policies)
- Mailing List - Working 
- Assigning products or product categories discounts/promotions  - Working (improvements can be done)
## UI

- Home (New, Featured, Essentials, ...) - Working (changes to breakdown by essentials etc)
- Shop, Cart, Checkout  - Working
- Payment Flow - Working (clean up and finalization needed)
- In-App/Browser Notifications -
- Pages (About, What is the magic, How it works, How to become a seller, Trust and Reliability) -
- Pages (Privacy Policy, Refund Policy, Return Policy, Terms and Policies, Support) ..under the help -

## Miscellanous
- Finalize validation errors esp. in the frontend
(if they can be field based evene better)
- Analyze how useEffect is being used and vet usage against best practices
- Analyze useEffect usage and identify race conditions

## Nice to haves (Probably wont do)

