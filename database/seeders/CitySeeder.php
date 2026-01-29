<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Country;
use App\Models\Region;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $malawi = Country::where('code', 'MW')->first();

        if (! $malawi) {
            return;
        }

        $regions = Region::where('country_id', $malawi->id)->get()->keyBy('code');

        // Major cities/districts in Malawi
        $cities = [
            // Northern Region
            ['region' => 'N', 'name' => 'Mzuzu', 'is_active' => true],
            ['region' => 'N', 'name' => 'Karonga', 'is_active' => true],
            ['region' => 'N', 'name' => 'Chitipa', 'is_active' => true],
            ['region' => 'N', 'name' => 'Rumphi', 'is_active' => true],
            ['region' => 'N', 'name' => 'Nkhata Bay', 'is_active' => true],
            ['region' => 'N', 'name' => 'Likoma', 'is_active' => true],

            // Central Region
            ['region' => 'C', 'name' => 'Lilongwe', 'is_active' => true],
            ['region' => 'C', 'name' => 'Kasungu', 'is_active' => true],
            ['region' => 'C', 'name' => 'Mchinji', 'is_active' => true],
            ['region' => 'C', 'name' => 'Dowa', 'is_active' => true],
            ['region' => 'C', 'name' => 'Salima', 'is_active' => true],
            ['region' => 'C', 'name' => 'Nkhotakota', 'is_active' => true],
            ['region' => 'C', 'name' => 'Ntchisi', 'is_active' => true],
            ['region' => 'C', 'name' => 'Dedza', 'is_active' => true],
            ['region' => 'C', 'name' => 'Ntcheu', 'is_active' => true],

            // Southern Region
            ['region' => 'S', 'name' => 'Blantyre', 'is_active' => true],
            ['region' => 'S', 'name' => 'Zomba', 'is_active' => true],
            ['region' => 'S', 'name' => 'Mangochi', 'is_active' => true],
            ['region' => 'S', 'name' => 'Machinga', 'is_active' => true],
            ['region' => 'S', 'name' => 'Balaka', 'is_active' => true],
            ['region' => 'S', 'name' => 'Mwanza', 'is_active' => true],
            ['region' => 'S', 'name' => 'Neno', 'is_active' => true],
            ['region' => 'S', 'name' => 'Chiradzulu', 'is_active' => true],
            ['region' => 'S', 'name' => 'Phalombe', 'is_active' => true],
            ['region' => 'S', 'name' => 'Mulanje', 'is_active' => true],
            ['region' => 'S', 'name' => 'Thyolo', 'is_active' => true],
            ['region' => 'S', 'name' => 'Chikwawa', 'is_active' => true],
            ['region' => 'S', 'name' => 'Nsanje', 'is_active' => true],
        ];

        foreach ($cities as $city) {
            $region = $regions->get($city['region']);
            if ($region) {
                City::updateOrCreate(
                    ['region_id' => $region->id, 'name' => $city['name']],
                    [
                        'region_id' => $region->id,
                        'name' => $city['name'],
                        'is_active' => $city['is_active'],
                    ]
                );
            }
        }
    }
}
