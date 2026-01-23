<?php

namespace Database\Seeders;

use App\Models\Currency;
use App\Models\SellerMarkupTemplate;
use App\Models\SellerMarkupTemplateRange;
use Illuminate\Database\Seeder;

class MarkupTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get ZAR currency (the sample ranges are in ZAR per spec)
        $zarCurrency = Currency::where('code', 'ZAR')->first();

        if (! $zarCurrency) {
            $this->command->error('ZAR currency not found. Please seed currencies first.');

            return;
        }

        // Standard Markup Template (based on ZAR price ranges from spec)
        $standardTemplate = SellerMarkupTemplate::firstOrCreate(
            ['name' => 'Standard Markup'],
            [
                'description' => 'Default markup template for all sellers. Based on ZAR price ranges.',
                'currency_id' => $zarCurrency->id,
                'is_default' => true,
                'is_active' => true,
            ]
        );

        // Standard markup ranges from spec (Section 2.3)
        $standardRanges = [
            ['min_price' => 0.01, 'max_price' => 100.00, 'markup_amount' => 50.00],
            ['min_price' => 100.01, 'max_price' => 500.00, 'markup_amount' => 100.00],
            ['min_price' => 500.01, 'max_price' => 1000.00, 'markup_amount' => 200.00],
            ['min_price' => 1000.01, 'max_price' => 2500.00, 'markup_amount' => 350.00],
            ['min_price' => 2500.01, 'max_price' => 5000.00, 'markup_amount' => 500.00],
            ['min_price' => 5000.01, 'max_price' => 10000.00, 'markup_amount' => 750.00],
            ['min_price' => 10000.01, 'max_price' => 999999.99, 'markup_amount' => 1000.00],
        ];

        foreach ($standardRanges as $range) {
            SellerMarkupTemplateRange::firstOrCreate(
                [
                    'template_id' => $standardTemplate->id,
                    'min_price' => $range['min_price'],
                    'max_price' => $range['max_price'],
                ],
                ['markup_amount' => $range['markup_amount']]
            );
        }

        // Premium Markup Template (higher margins for premium sellers)
        $premiumTemplate = SellerMarkupTemplate::firstOrCreate(
            ['name' => 'Premium Markup'],
            [
                'description' => 'Higher markup template for premium/featured sellers.',
                'currency_id' => $zarCurrency->id,
                'is_default' => false,
                'is_active' => true,
            ]
        );

        $premiumRanges = [
            ['min_price' => 0.01, 'max_price' => 100.00, 'markup_amount' => 75.00],
            ['min_price' => 100.01, 'max_price' => 500.00, 'markup_amount' => 150.00],
            ['min_price' => 500.01, 'max_price' => 1000.00, 'markup_amount' => 300.00],
            ['min_price' => 1000.01, 'max_price' => 2500.00, 'markup_amount' => 500.00],
            ['min_price' => 2500.01, 'max_price' => 5000.00, 'markup_amount' => 750.00],
            ['min_price' => 5000.01, 'max_price' => 10000.00, 'markup_amount' => 1000.00],
            ['min_price' => 10000.01, 'max_price' => 999999.99, 'markup_amount' => 1500.00],
        ];

        foreach ($premiumRanges as $range) {
            SellerMarkupTemplateRange::firstOrCreate(
                [
                    'template_id' => $premiumTemplate->id,
                    'min_price' => $range['min_price'],
                    'max_price' => $range['max_price'],
                ],
                ['markup_amount' => $range['markup_amount']]
            );
        }

        // Low Margin Template (for high-volume or promotional periods)
        $lowMarginTemplate = SellerMarkupTemplate::firstOrCreate(
            ['name' => 'Low Margin'],
            [
                'description' => 'Reduced markup template for competitive pricing or promotions.',
                'currency_id' => $zarCurrency->id,
                'is_default' => false,
                'is_active' => true,
            ]
        );

        $lowMarginRanges = [
            ['min_price' => 0.01, 'max_price' => 100.00, 'markup_amount' => 25.00],
            ['min_price' => 100.01, 'max_price' => 500.00, 'markup_amount' => 50.00],
            ['min_price' => 500.01, 'max_price' => 1000.00, 'markup_amount' => 100.00],
            ['min_price' => 1000.01, 'max_price' => 2500.00, 'markup_amount' => 175.00],
            ['min_price' => 2500.01, 'max_price' => 5000.00, 'markup_amount' => 250.00],
            ['min_price' => 5000.01, 'max_price' => 10000.00, 'markup_amount' => 400.00],
            ['min_price' => 10000.01, 'max_price' => 999999.99, 'markup_amount' => 500.00],
        ];

        foreach ($lowMarginRanges as $range) {
            SellerMarkupTemplateRange::firstOrCreate(
                [
                    'template_id' => $lowMarginTemplate->id,
                    'min_price' => $range['min_price'],
                    'max_price' => $range['max_price'],
                ],
                ['markup_amount' => $range['markup_amount']]
            );
        }

        $this->command->info('Markup templates seeded successfully!');
        $this->command->info('- Standard Markup (default): 7 price ranges');
        $this->command->info('- Premium Markup: 7 price ranges');
        $this->command->info('- Low Margin: 7 price ranges');
    }
}
