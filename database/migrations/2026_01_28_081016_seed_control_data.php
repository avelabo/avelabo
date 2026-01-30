<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Seed control/reference data required for the application to function.
     */
    public function up(): void
    {
        $now = now();

        // =========================================================
        // 1. Countries
        // =========================================================
        $countries = [
            ['name' => 'Malawi', 'code' => 'MWI', 'code_2' => 'MW', 'phone_code' => '+265', 'currency_code' => 'MWK', 'is_active' => true],
            ['name' => 'South Africa', 'code' => 'ZAF', 'code_2' => 'ZA', 'phone_code' => '+27', 'currency_code' => 'ZAR', 'is_active' => true],
            ['name' => 'United States', 'code' => 'USA', 'code_2' => 'US', 'phone_code' => '+1', 'currency_code' => 'USD', 'is_active' => true],
            ['name' => 'United Kingdom', 'code' => 'GBR', 'code_2' => 'GB', 'phone_code' => '+44', 'currency_code' => 'GBP', 'is_active' => false],
            ['name' => 'Zambia', 'code' => 'ZMB', 'code_2' => 'ZM', 'phone_code' => '+260', 'currency_code' => 'ZMW', 'is_active' => false],
            ['name' => 'Mozambique', 'code' => 'MOZ', 'code_2' => 'MZ', 'phone_code' => '+258', 'currency_code' => 'MZN', 'is_active' => false],
            ['name' => 'Tanzania', 'code' => 'TZA', 'code_2' => 'TZ', 'phone_code' => '+255', 'currency_code' => 'TZS', 'is_active' => false],
        ];

        foreach ($countries as $country) {
            DB::table('countries')->updateOrInsert(
                ['code' => $country['code']],
                array_merge($country, ['created_at' => $now, 'updated_at' => $now])
            );
        }

        // =========================================================
        // 2. Regions (Malawi)
        // =========================================================
        $malawiId = DB::table('countries')->where('code', 'MWI')->value('id');

        if ($malawiId) {
            $regions = [
                ['name' => 'Northern Region', 'code' => 'N', 'is_active' => true],
                ['name' => 'Central Region', 'code' => 'C', 'is_active' => true],
                ['name' => 'Southern Region', 'code' => 'S', 'is_active' => true],
            ];

            foreach ($regions as $region) {
                DB::table('regions')->updateOrInsert(
                    ['country_id' => $malawiId, 'code' => $region['code']],
                    array_merge($region, ['country_id' => $malawiId, 'created_at' => $now, 'updated_at' => $now])
                );
            }

            // =========================================================
            // 3. Cities (Malawi districts)
            // =========================================================
            $regionIds = DB::table('regions')
                ->where('country_id', $malawiId)
                ->pluck('id', 'code');

            $cities = [
                // Northern
                ['region' => 'N', 'name' => 'Mzuzu'],
                ['region' => 'N', 'name' => 'Karonga'],
                ['region' => 'N', 'name' => 'Chitipa'],
                ['region' => 'N', 'name' => 'Rumphi'],
                ['region' => 'N', 'name' => 'Nkhata Bay'],
                ['region' => 'N', 'name' => 'Likoma'],
                // Central
                ['region' => 'C', 'name' => 'Lilongwe'],
                ['region' => 'C', 'name' => 'Kasungu'],
                ['region' => 'C', 'name' => 'Mchinji'],
                ['region' => 'C', 'name' => 'Dowa'],
                ['region' => 'C', 'name' => 'Salima'],
                ['region' => 'C', 'name' => 'Nkhotakota'],
                ['region' => 'C', 'name' => 'Ntchisi'],
                ['region' => 'C', 'name' => 'Dedza'],
                ['region' => 'C', 'name' => 'Ntcheu'],
                // Southern
                ['region' => 'S', 'name' => 'Blantyre'],
                ['region' => 'S', 'name' => 'Zomba'],
                ['region' => 'S', 'name' => 'Mangochi'],
                ['region' => 'S', 'name' => 'Machinga'],
                ['region' => 'S', 'name' => 'Balaka'],
                ['region' => 'S', 'name' => 'Mwanza'],
                ['region' => 'S', 'name' => 'Neno'],
                ['region' => 'S', 'name' => 'Chiradzulu'],
                ['region' => 'S', 'name' => 'Phalombe'],
                ['region' => 'S', 'name' => 'Mulanje'],
                ['region' => 'S', 'name' => 'Thyolo'],
                ['region' => 'S', 'name' => 'Chikwawa'],
                ['region' => 'S', 'name' => 'Nsanje'],
            ];

            foreach ($cities as $city) {
                $regionId = $regionIds[$city['region']] ?? null;
                if ($regionId) {
                    DB::table('cities')->updateOrInsert(
                        ['region_id' => $regionId, 'name' => $city['name']],
                        ['region_id' => $regionId, 'name' => $city['name'], 'is_active' => true, 'created_at' => $now, 'updated_at' => $now]
                    );
                }
            }
        }

        // =========================================================
        // 4. Currencies & Exchange Rates
        // =========================================================
        $currencies = [
            ['code' => 'MWK', 'name' => 'Malawian Kwacha', 'symbol' => 'MK', 'decimal_places' => 2, 'symbol_before' => true, 'is_active' => true, 'is_default' => true],
            ['code' => 'ZAR', 'name' => 'South African Rand', 'symbol' => 'R', 'decimal_places' => 2, 'symbol_before' => true, 'is_active' => true, 'is_default' => false],
            ['code' => 'USD', 'name' => 'US Dollar', 'symbol' => '$', 'decimal_places' => 2, 'symbol_before' => true, 'is_active' => true, 'is_default' => false],
        ];

        foreach ($currencies as $currency) {
            DB::table('currencies')->updateOrInsert(
                ['code' => $currency['code']],
                array_merge($currency, ['created_at' => $now, 'updated_at' => $now])
            );
        }

        $currencyIds = DB::table('currencies')->pluck('id', 'code');

        $exchangeRates = [
            ['from_currency_id' => $currencyIds['USD'], 'to_currency_id' => $currencyIds['MWK'], 'rate' => 4000.00],
            ['from_currency_id' => $currencyIds['ZAR'], 'to_currency_id' => $currencyIds['MWK'], 'rate' => 240.00],
            ['from_currency_id' => $currencyIds['USD'], 'to_currency_id' => $currencyIds['ZAR'], 'rate' => 17.90],
        ];

        foreach ($exchangeRates as $rate) {
            DB::table('exchange_rates')->updateOrInsert(
                ['from_currency_id' => $rate['from_currency_id'], 'to_currency_id' => $rate['to_currency_id']],
                array_merge($rate, ['created_at' => $now, 'updated_at' => $now])
            );
        }

        // =========================================================
        // 5. Roles & Permissions
        // =========================================================
        $roles = [
            ['name' => 'Administrator', 'slug' => 'admin', 'description' => 'Full system access', 'is_default' => false],
            ['name' => 'Seller', 'slug' => 'seller', 'description' => 'Seller account with product management', 'is_default' => false],
            ['name' => 'Customer', 'slug' => 'customer', 'description' => 'Regular customer account', 'is_default' => true],
            ['name' => 'Support', 'slug' => 'support', 'description' => 'Customer support staff', 'is_default' => false],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['slug' => $role['slug']],
                array_merge($role, ['created_at' => $now, 'updated_at' => $now])
            );
        }

        $permissions = [
            ['name' => 'View Users', 'slug' => 'users.view', 'group' => 'users'],
            ['name' => 'Create Users', 'slug' => 'users.create', 'group' => 'users'],
            ['name' => 'Edit Users', 'slug' => 'users.edit', 'group' => 'users'],
            ['name' => 'Delete Users', 'slug' => 'users.delete', 'group' => 'users'],
            ['name' => 'View Products', 'slug' => 'products.view', 'group' => 'products'],
            ['name' => 'Create Products', 'slug' => 'products.create', 'group' => 'products'],
            ['name' => 'Edit Products', 'slug' => 'products.edit', 'group' => 'products'],
            ['name' => 'Delete Products', 'slug' => 'products.delete', 'group' => 'products'],
            ['name' => 'View Orders', 'slug' => 'orders.view', 'group' => 'orders'],
            ['name' => 'Create Orders', 'slug' => 'orders.create', 'group' => 'orders'],
            ['name' => 'Edit Orders', 'slug' => 'orders.edit', 'group' => 'orders'],
            ['name' => 'Delete Orders', 'slug' => 'orders.delete', 'group' => 'orders'],
            ['name' => 'Process Refunds', 'slug' => 'orders.refund', 'group' => 'orders'],
            ['name' => 'View Sellers', 'slug' => 'sellers.view', 'group' => 'sellers'],
            ['name' => 'Approve Sellers', 'slug' => 'sellers.approve', 'group' => 'sellers'],
            ['name' => 'Edit Sellers', 'slug' => 'sellers.edit', 'group' => 'sellers'],
            ['name' => 'Manage Markups', 'slug' => 'sellers.markups', 'group' => 'sellers'],
            ['name' => 'Manage Categories', 'slug' => 'categories.manage', 'group' => 'catalog'],
            ['name' => 'Manage Brands', 'slug' => 'brands.manage', 'group' => 'catalog'],
            ['name' => 'Manage Attributes', 'slug' => 'attributes.manage', 'group' => 'catalog'],
            ['name' => 'View Settings', 'slug' => 'settings.view', 'group' => 'settings'],
            ['name' => 'Edit Settings', 'slug' => 'settings.edit', 'group' => 'settings'],
            ['name' => 'Manage Currencies', 'slug' => 'currencies.manage', 'group' => 'settings'],
            ['name' => 'Manage Payment Gateways', 'slug' => 'payments.manage', 'group' => 'settings'],
            ['name' => 'View Reports', 'slug' => 'reports.view', 'group' => 'reports'],
            ['name' => 'Export Reports', 'slug' => 'reports.export', 'group' => 'reports'],
        ];

        foreach ($permissions as $permission) {
            DB::table('permissions')->updateOrInsert(
                ['slug' => $permission['slug']],
                array_merge($permission, ['created_at' => $now, 'updated_at' => $now])
            );
        }

        // Assign permissions to roles
        $roleIds = DB::table('roles')->pluck('id', 'slug');
        $allPermissionIds = DB::table('permissions')->pluck('id', 'slug');

        // Admin gets all permissions
        foreach ($allPermissionIds as $permId) {
            DB::table('permission_role')->updateOrInsert(
                ['role_id' => $roleIds['admin'], 'permission_id' => $permId],
                ['role_id' => $roleIds['admin'], 'permission_id' => $permId, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // Seller permissions
        $sellerPerms = ['products.view', 'products.create', 'products.edit', 'products.delete', 'orders.view', 'orders.edit', 'sellers.markups'];
        foreach ($sellerPerms as $slug) {
            if (isset($allPermissionIds[$slug])) {
                DB::table('permission_role')->updateOrInsert(
                    ['role_id' => $roleIds['seller'], 'permission_id' => $allPermissionIds[$slug]],
                    ['role_id' => $roleIds['seller'], 'permission_id' => $allPermissionIds[$slug], 'created_at' => $now, 'updated_at' => $now]
                );
            }
        }

        // Customer permissions
        $customerPerms = ['products.view', 'orders.view', 'orders.create'];
        foreach ($customerPerms as $slug) {
            if (isset($allPermissionIds[$slug])) {
                DB::table('permission_role')->updateOrInsert(
                    ['role_id' => $roleIds['customer'], 'permission_id' => $allPermissionIds[$slug]],
                    ['role_id' => $roleIds['customer'], 'permission_id' => $allPermissionIds[$slug], 'created_at' => $now, 'updated_at' => $now]
                );
            }
        }

        // Support permissions
        $supportPerms = ['users.view', 'products.view', 'orders.view', 'orders.edit', 'orders.refund', 'sellers.view'];
        foreach ($supportPerms as $slug) {
            if (isset($allPermissionIds[$slug])) {
                DB::table('permission_role')->updateOrInsert(
                    ['role_id' => $roleIds['support'], 'permission_id' => $allPermissionIds[$slug]],
                    ['role_id' => $roleIds['support'], 'permission_id' => $allPermissionIds[$slug], 'created_at' => $now, 'updated_at' => $now]
                );
            }
        }

        // =========================================================
        // 6. Default Admin User
        // =========================================================
        $adminUserId = DB::table('users')->updateOrInsert(
            ['email' => 'superguy@avelabo.com'],
            [
                'name' => 'Super Admin',
                'email' => 'superguy@avelabo.com',
                'password' => Hash::make('WeHereAllDay100%'),
                'email_verified_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ]
        );

        $adminUser = DB::table('users')->where('email', 'superguy@avelabo.com')->first();
        if ($adminUser && isset($roleIds['admin'])) {
            DB::table('role_user')->updateOrInsert(
                ['role_id' => $roleIds['admin'], 'user_id' => $adminUser->id],
                ['role_id' => $roleIds['admin'], 'user_id' => $adminUser->id, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // =========================================================
        // 7. Payment Gateways
        // =========================================================
        $gateways = [
            [
                'name' => 'onekhusa',
                'slug' => 'onekhusa',
                'display_name' => 'OneKhusa',
                'description' => 'Mobile Money & Card Payments',
                'is_active' => true,
                'supported_currencies' => json_encode(['MWK']),
                'supported_countries' => json_encode(['MW']),
                'transaction_fee_percentage' => 1.00,
                'is_test_mode' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'paychangu',
                'slug' => 'paychangu',
                'display_name' => 'PayChangu',
                'description' => 'Mobile Money & Card Payments',
                'is_active' => true,
                'supported_currencies' => json_encode(['MWK', 'ZAR', 'USD']),
                'supported_countries' => json_encode(['MW', 'ZA', 'US']),
                'transaction_fee_percentage' => 4.00,
                'is_test_mode' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'cod',
                'slug' => 'cash-on-delivery',
                'display_name' => 'Cash on Delivery',
                'description' => 'Pay cash when your order is delivered',
                'is_active' => false,
                'supported_currencies' => json_encode(['MWK']),
                'supported_countries' => json_encode(['MW']),
                'transaction_fee_percentage' => 0,
                'is_test_mode' => false,
                'sort_order' => 3,
            ],
        ];

        foreach ($gateways as $gateway) {
            DB::table('payment_gateways')->updateOrInsert(
                ['slug' => $gateway['slug']],
                array_merge($gateway, ['created_at' => $now, 'updated_at' => $now])
            );
        }

        // =========================================================
        // 8. Settings
        // =========================================================
        $settings = [
            ['key' => 'site_name', 'value' => 'Avelabo', 'type' => 'string', 'group' => 'general', 'is_public' => true],
            ['key' => 'site_tagline', 'value' => 'Your One-Stop Shop in Malawi', 'type' => 'string', 'group' => 'general', 'is_public' => true],
            ['key' => 'site_description', 'value' => 'Avelabo is Malawi\'s premier ecommerce marketplace offering quality products from global sellers.', 'type' => 'string', 'group' => 'general', 'is_public' => true],
            ['key' => 'contact_email', 'value' => 'hello@avelabo.com', 'type' => 'string', 'group' => 'general', 'is_public' => true],
            ['key' => 'contact_phone', 'value' => '+265 999 000 000', 'type' => 'string', 'group' => 'general', 'is_public' => true],
            ['key' => 'contact_address', 'value' => 'Lilongwe, Malawi', 'type' => 'string', 'group' => 'general', 'is_public' => true],
            ['key' => 'default_currency', 'value' => 'MWK', 'type' => 'string', 'group' => 'store', 'is_public' => false],
            ['key' => 'tax_rate', 'value' => '16.5', 'type' => 'float', 'group' => 'store', 'is_public' => false],
            ['key' => 'tax_included', 'value' => '1', 'type' => 'boolean', 'group' => 'store', 'is_public' => false],
            ['key' => 'low_stock_threshold', 'value' => '5', 'type' => 'integer', 'group' => 'store', 'is_public' => false],
            ['key' => 'max_cart_items', 'value' => '50', 'type' => 'integer', 'group' => 'store', 'is_public' => false],
            ['key' => 'guest_checkout', 'value' => '0', 'type' => 'boolean', 'group' => 'store', 'is_public' => false],
            ['key' => 'seller_registration_enabled', 'value' => '1', 'type' => 'boolean', 'group' => 'seller', 'is_public' => true],
            ['key' => 'seller_auto_approve', 'value' => '0', 'type' => 'boolean', 'group' => 'seller', 'is_public' => false],
            ['key' => 'seller_commission_rate', 'value' => '10', 'type' => 'float', 'group' => 'seller', 'is_public' => false],
            ['key' => 'seller_min_payout', 'value' => '10000', 'type' => 'float', 'group' => 'seller', 'is_public' => false],
            ['key' => 'free_shipping_threshold', 'value' => '50000', 'type' => 'float', 'group' => 'shipping', 'is_public' => true],
            ['key' => 'default_shipping_fee', 'value' => '2500', 'type' => 'float', 'group' => 'shipping', 'is_public' => true],
            ['key' => 'social_facebook', 'value' => 'https://facebook.com/avelabocom', 'type' => 'string', 'group' => 'social', 'is_public' => true],
            ['key' => 'social_instagram', 'value' => 'https://instagram.com/avelabocom', 'type' => 'string', 'group' => 'social', 'is_public' => true],
            ['key' => 'social_twitter', 'value' => 'https://twitter.com/avelabo', 'type' => 'string', 'group' => 'social', 'is_public' => true],
            ['key' => 'social_youtube', 'value' => 'https://youtube.com/avelabo', 'type' => 'string', 'group' => 'social', 'is_public' => true],
            ['key' => 'social_whatsapp', 'value' => '+265999000000', 'type' => 'string', 'group' => 'social', 'is_public' => true],
            ['key' => 'site_address', 'value' => 'Area 47, Sector 3, Lilongwe, Malawi', 'type' => 'string', 'group' => 'contact', 'is_public' => true],
            ['key' => 'site_phone', 'value' => '+265 999 123 456', 'type' => 'string', 'group' => 'contact', 'is_public' => true],
            ['key' => 'site_phone_2', 'value' => '+265 888 123 456', 'type' => 'string', 'group' => 'contact', 'is_public' => true],
            ['key' => 'site_email', 'value' => 'info@avelabo.mw', 'type' => 'string', 'group' => 'contact', 'is_public' => true],
            ['key' => 'site_support_email', 'value' => 'support@avelabo.mw', 'type' => 'string', 'group' => 'contact', 'is_public' => true],
            ['key' => 'site_hours', 'value' => 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM', 'type' => 'string', 'group' => 'contact', 'is_public' => true],
            ['key' => 'footer_about', 'value' => 'Avelabo brings quality products from around the world to Malawi. Shop from top South African and Middle Eastern brands with fast local delivery.', 'type' => 'string', 'group' => 'footer', 'is_public' => true],
            ['key' => 'copyright_text', 'value' => '© 2024 Avelabo. All Rights Reserved.', 'type' => 'string', 'group' => 'footer', 'is_public' => true],
            ['key' => 'newsletter_title', 'value' => 'Subscribe to our Newsletter', 'type' => 'string', 'group' => 'newsletter', 'is_public' => true],
            ['key' => 'newsletter_subtitle', 'value' => 'Get the latest deals and promotions delivered to your inbox', 'type' => 'string', 'group' => 'newsletter', 'is_public' => true],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->updateOrInsert(
                ['key' => $setting['key']],
                array_merge($setting, ['created_at' => $now, 'updated_at' => $now])
            );
        }

        // =========================================================
        // 9. Markup Templates & Ranges
        // =========================================================
        $zarId = $currencyIds['ZAR'] ?? null;

        if ($zarId) {
            $templates = [
                [
                    'name' => 'Standard Markup',
                    'description' => 'Default markup template for all sellers. Based on ZAR price ranges.',
                    'is_default' => true,
                    'is_active' => true,
                    'ranges' => [
                        ['min_price' => 0.01, 'max_price' => 100.00, 'markup_amount' => 50.00],
                        ['min_price' => 100.01, 'max_price' => 500.00, 'markup_amount' => 100.00],
                        ['min_price' => 500.01, 'max_price' => 1000.00, 'markup_amount' => 200.00],
                        ['min_price' => 1000.01, 'max_price' => 2500.00, 'markup_amount' => 350.00],
                        ['min_price' => 2500.01, 'max_price' => 5000.00, 'markup_amount' => 500.00],
                        ['min_price' => 5000.01, 'max_price' => 10000.00, 'markup_amount' => 750.00],
                        ['min_price' => 10000.01, 'max_price' => 999999.99, 'markup_amount' => 1000.00],
                    ],
                ],
                [
                    'name' => 'Premium Markup',
                    'description' => 'Higher markup template for premium/featured sellers.',
                    'is_default' => false,
                    'is_active' => true,
                    'ranges' => [
                        ['min_price' => 0.01, 'max_price' => 100.00, 'markup_amount' => 75.00],
                        ['min_price' => 100.01, 'max_price' => 500.00, 'markup_amount' => 150.00],
                        ['min_price' => 500.01, 'max_price' => 1000.00, 'markup_amount' => 300.00],
                        ['min_price' => 1000.01, 'max_price' => 2500.00, 'markup_amount' => 500.00],
                        ['min_price' => 2500.01, 'max_price' => 5000.00, 'markup_amount' => 750.00],
                        ['min_price' => 5000.01, 'max_price' => 10000.00, 'markup_amount' => 1000.00],
                        ['min_price' => 10000.01, 'max_price' => 999999.99, 'markup_amount' => 1500.00],
                    ],
                ],
                [
                    'name' => 'Low Margin',
                    'description' => 'Reduced markup template for competitive pricing or promotions.',
                    'is_default' => false,
                    'is_active' => true,
                    'ranges' => [
                        ['min_price' => 0.01, 'max_price' => 100.00, 'markup_amount' => 25.00],
                        ['min_price' => 100.01, 'max_price' => 500.00, 'markup_amount' => 50.00],
                        ['min_price' => 500.01, 'max_price' => 1000.00, 'markup_amount' => 100.00],
                        ['min_price' => 1000.01, 'max_price' => 2500.00, 'markup_amount' => 175.00],
                        ['min_price' => 2500.01, 'max_price' => 5000.00, 'markup_amount' => 250.00],
                        ['min_price' => 5000.01, 'max_price' => 10000.00, 'markup_amount' => 400.00],
                        ['min_price' => 10000.01, 'max_price' => 999999.99, 'markup_amount' => 500.00],
                    ],
                ],
            ];

            foreach ($templates as $templateData) {
                $ranges = $templateData['ranges'];
                unset($templateData['ranges']);

                DB::table('seller_markup_templates')->updateOrInsert(
                    ['name' => $templateData['name']],
                    array_merge($templateData, ['currency_id' => $zarId, 'created_at' => $now, 'updated_at' => $now])
                );

                $templateId = DB::table('seller_markup_templates')->where('name', $templateData['name'])->value('id');

                foreach ($ranges as $range) {
                    DB::table('seller_markup_template_ranges')->updateOrInsert(
                        ['template_id' => $templateId, 'min_price' => $range['min_price'], 'max_price' => $range['max_price']],
                        array_merge($range, ['template_id' => $templateId, 'created_at' => $now, 'updated_at' => $now])
                    );
                }
            }
        }

        // =========================================================
        // 10. Attributes & Attribute Values
        // =========================================================
        $attributes = [
            [
                'name' => 'Color', 'slug' => 'color', 'type' => 'color', 'is_filterable' => true, 'is_visible' => true, 'sort_order' => 1,
                'values' => [
                    ['value' => 'Black', 'color_code' => '#000000'],
                    ['value' => 'White', 'color_code' => '#FFFFFF'],
                    ['value' => 'Red', 'color_code' => '#FF0000'],
                    ['value' => 'Blue', 'color_code' => '#0000FF'],
                    ['value' => 'Green', 'color_code' => '#008000'],
                    ['value' => 'Yellow', 'color_code' => '#FFFF00'],
                    ['value' => 'Orange', 'color_code' => '#FFA500'],
                    ['value' => 'Purple', 'color_code' => '#800080'],
                    ['value' => 'Pink', 'color_code' => '#FFC0CB'],
                    ['value' => 'Gray', 'color_code' => '#808080'],
                    ['value' => 'Brown', 'color_code' => '#A52A2A'],
                    ['value' => 'Navy', 'color_code' => '#000080'],
                ],
            ],
            [
                'name' => 'Size', 'slug' => 'size', 'type' => 'select', 'is_filterable' => true, 'is_visible' => true, 'sort_order' => 2,
                'values' => [
                    ['value' => 'XS'], ['value' => 'S'], ['value' => 'M'], ['value' => 'L'], ['value' => 'XL'], ['value' => 'XXL'], ['value' => 'XXXL'],
                ],
            ],
            [
                'name' => 'Shoe Size', 'slug' => 'shoe-size', 'type' => 'select', 'is_filterable' => true, 'is_visible' => true, 'sort_order' => 3,
                'values' => [
                    ['value' => '36'], ['value' => '37'], ['value' => '38'], ['value' => '39'], ['value' => '40'],
                    ['value' => '41'], ['value' => '42'], ['value' => '43'], ['value' => '44'], ['value' => '45'], ['value' => '46'],
                ],
            ],
            [
                'name' => 'Storage', 'slug' => 'storage', 'type' => 'select', 'is_filterable' => true, 'is_visible' => true, 'sort_order' => 4,
                'values' => [
                    ['value' => '16GB'], ['value' => '32GB'], ['value' => '64GB'], ['value' => '128GB'],
                    ['value' => '256GB'], ['value' => '512GB'], ['value' => '1TB'], ['value' => '2TB'],
                ],
            ],
            [
                'name' => 'RAM', 'slug' => 'ram', 'type' => 'select', 'is_filterable' => true, 'is_visible' => true, 'sort_order' => 5,
                'values' => [
                    ['value' => '2GB'], ['value' => '4GB'], ['value' => '6GB'], ['value' => '8GB'],
                    ['value' => '12GB'], ['value' => '16GB'], ['value' => '32GB'], ['value' => '64GB'],
                ],
            ],
            [
                'name' => 'Material', 'slug' => 'material', 'type' => 'select', 'is_filterable' => true, 'is_visible' => true, 'sort_order' => 6,
                'values' => [
                    ['value' => 'Cotton'], ['value' => 'Polyester'], ['value' => 'Leather'], ['value' => 'Silk'],
                    ['value' => 'Wool'], ['value' => 'Denim'], ['value' => 'Linen'], ['value' => 'Nylon'],
                ],
            ],
            [
                'name' => 'Brand', 'slug' => 'brand', 'type' => 'select', 'is_filterable' => true, 'is_visible' => true, 'sort_order' => 7,
                'values' => [],
            ],
            [
                'name' => 'Warranty', 'slug' => 'warranty', 'type' => 'select', 'is_filterable' => true, 'is_visible' => true, 'sort_order' => 8,
                'values' => [
                    ['value' => 'No Warranty'], ['value' => '6 Months'], ['value' => '1 Year'],
                    ['value' => '2 Years'], ['value' => '3 Years'], ['value' => '5 Years'],
                ],
            ],
        ];

        foreach ($attributes as $attrData) {
            $values = $attrData['values'];
            unset($attrData['values']);

            DB::table('attributes')->updateOrInsert(
                ['slug' => $attrData['slug']],
                array_merge($attrData, ['created_at' => $now, 'updated_at' => $now])
            );

            $attrId = DB::table('attributes')->where('slug', $attrData['slug'])->value('id');
            $sortOrder = 1;

            foreach ($values as $valueData) {
                $slug = Str::slug($valueData['value']);
                DB::table('attribute_values')->updateOrInsert(
                    ['attribute_id' => $attrId, 'slug' => $slug],
                    array_merge($valueData, [
                        'attribute_id' => $attrId,
                        'slug' => $slug,
                        'sort_order' => $sortOrder++,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ])
                );
            }
        }

        // =========================================================
        // 11. Categories
        // =========================================================
        $categories = [
            [
                'name' => 'Electronics', 'slug' => 'electronics', 'icon' => 'laptop', 'is_active' => true, 'is_featured' => true, 'sort_order' => 1,
                'children' => [
                    ['name' => 'Mobile Phones', 'slug' => 'mobile-phones', 'is_featured' => true],
                    ['name' => 'Laptops & Computers', 'slug' => 'laptops-computers', 'is_featured' => true],
                    ['name' => 'Tablets', 'slug' => 'tablets'],
                    ['name' => 'TVs & Audio', 'slug' => 'tvs-audio'],
                    ['name' => 'Cameras', 'slug' => 'cameras'],
                    ['name' => 'Gaming', 'slug' => 'gaming'],
                    ['name' => 'Accessories', 'slug' => 'electronics-accessories'],
                ],
            ],
            [
                'name' => 'Fashion', 'slug' => 'fashion', 'icon' => 'shirt', 'is_active' => true, 'is_featured' => true, 'sort_order' => 2,
                'children' => [
                    ['name' => "Men's Clothing", 'slug' => 'mens-clothing', 'is_featured' => true],
                    ['name' => "Women's Clothing", 'slug' => 'womens-clothing', 'is_featured' => true],
                    ['name' => "Kids' Clothing", 'slug' => 'kids-clothing'],
                    ['name' => 'Shoes', 'slug' => 'shoes'],
                    ['name' => 'Bags', 'slug' => 'bags'],
                    ['name' => 'Watches', 'slug' => 'watches'],
                    ['name' => 'Jewelry', 'slug' => 'jewelry'],
                ],
            ],
            [
                'name' => 'Home & Living', 'slug' => 'home-living', 'icon' => 'home', 'is_active' => true, 'is_featured' => true, 'sort_order' => 3,
                'children' => [
                    ['name' => 'Furniture', 'slug' => 'furniture'],
                    ['name' => 'Bedding', 'slug' => 'bedding'],
                    ['name' => 'Kitchen & Dining', 'slug' => 'kitchen-dining'],
                    ['name' => 'Home Decor', 'slug' => 'home-decor'],
                    ['name' => 'Lighting', 'slug' => 'lighting'],
                    ['name' => 'Storage', 'slug' => 'storage'],
                ],
            ],
            [
                'name' => 'Appliances', 'slug' => 'appliances', 'icon' => 'refrigerator', 'is_active' => true, 'is_featured' => false, 'sort_order' => 4,
                'children' => [
                    ['name' => 'Large Appliances', 'slug' => 'large-appliances'],
                    ['name' => 'Small Appliances', 'slug' => 'small-appliances'],
                    ['name' => 'Air Conditioning', 'slug' => 'air-conditioning'],
                ],
            ],
            [
                'name' => 'Health & Beauty', 'slug' => 'health-beauty', 'icon' => 'heart', 'is_active' => true, 'is_featured' => true, 'sort_order' => 5,
                'children' => [
                    ['name' => 'Skincare', 'slug' => 'skincare'],
                    ['name' => 'Makeup', 'slug' => 'makeup'],
                    ['name' => 'Hair Care', 'slug' => 'hair-care'],
                    ['name' => 'Fragrances', 'slug' => 'fragrances'],
                    ['name' => 'Personal Care', 'slug' => 'personal-care'],
                    ['name' => 'Health & Wellness', 'slug' => 'health-wellness'],
                ],
            ],
            [
                'name' => 'Sports & Outdoors', 'slug' => 'sports-outdoors', 'icon' => 'dumbbell', 'is_active' => true, 'is_featured' => false, 'sort_order' => 6,
                'children' => [
                    ['name' => 'Exercise & Fitness', 'slug' => 'exercise-fitness'],
                    ['name' => 'Team Sports', 'slug' => 'team-sports'],
                    ['name' => 'Outdoor Recreation', 'slug' => 'outdoor-recreation'],
                    ['name' => 'Camping & Hiking', 'slug' => 'camping-hiking'],
                ],
            ],
            [
                'name' => 'Groceries', 'slug' => 'groceries', 'icon' => 'shopping-basket', 'is_active' => true, 'is_featured' => true, 'sort_order' => 7,
                'children' => [
                    ['name' => 'Food & Beverages', 'slug' => 'food-beverages'],
                    ['name' => 'Snacks', 'slug' => 'snacks'],
                    ['name' => 'Household Supplies', 'slug' => 'household-supplies'],
                    ['name' => 'Baby Products', 'slug' => 'baby-products'],
                    ['name' => 'Pet Supplies', 'slug' => 'pet-supplies'],
                ],
            ],
            [
                'name' => 'Automotive', 'slug' => 'automotive', 'icon' => 'car', 'is_active' => true, 'is_featured' => false, 'sort_order' => 8,
                'children' => [
                    ['name' => 'Car Parts', 'slug' => 'car-parts'],
                    ['name' => 'Car Accessories', 'slug' => 'car-accessories'],
                    ['name' => 'Motorcycle Parts', 'slug' => 'motorcycle-parts'],
                    ['name' => 'Tools & Equipment', 'slug' => 'auto-tools'],
                ],
            ],
            [
                'name' => 'Books & Stationery', 'slug' => 'books-stationery', 'icon' => 'book', 'is_active' => true, 'is_featured' => false, 'sort_order' => 9,
                'children' => [
                    ['name' => 'Books', 'slug' => 'books'],
                    ['name' => 'Office Supplies', 'slug' => 'office-supplies'],
                    ['name' => 'School Supplies', 'slug' => 'school-supplies'],
                ],
            ],
            [
                'name' => 'Toys & Games', 'slug' => 'toys-games', 'icon' => 'gamepad', 'is_active' => true, 'is_featured' => false, 'sort_order' => 10,
                'children' => [
                    ['name' => 'Action Figures', 'slug' => 'action-figures'],
                    ['name' => 'Board Games', 'slug' => 'board-games'],
                    ['name' => 'Educational Toys', 'slug' => 'educational-toys'],
                    ['name' => 'Outdoor Toys', 'slug' => 'outdoor-toys'],
                ],
            ],
        ];

        foreach ($categories as $catData) {
            $children = $catData['children'] ?? [];
            unset($catData['children']);

            DB::table('categories')->updateOrInsert(
                ['slug' => $catData['slug']],
                array_merge($catData, ['created_at' => $now, 'updated_at' => $now])
            );

            $parentId = DB::table('categories')->where('slug', $catData['slug'])->value('id');
            $childSort = 1;

            foreach ($children as $child) {
                DB::table('categories')->updateOrInsert(
                    ['slug' => $child['slug']],
                    [
                        'name' => $child['name'],
                        'slug' => $child['slug'],
                        'parent_id' => $parentId,
                        'is_active' => true,
                        'is_featured' => $child['is_featured'] ?? false,
                        'sort_order' => $childSort++,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]
                );
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove in reverse order of dependencies
        DB::table('categories')->whereNotNull('parent_id')->delete();
        DB::table('categories')->delete();
        DB::table('attribute_values')->delete();
        DB::table('attributes')->delete();
        DB::table('seller_markup_template_ranges')->delete();
        DB::table('seller_markup_templates')->delete();
        DB::table('settings')->delete();
        DB::table('payment_gateways')->delete();
        DB::table('permission_role')->delete();
        DB::table('role_user')->whereIn('user_id', function ($q) {
            $q->select('id')->from('users')->where('email', 'superguy@avelabo.com');
        })->delete();
        DB::table('users')->where('email', 'superguy@avelabo.com')->delete();
        DB::table('permissions')->delete();
        DB::table('roles')->delete();
        DB::table('exchange_rates')->delete();
        DB::table('currencies')->delete();
        DB::table('cities')->delete();
        DB::table('regions')->delete();
        DB::table('countries')->delete();
    }
};
