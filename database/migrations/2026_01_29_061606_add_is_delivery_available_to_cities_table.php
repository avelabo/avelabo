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
        Schema::table('cities', function (Blueprint $table) {
            $table->boolean('is_delivery_available')->default(false)->after('is_active');
        });

        // Mark only Lilongwe, Blantyre, and Mzuzu as delivery cities
        DB::table('cities')
            ->whereIn('name', ['Lilongwe', 'Blantyre', 'Mzuzu'])
            ->update(['is_delivery_available' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cities', function (Blueprint $table) {
            $table->dropColumn('is_delivery_available');
        });
    }
};
