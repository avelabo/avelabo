<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        $countries = [
            [
                'name' => 'Malawi',
                'code' => 'MWI',
                'code_2' => 'MW',
                'phone_code' => '+265',
                'currency_code' => 'MWK',
                'is_active' => true,
            ],
            [
                'name' => 'South Africa',
                'code' => 'ZAF',
                'code_2' => 'ZA',
                'phone_code' => '+27',
                'currency_code' => 'ZAR',
                'is_active' => true,
            ],
            [
                'name' => 'United States',
                'code' => 'USA',
                'code_2' => 'US',
                'phone_code' => '+1',
                'currency_code' => 'USD',
                'is_active' => true,
            ],
            [
                'name' => 'United Kingdom',
                'code' => 'GBR',
                'code_2' => 'GB',
                'phone_code' => '+44',
                'currency_code' => 'GBP',
                'is_active' => false,
            ],
            [
                'name' => 'Zambia',
                'code' => 'ZMB',
                'code_2' => 'ZM',
                'phone_code' => '+260',
                'currency_code' => 'ZMW',
                'is_active' => false,
            ],
            [
                'name' => 'Mozambique',
                'code' => 'MOZ',
                'code_2' => 'MZ',
                'phone_code' => '+258',
                'currency_code' => 'MZN',
                'is_active' => false,
            ],
            [
                'name' => 'Tanzania',
                'code' => 'TZA',
                'code_2' => 'TZ',
                'phone_code' => '+255',
                'currency_code' => 'TZS',
                'is_active' => false,
            ],
        ];

        foreach ($countries as $country) {
            Country::updateOrCreate(
                ['code' => $country['code']],
                $country
            );
        }
    }
}
