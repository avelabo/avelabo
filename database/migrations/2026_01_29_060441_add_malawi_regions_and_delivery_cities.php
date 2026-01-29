<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $now = now();

        // Get Malawi's ID
        $malawi = DB::table('countries')->where('code', 'MWI')->first();

        if (! $malawi) {
            return;
        }

        // Create Malawi's 3 regions
        $regions = [
            ['country_id' => $malawi->id, 'name' => 'Northern Region', 'code' => 'N', 'is_active' => true],
            ['country_id' => $malawi->id, 'name' => 'Central Region', 'code' => 'C', 'is_active' => true],
            ['country_id' => $malawi->id, 'name' => 'Southern Region', 'code' => 'S', 'is_active' => true],
        ];

        foreach ($regions as $region) {
            DB::table('regions')->updateOrInsert(
                ['country_id' => $region['country_id'], 'code' => $region['code']],
                array_merge($region, [
                    'created_at' => $now,
                    'updated_at' => $now,
                ])
            );
        }

        // Get region IDs
        $northernRegion = DB::table('regions')
            ->where('country_id', $malawi->id)
            ->where('code', 'N')
            ->first();

        $centralRegion = DB::table('regions')
            ->where('country_id', $malawi->id)
            ->where('code', 'C')
            ->first();

        $southernRegion = DB::table('regions')
            ->where('country_id', $malawi->id)
            ->where('code', 'S')
            ->first();

        // Create the 3 delivery cities (only these cities are available for delivery)
        $deliveryCities = [
            ['region_id' => $centralRegion->id, 'name' => 'Lilongwe', 'is_active' => true],
            ['region_id' => $northernRegion->id, 'name' => 'Mzuzu', 'is_active' => true],
            ['region_id' => $southernRegion->id, 'name' => 'Blantyre', 'is_active' => true],
        ];

        foreach ($deliveryCities as $city) {
            DB::table('cities')->updateOrInsert(
                ['region_id' => $city['region_id'], 'name' => $city['name']],
                array_merge($city, [
                    'created_at' => $now,
                    'updated_at' => $now,
                ])
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $malawi = DB::table('countries')->where('code', 'MWI')->first();

        if (! $malawi) {
            return;
        }

        // Get region IDs for Malawi
        $regionIds = DB::table('regions')
            ->where('country_id', $malawi->id)
            ->pluck('id');

        // Delete cities in these regions
        DB::table('cities')->whereIn('region_id', $regionIds)->delete();

        // Delete regions
        DB::table('regions')->whereIn('id', $regionIds)->delete();
    }
};
