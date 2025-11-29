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
        Schema::create('scraping_sources', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Takealot", "Noon"
            $table->string('slug')->unique();
            $table->string('base_url');
            $table->foreignId('seller_id')->nullable()->constrained()->nullOnDelete(); // Associated seller
            $table->foreignId('default_currency_id')->constrained('currencies');
            $table->foreignId('default_category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->json('config')->nullable(); // Scraper-specific configuration
            $table->string('schedule')->nullable(); // Cron schedule
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_scraped_at')->nullable();
            $table->timestamps();

            $table->index('slug');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scraping_sources');
    }
};
