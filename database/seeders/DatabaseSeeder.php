<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Note: Core control data (countries, regions, cities, currencies, roles,
     * permissions, admin user, payment gateways, settings, markup templates,
     * attributes, categories, email settings) are seeded via migrations.
     * See: database/migrations/2026_01_28_081016_seed_control_data.php
     *      database/migrations/2026_01_30_144234_seed_email_settings_data.php
     *
     * This seeder only creates test/development data.
     */
    public function run(): void
    {
        $this->call([
            // Test sellers (development only)
            SellerSeeder::class,

            // Test products (development only)
            ProductSeeder::class,

            // Homepage sliders (development only)
            SliderSeeder::class,
        ]);
    }
}
