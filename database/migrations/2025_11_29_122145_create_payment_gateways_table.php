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
        Schema::create('payment_gateways', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "PayChangu", "TNM Mpamba", "PayFast"
            $table->string('slug')->unique();
            $table->string('display_name'); // Customer-facing name
            $table->string('logo')->nullable();
            $table->text('description')->nullable();
            $table->json('config')->nullable(); // Encrypted gateway credentials
            $table->json('supported_currencies')->nullable(); // ['MWK', 'ZAR', 'USD']
            $table->json('supported_countries')->nullable(); // ['MW', 'ZA']
            $table->decimal('transaction_fee_percentage', 5, 2)->default(0);
            $table->decimal('transaction_fee_fixed', 10, 2)->default(0);
            $table->boolean('is_active')->default(false);
            $table->boolean('is_test_mode')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index('slug');
            $table->index(['is_active', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_gateways');
    }
};
