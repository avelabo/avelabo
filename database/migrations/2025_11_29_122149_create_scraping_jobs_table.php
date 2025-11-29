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
        Schema::create('scraping_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('source_id')->constrained('scraping_sources')->cascadeOnDelete();
            $table->enum('status', [
                'pending',
                'running',
                'completed',
                'failed',
                'cancelled'
            ])->default('pending');
            $table->string('type')->default('full'); // 'full', 'incremental', 'category', 'product'
            $table->json('config')->nullable(); // Job-specific config (e.g., category to scrape)
            $table->unsignedInteger('products_found')->default(0);
            $table->unsignedInteger('products_created')->default(0);
            $table->unsignedInteger('products_updated')->default(0);
            $table->unsignedInteger('products_failed')->default(0);
            $table->unsignedInteger('images_downloaded')->default(0);
            $table->text('error_message')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index('source_id');
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scraping_jobs');
    }
};
