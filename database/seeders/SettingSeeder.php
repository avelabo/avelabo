<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // General settings
            [
                'key' => 'site_name',
                'value' => 'Avelabo',
                'type' => 'string',
                'group' => 'general',
                'is_public' => true,
            ],
            [
                'key' => 'site_tagline',
                'value' => 'Your One-Stop Shop in Malawi',
                'type' => 'string',
                'group' => 'general',
                'is_public' => true,
            ],
            [
                'key' => 'site_description',
                'value' => 'Avelabo is Malawi\'s premier ecommerce marketplace offering quality products from global sellers.',
                'type' => 'string',
                'group' => 'general',
                'is_public' => true,
            ],
            [
                'key' => 'contact_email',
                'value' => 'hello@avelabo.com',
                'type' => 'string',
                'group' => 'general',
                'is_public' => true,
            ],
            [
                'key' => 'contact_phone',
                'value' => '+265 999 000 000',
                'type' => 'string',
                'group' => 'general',
                'is_public' => true,
            ],
            [
                'key' => 'contact_address',
                'value' => 'Lilongwe, Malawi',
                'type' => 'string',
                'group' => 'general',
                'is_public' => true,
            ],

            // Store settings
            [
                'key' => 'default_currency',
                'value' => 'MWK',
                'type' => 'string',
                'group' => 'store',
                'is_public' => false,
            ],
            [
                'key' => 'tax_rate',
                'value' => '16.5',
                'type' => 'float',
                'group' => 'store',
                'is_public' => false,
            ],
            [
                'key' => 'tax_included',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'store',
                'is_public' => false,
            ],
            [
                'key' => 'low_stock_threshold',
                'value' => '5',
                'type' => 'integer',
                'group' => 'store',
                'is_public' => false,
            ],
            [
                'key' => 'max_cart_items',
                'value' => '50',
                'type' => 'integer',
                'group' => 'store',
                'is_public' => false,
            ],
            [
                'key' => 'guest_checkout',
                'value' => '0',
                'type' => 'boolean',
                'group' => 'store',
                'is_public' => false,
            ],

            // Seller settings
            [
                'key' => 'seller_registration_enabled',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'seller',
                'is_public' => true,
            ],
            [
                'key' => 'seller_auto_approve',
                'value' => '0',
                'type' => 'boolean',
                'group' => 'seller',
                'is_public' => false,
            ],
            [
                'key' => 'seller_commission_rate',
                'value' => '10',
                'type' => 'float',
                'group' => 'seller',
                'is_public' => false,
            ],
            [
                'key' => 'seller_min_payout',
                'value' => '10000',
                'type' => 'float',
                'group' => 'seller',
                'is_public' => false,
            ],

            // Shipping settings
            [
                'key' => 'free_shipping_threshold',
                'value' => '50000',
                'type' => 'float',
                'group' => 'shipping',
                'is_public' => true,
            ],
            [
                'key' => 'default_shipping_fee',
                'value' => '2500',
                'type' => 'float',
                'group' => 'shipping',
                'is_public' => true,
            ],

            // Social media
            [
                'key' => 'social_facebook',
                'value' => 'https://facebook.com/avelabo',
                'type' => 'string',
                'group' => 'social',
                'is_public' => true,
            ],
            [
                'key' => 'social_instagram',
                'value' => 'https://instagram.com/avelabo',
                'type' => 'string',
                'group' => 'social',
                'is_public' => true,
            ],
            [
                'key' => 'social_twitter',
                'value' => 'https://twitter.com/avelabo',
                'type' => 'string',
                'group' => 'social',
                'is_public' => true,
            ],
            [
                'key' => 'social_youtube',
                'value' => 'https://youtube.com/avelabo',
                'type' => 'string',
                'group' => 'social',
                'is_public' => true,
            ],
            [
                'key' => 'social_whatsapp',
                'value' => '+265999000000',
                'type' => 'string',
                'group' => 'social',
                'is_public' => true,
            ],

            // Contact info
            [
                'key' => 'site_address',
                'value' => 'Area 47, Sector 3, Lilongwe, Malawi',
                'type' => 'string',
                'group' => 'contact',
                'is_public' => true,
            ],
            [
                'key' => 'site_phone',
                'value' => '+265 999 123 456',
                'type' => 'string',
                'group' => 'contact',
                'is_public' => true,
            ],
            [
                'key' => 'site_phone_2',
                'value' => '+265 888 123 456',
                'type' => 'string',
                'group' => 'contact',
                'is_public' => true,
            ],
            [
                'key' => 'site_email',
                'value' => 'info@avelabo.mw',
                'type' => 'string',
                'group' => 'contact',
                'is_public' => true,
            ],
            [
                'key' => 'site_support_email',
                'value' => 'support@avelabo.mw',
                'type' => 'string',
                'group' => 'contact',
                'is_public' => true,
            ],
            [
                'key' => 'site_hours',
                'value' => 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM',
                'type' => 'string',
                'group' => 'contact',
                'is_public' => true,
            ],

            // Footer content
            [
                'key' => 'footer_about',
                'value' => 'Avelabo brings quality products from around the world to Malawi. Shop from top South African and Middle Eastern brands with fast local delivery.',
                'type' => 'string',
                'group' => 'footer',
                'is_public' => true,
            ],
            [
                'key' => 'copyright_text',
                'value' => '© 2024 Avelabo. All Rights Reserved.',
                'type' => 'string',
                'group' => 'footer',
                'is_public' => true,
            ],
            [
                'key' => 'newsletter_title',
                'value' => 'Subscribe to our Newsletter',
                'type' => 'string',
                'group' => 'newsletter',
                'is_public' => true,
            ],
            [
                'key' => 'newsletter_subtitle',
                'value' => 'Get the latest deals and promotions delivered to your inbox',
                'type' => 'string',
                'group' => 'newsletter',
                'is_public' => true,
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
