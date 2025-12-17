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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('brand_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('short_description')->nullable();
            $table->text('specifications')->nullable(); // JSON or HTML

            // Pricing - BASE prices only, markups applied at display time
            $table->decimal('base_price', 15, 2); // Base price before markup
            $table->decimal('compare_at_price', 15, 2)->nullable(); // Original/strikethrough price
            $table->foreignId('currency_id')->constrained('currencies');

            // Inventory
            $table->string('sku')->nullable();
            $table->string('barcode')->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->unsignedInteger('low_stock_threshold')->default(5);
            $table->boolean('track_inventory')->default(true);
            $table->boolean('allow_backorders')->default(false);

            // Status & visibility
            $table->enum('status', ['draft', 'active', 'inactive', 'out_of_stock'])->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new')->default(true);
            $table->boolean('is_on_sale')->default(false);

            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            // External source
            $table->string('source')->nullable(); // External source identifier
            $table->string('source_id')->nullable(); // External product ID
            $table->string('source_url')->nullable(); // Original product URL

            // Stats
            $table->unsignedInteger('views_count')->default(0);
            $table->unsignedInteger('sales_count')->default(0);
            $table->decimal('rating', 3, 2)->default(0);
            $table->unsignedInteger('reviews_count')->default(0);

            // Physical attributes
            $table->decimal('weight', 10, 3)->nullable(); // in kg
            $table->decimal('length', 10, 2)->nullable(); // in cm
            $table->decimal('width', 10, 2)->nullable();
            $table->decimal('height', 10, 2)->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('slug');
            $table->index('seller_id');
            $table->index('category_id');
            $table->index('brand_id');
            $table->index('status');
            $table->index('is_featured');
            $table->index(['source', 'source_id']);
            $table->index('base_price');
            $table->fullText(['name', 'description', 'short_description']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
