<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * CRITICAL: This table stores the per-seller markup configuration.
     * Markups are applied at checkout and are INVISIBLE to customers.
     * Customers only see the final price (base + markup combined).
     */
    public function up(): void
    {
        Schema::create('seller_price_markups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained()->cascadeOnDelete();
            $table->decimal('min_price', 15, 2); // Start of price range
            $table->decimal('max_price', 15, 2); // End of price range
            $table->decimal('markup_amount', 15, 2); // Fixed amount to add
            $table->foreignId('currency_id')->constrained('currencies'); // Currency of the prices
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['seller_id', 'is_active']);
            // Ensure price ranges cover all products without overlap
            $table->unique(['seller_id', 'min_price', 'max_price']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seller_price_markups');
    }
};
