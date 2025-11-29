<?php

namespace Database\Seeders;

use App\Models\PaymentGateway;
use Illuminate\Database\Seeder;

class PaymentGatewaySeeder extends Seeder
{
    public function run(): void
    {
        $gateways = [
            [
                'name' => 'airtel_money',
                'slug' => 'airtel-money',
                'display_name' => 'Airtel Money',
                'description' => 'Pay using Airtel Money mobile wallet',
                'is_active' => true,
                'supported_currencies' => ['MWK'],
                'supported_countries' => ['MW'],
                'is_test_mode' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'tnm_mpamba',
                'slug' => 'tnm-mpamba',
                'display_name' => 'TNM Mpamba',
                'description' => 'Pay using TNM Mpamba mobile wallet',
                'is_active' => true,
                'supported_currencies' => ['MWK'],
                'supported_countries' => ['MW'],
                'is_test_mode' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'nbm_bank',
                'slug' => 'nbm-bank',
                'display_name' => 'National Bank of Malawi',
                'description' => 'Pay via NBM bank transfer',
                'is_active' => true,
                'supported_currencies' => ['MWK'],
                'supported_countries' => ['MW'],
                'is_test_mode' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'paychangu',
                'slug' => 'paychangu',
                'display_name' => 'PayChangu',
                'description' => 'Pay using PayChangu payment gateway',
                'is_active' => false,
                'supported_currencies' => ['MWK', 'ZAR', 'USD'],
                'supported_countries' => ['MW', 'ZA', 'US'],
                'is_test_mode' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'paypal',
                'slug' => 'paypal',
                'display_name' => 'PayPal',
                'description' => 'Pay using PayPal',
                'is_active' => false,
                'supported_currencies' => ['USD', 'GBP', 'EUR', 'ZAR'],
                'supported_countries' => ['US', 'GB', 'ZA'],
                'is_test_mode' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'cod',
                'slug' => 'cash-on-delivery',
                'display_name' => 'Cash on Delivery',
                'description' => 'Pay cash when your order is delivered',
                'is_active' => true,
                'supported_currencies' => ['MWK'],
                'supported_countries' => ['MW'],
                'is_test_mode' => false,
                'sort_order' => 6,
            ],
        ];

        foreach ($gateways as $gateway) {
            PaymentGateway::updateOrCreate(
                ['slug' => $gateway['slug']],
                $gateway
            );
        }
    }
}
