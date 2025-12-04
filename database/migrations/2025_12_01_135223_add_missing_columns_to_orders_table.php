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
        Schema::table('orders', function (Blueprint $table) {
            // Rename shipping_fee to shipping_amount to match model
            if (Schema::hasColumn('orders', 'shipping_fee') && !Schema::hasColumn('orders', 'shipping_amount')) {
                $table->renameColumn('shipping_fee', 'shipping_amount');
            }

            // Add missing columns if they don't exist
            if (!Schema::hasColumn('orders', 'seller_id')) {
                $table->foreignId('seller_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
            }

            if (!Schema::hasColumn('orders', 'shipping_method')) {
                $table->string('shipping_method')->nullable()->after('billing_address_id');
            }

            if (!Schema::hasColumn('orders', 'tracking_number')) {
                $table->string('tracking_number')->nullable()->after('shipping_method');
            }

            if (!Schema::hasColumn('orders', 'cancellation_reason')) {
                $table->text('cancellation_reason')->nullable()->after('cancelled_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Revert column rename
            if (Schema::hasColumn('orders', 'shipping_amount') && !Schema::hasColumn('orders', 'shipping_fee')) {
                $table->renameColumn('shipping_amount', 'shipping_fee');
            }

            // Drop added columns
            $columns = ['seller_id', 'shipping_method', 'tracking_number', 'cancellation_reason'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('orders', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
