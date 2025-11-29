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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 20)->nullable()->after('email');
            $table->timestamp('phone_verified_at')->nullable()->after('phone');
            $table->string('avatar')->nullable()->after('phone_verified_at');
            $table->foreignId('default_currency_id')->nullable()->after('avatar')->constrained('currencies')->nullOnDelete();
            $table->foreignId('country_id')->nullable()->after('default_currency_id')->constrained('countries')->nullOnDelete();
            $table->enum('status', ['active', 'suspended', 'banned'])->default('active')->after('country_id');
            $table->timestamp('last_login_at')->nullable()->after('status');
            $table->softDeletes();

            $table->index('phone');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['default_currency_id']);
            $table->dropForeign(['country_id']);
            $table->dropIndex(['phone']);
            $table->dropIndex(['status']);
            $table->dropSoftDeletes();
            $table->dropColumn([
                'phone',
                'phone_verified_at',
                'avatar',
                'default_currency_id',
                'country_id',
                'status',
                'last_login_at',
            ]);
        });
    }
};
