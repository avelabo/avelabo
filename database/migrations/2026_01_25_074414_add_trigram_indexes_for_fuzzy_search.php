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
        // Enable pg_trgm extension for fuzzy/similarity matching
        DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');

        // Create GIN trigram indexes for fuzzy search on product name
        DB::statement('CREATE INDEX IF NOT EXISTS products_name_trgm_idx ON products USING GIN (name gin_trgm_ops)');

        // Create GIN trigram indexes for fuzzy search on category name
        DB::statement('CREATE INDEX IF NOT EXISTS categories_name_trgm_idx ON categories USING GIN (name gin_trgm_ops)');

        // Create GIN trigram indexes for fuzzy search on brand name
        DB::statement('CREATE INDEX IF NOT EXISTS brands_name_trgm_idx ON brands USING GIN (name gin_trgm_ops)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop trigram indexes
        DB::statement('DROP INDEX IF EXISTS products_name_trgm_idx');
        DB::statement('DROP INDEX IF EXISTS categories_name_trgm_idx');
        DB::statement('DROP INDEX IF EXISTS brands_name_trgm_idx');

        // Note: We don't drop the extension as other parts of the app might use it
    }
};
