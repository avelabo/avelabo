<?php

namespace Database\Seeders;

use App\Models\PaymentGateway;
use Illuminate\Database\Seeder;

class PaymentGatewaySeeder extends Seeder
{
    public function run(): void
    {
        // Remove old individual payment method entries
        PaymentGateway::whereIn('slug', [
            'airtel-money',
            'tnm-mpamba',
            'nbm-bank',
            'paypal',
        ])->delete();

        $gateways = [
            [
                'name' => 'onekhusa',
                'slug' => 'onekhusa',
                'display_name' => 'OneKhusa',
                'description' => 'Mobile Money & Card Payments',
                'is_active' => true,
                'supported_currencies' => ['MWK'],
                'supported_countries' => ['MW'],
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
                'supported_currencies' => ['MWK', 'ZAR', 'USD'],
                'supported_countries' => ['MW', 'ZA', 'US'],
                'transaction_fee_percentage' => 4.00,
                'is_test_mode' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'cod',
                'slug' => 'cash-on-delivery',
                'display_name' => 'Cash on Delivery',
                'description' => 'Pay cash when your order is delivered',
                'is_active' => true,
                'supported_currencies' => ['MWK'],
                'supported_countries' => ['MW'],
                'transaction_fee_percentage' => 0,
                'is_test_mode' => false,
                'sort_order' => 3,
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
