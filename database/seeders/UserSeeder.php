<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        $admin = User::updateOrCreate(
            ['email' => 'admin@avelabo.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'phone' => '999000001',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Assign admin role
        $adminRole = Role::where('slug', 'admin')->first();
        if ($adminRole) {
            $admin->roles()->syncWithoutDetaching([$adminRole->id]);
        }

        // Create Seller User
        $seller = User::updateOrCreate(
            ['email' => 'seller@avelabo.com'],
            [
                'name' => 'Test Seller',
                'password' => Hash::make('password'),
                'phone' => '999000002',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Assign seller role
        $sellerRole = Role::where('slug', 'seller')->first();
        if ($sellerRole) {
            $seller->roles()->syncWithoutDetaching([$sellerRole->id]);
        }

        // Create Customer User
        $customer = User::updateOrCreate(
            ['email' => 'customer@avelabo.com'],
            [
                'name' => 'Test Customer',
                'password' => Hash::make('password'),
                'phone' => '999000003',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Assign customer role
        $customerRole = Role::where('slug', 'customer')->first();
        if ($customerRole) {
            $customer->roles()->syncWithoutDetaching([$customerRole->id]);
        }
    }
}
