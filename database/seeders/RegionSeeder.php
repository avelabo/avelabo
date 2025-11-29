<?php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\Region;
use Illuminate\Database\Seeder;

class RegionSeeder extends Seeder
{
    public function run(): void
    {
        $malawi = Country::where('code', 'MW')->first();

        if (!$malawi) {
            return;
        }

        // Malawi has 3 regions: Northern, Central, Southern
        $regions = [
            [
                'name' => 'Northern Region',
                'code' => 'N',
                'is_active' => true,
            ],
            [
                'name' => 'Central Region',
                'code' => 'C',
                'is_active' => true,
            ],
            [
                'name' => 'Southern Region',
                'code' => 'S',
                'is_active' => true,
            ],
        ];

        foreach ($regions as $region) {
            Region::updateOrCreate(
                ['country_id' => $malawi->id, 'code' => $region['code']],
                array_merge($region, ['country_id' => $malawi->id])
            );
        }
    }
}
