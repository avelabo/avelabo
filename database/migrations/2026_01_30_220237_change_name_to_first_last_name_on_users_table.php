<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('name', 'first_name');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('last_name')->nullable()->after('first_name');
        });

        // Migrate existing data: split name into first_name and last_name
        DB::statement("
            UPDATE users
            SET last_name = COALESCE(
                NULLIF(SUBSTRING(first_name FROM POSITION(' ' IN first_name) + 1), ''),
                ''
            ),
            first_name = SPLIT_PART(first_name, ' ', 1)
            WHERE first_name LIKE '% %'
        ");

        // For names without spaces, set last_name to empty string
        DB::statement("
            UPDATE users
            SET last_name = ''
            WHERE last_name IS NULL
        ");

        // Now make last_name not nullable
        Schema::table('users', function (Blueprint $table) {
            $table->string('last_name')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Combine first_name and last_name back into name
        DB::statement("
            UPDATE users
            SET first_name = TRIM(CONCAT(first_name, ' ', last_name))
        ");

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('last_name');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('first_name', 'name');
        });
    }
};
