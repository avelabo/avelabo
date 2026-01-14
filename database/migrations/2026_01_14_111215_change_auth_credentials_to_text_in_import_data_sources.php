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
        // For PostgreSQL, we need to use raw SQL to change from json to text
        DB::statement('ALTER TABLE import_data_sources ALTER COLUMN auth_credentials TYPE text');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Note: This will fail if there's encrypted data in the column
        DB::statement('ALTER TABLE import_data_sources ALTER COLUMN auth_credentials TYPE json USING auth_credentials::json');
    }
};
