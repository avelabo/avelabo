<?php

namespace Database\Seeders;

use App\Models\Slider;
use Illuminate\Database\Seeder;

class SliderSeeder extends Seeder
{
    public function run(): void
    {
        $sliders = [
            [
                'title' => 'Fresh Vegetables',
                'subtitle' => "Don't miss amazing grocery deals",
                'description' => 'Save up to 50% off on your first order. Quality products delivered to your doorstep.',
                'image' => 'sliders/slider-1.png',
                'button_text' => 'Shop Now',
                'button_link' => '/shop',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Delicious Snacks',
                'subtitle' => 'Fresh & Healthy Organic Food',
                'description' => 'Get the best quality products at the lowest prices. Free delivery on orders over MK50,000.',
                'image' => 'sliders/slider-2.png',
                'button_text' => 'Explore',
                'button_link' => '/shop?category=snacks',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Premium Electronics',
                'subtitle' => 'Latest Tech at Best Prices',
                'description' => 'Discover our wide range of smartphones, laptops, and accessories from top brands.',
                'image' => 'sliders/slider-3.png',
                'button_text' => 'Browse Electronics',
                'button_link' => '/shop?category=electronics',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Fashion Collection',
                'subtitle' => 'New Season Arrivals',
                'description' => 'Trendy clothing and accessories for men, women, and kids. Express your style!',
                'image' => 'sliders/slider-4.png',
                'button_text' => 'Shop Fashion',
                'button_link' => '/shop?category=fashion',
                'sort_order' => 4,
                'is_active' => true,
            ],
        ];

        // Copy slider images from public to storage
        $sourcePath = public_path('images/frontend/slider');
        $destPath = storage_path('app/public/sliders');

        if (!file_exists($destPath)) {
            mkdir($destPath, 0755, true);
        }

        // Copy slider images
        for ($i = 1; $i <= 4; $i++) {
            $sourceFile = $sourcePath . "/slider-{$i}.png";
            $destFile = $destPath . "/slider-{$i}.png";
            if (file_exists($sourceFile) && !file_exists($destFile)) {
                copy($sourceFile, $destFile);
            }
        }

        foreach ($sliders as $slider) {
            Slider::updateOrCreate(
                ['title' => $slider['title']],
                $slider
            );
        }
    }
}
