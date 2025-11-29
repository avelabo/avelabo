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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // Guest info (if not logged in)
            $table->string('guest_email')->nullable();
            $table->string('guest_phone')->nullable();

            // Order status
            $table->enum('status', [
                'pending',
                'confirmed',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
                'refunded',
                'failed'
            ])->default('pending');

            // Payment status
            $table->enum('payment_status', [
                'pending',
                'processing',
                'paid',
                'failed',
                'refunded',
                'partially_refunded'
            ])->default('pending');

            // Amounts (all in display currency)
            $table->decimal('subtotal', 15, 2); // Sum of item display prices
            $table->decimal('shipping_fee', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('total', 15, 2); // Final amount customer pays
            $table->foreignId('currency_id')->constrained('currencies');

            // Internal tracking (ADMIN ONLY - never shown to customer)
            $table->decimal('total_base_amount', 15, 2)->default(0); // Sum of base prices
            $table->decimal('total_markup_amount', 15, 2)->default(0); // Platform revenue

            // Addresses
            $table->foreignId('shipping_address_id')->nullable()->constrained('user_addresses')->nullOnDelete();
            $table->foreignId('billing_address_id')->nullable()->constrained('user_addresses')->nullOnDelete();

            // Address snapshots (in case address is deleted)
            $table->json('shipping_address_snapshot')->nullable();
            $table->json('billing_address_snapshot')->nullable();

            // Payment
            $table->string('payment_method')->nullable();
            $table->string('payment_gateway')->nullable();

            // Additional info
            $table->text('notes')->nullable();
            $table->text('admin_notes')->nullable();
            $table->string('coupon_code')->nullable();

            // Timestamps
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('order_number');
            $table->index('user_id');
            $table->index('status');
            $table->index('payment_status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
