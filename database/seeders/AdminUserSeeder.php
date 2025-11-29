<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::updateOrCreate(
            ['email' => 'admin@avelabo.com'],
            [
                'name' => 'Admin',
                'email' => 'admin@avelabo.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'status' => 'active',
            ]
        );

        // Attach admin role
        $adminRole = Role::where('slug', 'admin')->first();
        if ($adminRole) {
            $admin->roles()->syncWithoutDetaching([$adminRole->id]);
        }

        // Create test seller user
        $seller = User::updateOrCreate(
            ['email' => 'seller@avelabo.com'],
            [
                'name' => 'Test Seller',
                'email' => 'seller@avelabo.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'status' => 'active',
            ]
        );

        // Attach seller role
        $sellerRole = Role::where('slug', 'seller')->first();
        if ($sellerRole) {
            $seller->roles()->syncWithoutDetaching([$sellerRole->id]);
        }

        // Create test customer user
        $customer = User::updateOrCreate(
            ['email' => 'customer@avelabo.com'],
            [
                'name' => 'Test Customer',
                'email' => 'customer@avelabo.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'status' => 'active',
            ]
        );

        // Attach customer role
        $customerRole = Role::where('slug', 'customer')->first();
        if ($customerRole) {
            $customer->roles()->syncWithoutDetaching([$customerRole->id]);
        }
    }
}
