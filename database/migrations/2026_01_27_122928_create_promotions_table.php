<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['seller', 'system']);
            $table->foreignId('seller_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('discount_type', ['percentage', 'fixed']);
            $table->decimal('discount_value', 10, 2);
            $table->enum('scope_type', ['all', 'category', 'tag', 'brand']);
            $table->unsignedBigInteger('scope_id')->nullable();
            $table->timestamp('start_date');
            $table->timestamp('end_date');
            $table->integer('priority')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['type', 'is_active', 'start_date', 'end_date']);
            $table->index(['seller_id', 'is_active']);
            $table->index(['scope_type', 'scope_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
