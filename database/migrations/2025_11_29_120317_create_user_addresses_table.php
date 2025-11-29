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
        Schema::create('user_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('label')->default('Home'); // Home, Work, Other
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone', 20)->nullable();
            $table->string('address_line_1');
            $table->string('address_line_2')->nullable();
            $table->foreignId('city_id')->nullable()->constrained('cities')->nullOnDelete();
            $table->string('city_name')->nullable(); // Fallback if city not in database
            $table->foreignId('region_id')->nullable()->constrained('regions')->nullOnDelete();
            $table->string('region_name')->nullable(); // Fallback if region not in database
            $table->foreignId('country_id')->constrained('countries');
            $table->string('postal_code', 20)->nullable();
            $table->boolean('is_default')->default(false);
            $table->boolean('is_billing')->default(false); // Can be used as billing address
            $table->timestamps();

            $table->index(['user_id', 'is_default']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_addresses');
    }
};
