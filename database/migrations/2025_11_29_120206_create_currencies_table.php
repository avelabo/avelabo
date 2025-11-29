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
        Schema::create('currencies', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Malawian Kwacha"
            $table->string('code', 3)->unique(); // ISO 4217: MWK, ZAR, USD
            $table->string('symbol', 10); // e.g., "MK", "R", "$"
            $table->unsignedTinyInteger('decimal_places')->default(2);
            $table->boolean('symbol_before')->default(true); // Symbol before or after amount
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'is_default']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('currencies');
    }
};
