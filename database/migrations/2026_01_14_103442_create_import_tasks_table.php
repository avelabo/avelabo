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
        Schema::create('import_tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('data_source_id')->constrained('import_data_sources')->cascadeOnDelete();
            $table->foreignId('seller_id')->constrained('sellers')->cascadeOnDelete();
            $table->enum('import_type', ['categories', 'products'])->default('products');
            $table->unsignedInteger('source_category_id')->nullable();
            $table->string('source_category_name')->nullable();
            $table->foreignId('target_category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->boolean('run_in_background')->default(false);
            $table->json('settings')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_run_at')->nullable();
            $table->timestamps();

            $table->index('data_source_id');
            $table->index('seller_id');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('import_tasks');
    }
};
