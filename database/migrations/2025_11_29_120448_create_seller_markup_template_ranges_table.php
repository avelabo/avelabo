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
        Schema::create('seller_markup_template_ranges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained('seller_markup_templates')->cascadeOnDelete();
            $table->decimal('min_price', 15, 2); // Start of price range
            $table->decimal('max_price', 15, 2); // End of price range
            $table->decimal('markup_amount', 15, 2); // Fixed amount to add
            $table->timestamps();

            $table->index('template_id');
            // Ensure ranges don't overlap within a template
            $table->unique(['template_id', 'min_price', 'max_price']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seller_markup_template_ranges');
    }
};
