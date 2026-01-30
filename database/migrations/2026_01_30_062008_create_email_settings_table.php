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
        Schema::create('email_settings', function (Blueprint $table) {
            $table->id();
            $table->string('email_type')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('category'); // customer, seller, admin
            $table->boolean('customer_enabled')->default(true);
            $table->boolean('seller_enabled')->default(true);
            $table->boolean('admin_enabled')->default(true);
            $table->boolean('sms_enabled')->default(false);
            $table->boolean('is_critical')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_settings');
    }
};
