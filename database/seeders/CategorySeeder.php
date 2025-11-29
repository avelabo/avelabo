<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electronics',
                'slug' => 'electronics',
                'icon' => 'laptop',
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 1,
                'children' => [
                    ['name' => 'Mobile Phones', 'slug' => 'mobile-phones', 'is_featured' => true],
                    ['name' => 'Laptops & Computers', 'slug' => 'laptops-computers', 'is_featured' => true],
                    ['name' => 'Tablets', 'slug' => 'tablets'],
                    ['name' => 'TVs & Audio', 'slug' => 'tvs-audio'],
                    ['name' => 'Cameras', 'slug' => 'cameras'],
                    ['name' => 'Gaming', 'slug' => 'gaming'],
                    ['name' => 'Accessories', 'slug' => 'electronics-accessories'],
                ],
            ],
            [
                'name' => 'Fashion',
                'slug' => 'fashion',
                'icon' => 'shirt',
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 2,
                'children' => [
                    ['name' => "Men's Clothing", 'slug' => 'mens-clothing', 'is_featured' => true],
                    ['name' => "Women's Clothing", 'slug' => 'womens-clothing', 'is_featured' => true],
                    ['name' => "Kids' Clothing", 'slug' => 'kids-clothing'],
                    ['name' => 'Shoes', 'slug' => 'shoes'],
                    ['name' => 'Bags', 'slug' => 'bags'],
                    ['name' => 'Watches', 'slug' => 'watches'],
                    ['name' => 'Jewelry', 'slug' => 'jewelry'],
                ],
            ],
            [
                'name' => 'Home & Living',
                'slug' => 'home-living',
                'icon' => 'home',
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 3,
                'children' => [
                    ['name' => 'Furniture', 'slug' => 'furniture'],
                    ['name' => 'Bedding', 'slug' => 'bedding'],
                    ['name' => 'Kitchen & Dining', 'slug' => 'kitchen-dining'],
                    ['name' => 'Home Decor', 'slug' => 'home-decor'],
                    ['name' => 'Lighting', 'slug' => 'lighting'],
                    ['name' => 'Storage', 'slug' => 'storage'],
                ],
            ],
            [
                'name' => 'Appliances',
                'slug' => 'appliances',
                'icon' => 'refrigerator',
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 4,
                'children' => [
                    ['name' => 'Large Appliances', 'slug' => 'large-appliances'],
                    ['name' => 'Small Appliances', 'slug' => 'small-appliances'],
                    ['name' => 'Air Conditioning', 'slug' => 'air-conditioning'],
                ],
            ],
            [
                'name' => 'Health & Beauty',
                'slug' => 'health-beauty',
                'icon' => 'heart',
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 5,
                'children' => [
                    ['name' => 'Skincare', 'slug' => 'skincare'],
                    ['name' => 'Makeup', 'slug' => 'makeup'],
                    ['name' => 'Hair Care', 'slug' => 'hair-care'],
                    ['name' => 'Fragrances', 'slug' => 'fragrances'],
                    ['name' => 'Personal Care', 'slug' => 'personal-care'],
                    ['name' => 'Health & Wellness', 'slug' => 'health-wellness'],
                ],
            ],
            [
                'name' => 'Sports & Outdoors',
                'slug' => 'sports-outdoors',
                'icon' => 'dumbbell',
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 6,
                'children' => [
                    ['name' => 'Exercise & Fitness', 'slug' => 'exercise-fitness'],
                    ['name' => 'Team Sports', 'slug' => 'team-sports'],
                    ['name' => 'Outdoor Recreation', 'slug' => 'outdoor-recreation'],
                    ['name' => 'Camping & Hiking', 'slug' => 'camping-hiking'],
                ],
            ],
            [
                'name' => 'Groceries',
                'slug' => 'groceries',
                'icon' => 'shopping-basket',
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 7,
                'children' => [
                    ['name' => 'Food & Beverages', 'slug' => 'food-beverages'],
                    ['name' => 'Snacks', 'slug' => 'snacks'],
                    ['name' => 'Household Supplies', 'slug' => 'household-supplies'],
                    ['name' => 'Baby Products', 'slug' => 'baby-products'],
                    ['name' => 'Pet Supplies', 'slug' => 'pet-supplies'],
                ],
            ],
            [
                'name' => 'Automotive',
                'slug' => 'automotive',
                'icon' => 'car',
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 8,
                'children' => [
                    ['name' => 'Car Parts', 'slug' => 'car-parts'],
                    ['name' => 'Car Accessories', 'slug' => 'car-accessories'],
                    ['name' => 'Motorcycle Parts', 'slug' => 'motorcycle-parts'],
                    ['name' => 'Tools & Equipment', 'slug' => 'auto-tools'],
                ],
            ],
            [
                'name' => 'Books & Stationery',
                'slug' => 'books-stationery',
                'icon' => 'book',
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 9,
                'children' => [
                    ['name' => 'Books', 'slug' => 'books'],
                    ['name' => 'Office Supplies', 'slug' => 'office-supplies'],
                    ['name' => 'School Supplies', 'slug' => 'school-supplies'],
                ],
            ],
            [
                'name' => 'Toys & Games',
                'slug' => 'toys-games',
                'icon' => 'gamepad',
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 10,
                'children' => [
                    ['name' => 'Action Figures', 'slug' => 'action-figures'],
                    ['name' => 'Board Games', 'slug' => 'board-games'],
                    ['name' => 'Educational Toys', 'slug' => 'educational-toys'],
                    ['name' => 'Outdoor Toys', 'slug' => 'outdoor-toys'],
                ],
            ],
        ];

        $sortOrder = 1;
        foreach ($categories as $categoryData) {
            $children = $categoryData['children'] ?? [];
            unset($categoryData['children']);

            $category = Category::updateOrCreate(
                ['slug' => $categoryData['slug']],
                array_merge($categoryData, ['sort_order' => $sortOrder++])
            );

            $childSortOrder = 1;
            foreach ($children as $childData) {
                Category::updateOrCreate(
                    ['slug' => $childData['slug']],
                    array_merge([
                        'parent_id' => $category->id,
                        'is_active' => true,
                        'is_featured' => $childData['is_featured'] ?? false,
                        'sort_order' => $childSortOrder++,
                    ], $childData)
                );
            }
        }
    }
}
