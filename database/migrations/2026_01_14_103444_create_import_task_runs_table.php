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
        Schema::create('import_task_runs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('import_task_id')->constrained('import_tasks')->cascadeOnDelete();
            $table->enum('status', ['pending', 'running', 'completed', 'failed', 'cancelled'])->default('pending');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->unsignedInteger('total_items')->default(0);
            $table->unsignedInteger('processed_items')->default(0);
            $table->unsignedInteger('created_items')->default(0);
            $table->unsignedInteger('updated_items')->default(0);
            $table->unsignedInteger('skipped_items')->default(0);
            $table->unsignedInteger('failed_items')->default(0);
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->index('import_task_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('import_task_runs');
    }
};
