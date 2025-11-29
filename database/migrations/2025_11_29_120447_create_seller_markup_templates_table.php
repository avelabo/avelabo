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
        Schema::create('seller_markup_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Standard Markup", "Premium Markup"
            $table->text('description')->nullable();
            $table->foreignId('currency_id')->constrained('currencies'); // Currency of the ranges
            $table->boolean('is_default')->default(false); // Default template for new sellers
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('is_default');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seller_markup_templates');
    }
};
