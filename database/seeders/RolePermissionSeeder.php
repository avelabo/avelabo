<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create Roles
        $roles = [
            [
                'name' => 'Administrator',
                'slug' => 'admin',
                'description' => 'Full system access',
                'is_default' => false,
            ],
            [
                'name' => 'Seller',
                'slug' => 'seller',
                'description' => 'Seller account with product management',
                'is_default' => false,
            ],
            [
                'name' => 'Customer',
                'slug' => 'customer',
                'description' => 'Regular customer account',
                'is_default' => true,
            ],
            [
                'name' => 'Support',
                'slug' => 'support',
                'description' => 'Customer support staff',
                'is_default' => false,
            ],
        ];

        $createdRoles = [];
        foreach ($roles as $role) {
            $createdRoles[$role['slug']] = Role::updateOrCreate(
                ['slug' => $role['slug']],
                $role
            );
        }

        // Create Permissions
        $permissions = [
            // User permissions
            ['name' => 'View Users', 'slug' => 'users.view', 'group' => 'users'],
            ['name' => 'Create Users', 'slug' => 'users.create', 'group' => 'users'],
            ['name' => 'Edit Users', 'slug' => 'users.edit', 'group' => 'users'],
            ['name' => 'Delete Users', 'slug' => 'users.delete', 'group' => 'users'],

            // Product permissions
            ['name' => 'View Products', 'slug' => 'products.view', 'group' => 'products'],
            ['name' => 'Create Products', 'slug' => 'products.create', 'group' => 'products'],
            ['name' => 'Edit Products', 'slug' => 'products.edit', 'group' => 'products'],
            ['name' => 'Delete Products', 'slug' => 'products.delete', 'group' => 'products'],

            // Order permissions
            ['name' => 'View Orders', 'slug' => 'orders.view', 'group' => 'orders'],
            ['name' => 'Create Orders', 'slug' => 'orders.create', 'group' => 'orders'],
            ['name' => 'Edit Orders', 'slug' => 'orders.edit', 'group' => 'orders'],
            ['name' => 'Delete Orders', 'slug' => 'orders.delete', 'group' => 'orders'],
            ['name' => 'Process Refunds', 'slug' => 'orders.refund', 'group' => 'orders'],

            // Seller permissions
            ['name' => 'View Sellers', 'slug' => 'sellers.view', 'group' => 'sellers'],
            ['name' => 'Approve Sellers', 'slug' => 'sellers.approve', 'group' => 'sellers'],
            ['name' => 'Edit Sellers', 'slug' => 'sellers.edit', 'group' => 'sellers'],
            ['name' => 'Manage Markups', 'slug' => 'sellers.markups', 'group' => 'sellers'],

            // Category permissions
            ['name' => 'Manage Categories', 'slug' => 'categories.manage', 'group' => 'catalog'],
            ['name' => 'Manage Brands', 'slug' => 'brands.manage', 'group' => 'catalog'],
            ['name' => 'Manage Attributes', 'slug' => 'attributes.manage', 'group' => 'catalog'],

            // Settings permissions
            ['name' => 'View Settings', 'slug' => 'settings.view', 'group' => 'settings'],
            ['name' => 'Edit Settings', 'slug' => 'settings.edit', 'group' => 'settings'],
            ['name' => 'Manage Currencies', 'slug' => 'currencies.manage', 'group' => 'settings'],
            ['name' => 'Manage Payment Gateways', 'slug' => 'payments.manage', 'group' => 'settings'],

            // Scraping permissions
            ['name' => 'Manage Scraping', 'slug' => 'scraping.manage', 'group' => 'scraping'],
            ['name' => 'View Scraping Logs', 'slug' => 'scraping.logs', 'group' => 'scraping'],

            // Reports permissions
            ['name' => 'View Reports', 'slug' => 'reports.view', 'group' => 'reports'],
            ['name' => 'Export Reports', 'slug' => 'reports.export', 'group' => 'reports'],
        ];

        $createdPermissions = [];
        foreach ($permissions as $permission) {
            $createdPermissions[$permission['slug']] = Permission::updateOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }

        // Assign permissions to roles
        $adminRole = $createdRoles['admin'];
        $sellerRole = $createdRoles['seller'];
        $customerRole = $createdRoles['customer'];
        $supportRole = $createdRoles['support'];

        // Admin gets all permissions
        $adminRole->permissions()->sync(
            Permission::all()->pluck('id')
        );

        // Seller permissions
        $sellerRole->permissions()->sync(
            Permission::whereIn('slug', [
                'products.view',
                'products.create',
                'products.edit',
                'products.delete',
                'orders.view',
                'orders.edit',
                'sellers.markups',
            ])->pluck('id')
        );

        // Customer permissions (minimal)
        $customerRole->permissions()->sync(
            Permission::whereIn('slug', [
                'products.view',
                'orders.view',
                'orders.create',
            ])->pluck('id')
        );

        // Support permissions
        $supportRole->permissions()->sync(
            Permission::whereIn('slug', [
                'users.view',
                'products.view',
                'orders.view',
                'orders.edit',
                'orders.refund',
                'sellers.view',
            ])->pluck('id')
        );
    }
}
