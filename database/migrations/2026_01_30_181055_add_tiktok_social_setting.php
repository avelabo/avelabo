<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('settings')->updateOrInsert(
            ['key' => 'social_tiktok'],
            [
                'key' => 'social_tiktok',
                'value' => 'https://www.tiktok.com/@avelabo.com',
                'type' => 'string',
                'group' => 'social',
                'is_public' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('settings')->where('key', 'social_tiktok')->delete();
    }
};
