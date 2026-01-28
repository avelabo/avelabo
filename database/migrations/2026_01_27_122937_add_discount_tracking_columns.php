<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->foreignId('coupon_id')->nullable()->constrained()->nullOnDelete();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('coupon_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('promotion_discount_amount', 15, 2)->default(0);
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->decimal('promotion_discount', 15, 2)->default(0);
            $table->decimal('coupon_discount', 15, 2)->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->dropConstrainedForeignId('coupon_id');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('coupon_id');
            $table->dropColumn('promotion_discount_amount');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn(['promotion_discount', 'coupon_discount']);
        });
    }
};
