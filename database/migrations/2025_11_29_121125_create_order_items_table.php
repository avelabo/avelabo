<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * CRITICAL: Order items store BOTH base prices and markup amounts.
     * - base_price: Original seller price (for seller payouts)
     * - markup_amount: Platform revenue (NEVER shown to customer)
     * - display_price: What customer sees/pays (base + markup)
     *
     * Customer ONLY sees display_price. Never show base_price or markup_amount.
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->foreignId('seller_id')->constrained()->cascadeOnDelete();

            // Product snapshot (in case product changes)
            $table->string('product_name');
            $table->string('product_sku')->nullable();
            $table->string('variant_name')->nullable();
            $table->string('product_image')->nullable();

            $table->unsignedInteger('quantity');

            // Pricing breakdown (INTERNAL - for admin/seller only)
            $table->decimal('base_price', 15, 2); // Original seller price per unit
            $table->decimal('markup_amount', 15, 2); // Platform markup per unit
            $table->decimal('display_price', 15, 2); // What customer sees per unit (base + markup)
            $table->decimal('line_total', 15, 2); // display_price × quantity

            // Currency info
            $table->foreignId('currency_id')->constrained('currencies');
            $table->foreignId('seller_currency_id')->constrained('currencies'); // Seller's original currency
            $table->decimal('exchange_rate_used', 18, 8)->default(1); // Rate at time of order

            // Item status
            $table->enum('status', [
                'pending',
                'confirmed',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
                'refunded'
            ])->default('pending');

            // Fulfillment
            $table->string('tracking_number')->nullable();
            $table->string('tracking_carrier')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();

            $table->timestamps();

            $table->index('order_id');
            $table->index('seller_id');
            $table->index('product_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
