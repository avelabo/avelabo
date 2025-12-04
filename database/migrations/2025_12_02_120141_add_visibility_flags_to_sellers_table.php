<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('sellers', function (Blueprint $table) {
            // If false, products show under "Avelabo" instead of seller name
            $table->boolean('show_seller_name')->default(true)->after('status');
            // If false, seller won't have a public storefront page
            $table->boolean('has_storefront')->default(true)->after('show_seller_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sellers', function (Blueprint $table) {
            $table->dropColumn(['show_seller_name', 'has_storefront']);
        });
    }
};
