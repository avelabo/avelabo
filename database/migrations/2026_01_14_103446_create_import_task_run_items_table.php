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
        Schema::create('import_task_run_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('import_task_run_id')->constrained('import_task_runs')->cascadeOnDelete();
            $table->string('source_id');
            $table->json('source_data')->nullable();
            $table->enum('item_type', ['category', 'product', 'brand', 'variant', 'image'])->default('product');
            $table->unsignedBigInteger('local_id')->nullable();
            $table->enum('status', ['pending', 'created', 'updated', 'skipped', 'failed'])->default('pending');
            $table->text('error_message')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->index('import_task_run_id');
            $table->index(['source_id', 'item_type']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('import_task_run_items');
    }
};
