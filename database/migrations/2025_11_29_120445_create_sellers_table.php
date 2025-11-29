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
        Schema::create('sellers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('shop_name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('logo')->nullable();
            $table->string('banner')->nullable();
            $table->enum('business_type', ['individual', 'company'])->default('individual');
            $table->string('business_name')->nullable(); // For companies
            $table->string('business_registration_number')->nullable();
            $table->foreignId('default_currency_id')->constrained('currencies');
            $table->foreignId('country_id')->constrained('countries');
            $table->enum('status', ['pending', 'active', 'suspended', 'banned', 'inactive'])->default('pending');
            $table->decimal('rating', 3, 2)->default(0); // 0.00 - 5.00
            $table->unsignedInteger('total_reviews')->default(0);
            $table->unsignedInteger('total_products')->default(0);
            $table->unsignedInteger('total_sales')->default(0);
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->string('source')->nullable(); // 'takealot', 'noon', null for local sellers
            $table->string('source_id')->nullable(); // External ID from scraped source
            $table->decimal('commission_rate', 5, 2)->default(10.00); // Platform commission %
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('slug');
            $table->index('status');
            $table->index(['source', 'source_id']);
            $table->index('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sellers');
    }
};
