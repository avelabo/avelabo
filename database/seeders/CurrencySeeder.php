<?php

namespace Database\Seeders;

use App\Models\Currency;
use App\Models\ExchangeRate;
use Illuminate\Database\Seeder;

class CurrencySeeder extends Seeder
{
    public function run(): void
    {
        $currencies = [
            [
                'code' => 'MWK',
                'name' => 'Malawian Kwacha',
                'symbol' => 'MK',
                'decimal_places' => 2,
                'symbol_before' => true,
                'is_active' => true,
                'is_default' => true,
            ],
            [
                'code' => 'ZAR',
                'name' => 'South African Rand',
                'symbol' => 'R',
                'decimal_places' => 2,
                'symbol_before' => true,
                'is_active' => true,
                'is_default' => false,
            ],
            [
                'code' => 'USD',
                'name' => 'US Dollar',
                'symbol' => '$',
                'decimal_places' => 2,
                'symbol_before' => true,
                'is_active' => true,
                'is_default' => false,
            ],
            [
                'code' => 'GBP',
                'name' => 'British Pound',
                'symbol' => '£',
                'decimal_places' => 2,
                'symbol_before' => true,
                'is_active' => false,
                'is_default' => false,
            ],
            [
                'code' => 'EUR',
                'name' => 'Euro',
                'symbol' => '€',
                'decimal_places' => 2,
                'symbol_before' => true,
                'is_active' => false,
                'is_default' => false,
            ],
        ];

        foreach ($currencies as $currency) {
            Currency::updateOrCreate(
                ['code' => $currency['code']],
                $currency
            );
        }

        // Create exchange rates (approximate rates as of 2024)
        $this->seedExchangeRates();
    }

    protected function seedExchangeRates(): void
    {
        $mwk = Currency::where('code', 'MWK')->first();
        $zar = Currency::where('code', 'ZAR')->first();
        $usd = Currency::where('code', 'USD')->first();

        if (!$mwk || !$zar || !$usd) {
            return;
        }

        // Approximate rates: 1 USD = 1700 MWK, 1 ZAR = 90 MWK
        $rates = [
            ['from' => $usd->id, 'to' => $mwk->id, 'rate' => 1700.00],
            ['from' => $zar->id, 'to' => $mwk->id, 'rate' => 90.00],
            ['from' => $usd->id, 'to' => $zar->id, 'rate' => 18.90],
        ];

        foreach ($rates as $rate) {
            ExchangeRate::updateOrCreate(
                [
                    'from_currency_id' => $rate['from'],
                    'to_currency_id' => $rate['to'],
                ],
                ['rate' => $rate['rate']]
            );
        }
    }
}
