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
        Schema::table('payments', function (Blueprint $table) {
            // Rename gateway_id to payment_gateway_id
            if (Schema::hasColumn('payments', 'gateway_id')) {
                $table->renameColumn('gateway_id', 'payment_gateway_id');
            }
        });

        Schema::table('payments', function (Blueprint $table) {
            // Add payment_gateway_id if it doesn't exist at all
            if (!Schema::hasColumn('payments', 'payment_gateway_id')) {
                $table->foreignId('payment_gateway_id')->nullable()->after('order_id')->constrained('payment_gateways');
            }

            // Add failed_at if it doesn't exist
            if (!Schema::hasColumn('payments', 'failed_at')) {
                $table->timestamp('failed_at')->nullable()->after('paid_at');
            }
        });

        // Make reference nullable if it exists
        if (Schema::hasColumn('payments', 'reference')) {
            Schema::table('payments', function (Blueprint $table) {
                $table->string('reference')->nullable()->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            if (Schema::hasColumn('payments', 'payment_gateway_id')) {
                $table->renameColumn('payment_gateway_id', 'gateway_id');
            }

            if (Schema::hasColumn('payments', 'failed_at')) {
                $table->dropColumn('failed_at');
            }
        });
    }
};
