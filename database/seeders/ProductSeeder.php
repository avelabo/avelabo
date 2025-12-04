<?php

namespace Database\Seeders;

use App\Models\Seller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Category;
use App\Models\Currency;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $seller = Seller::where('status', 'active')->first();
        $currency = Currency::where('code', 'MWK')->first();
        $categories = Category::whereNotNull('parent_id')->get();

        if (!$seller || !$currency || $categories->isEmpty()) {
            return;
        }

        // Copy product images from public to storage
        $this->copyProductImages();

        $products = [
            [
                'name' => 'iPhone 15 Pro Max 256GB',
                'description' => 'Latest Apple iPhone with A17 Pro chip, titanium design, and advanced camera system. Features a 6.7-inch Super Retina XDR display with ProMotion technology. Capture stunning photos with the 48MP main camera and experience console-level gaming with the powerful GPU.',
                'short_description' => 'Apple iPhone 15 Pro Max - The ultimate iPhone',
                'base_price' => 850000,
                'compare_at_price' => 950000,
                'stock_quantity' => 15,
                'status' => 'active',
                'is_featured' => true,
                'images' => ['product-1-1.jpg', 'product-1-2.jpg'],
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra',
                'description' => 'Samsung flagship phone with Galaxy AI, S Pen, and 200MP camera. Experience the power of artificial intelligence in your daily tasks. Features a stunning 6.8-inch Dynamic AMOLED 2X display with 2600 nits peak brightness.',
                'short_description' => 'Samsung Galaxy S24 Ultra with AI features',
                'base_price' => 780000,
                'compare_at_price' => null,
                'stock_quantity' => 20,
                'status' => 'active',
                'is_featured' => true,
                'images' => ['product-2-1.jpg', 'product-2-2.jpg'],
            ],
            [
                'name' => 'MacBook Air M3 13"',
                'description' => 'Supercharged by M3 chip. Up to 18 hours of battery life. Strikingly thin design with a 13.6-inch Liquid Retina display. Perfect for work, creativity, and everything in between.',
                'short_description' => 'Apple MacBook Air with M3 chip',
                'base_price' => 1200000,
                'compare_at_price' => 1350000,
                'stock_quantity' => 8,
                'status' => 'active',
                'is_featured' => true,
                'images' => ['product-3-1.jpg', 'product-3-2.jpg'],
            ],
            [
                'name' => 'Sony WH-1000XM5 Headphones',
                'description' => 'Industry-leading noise cancellation headphones with exceptional sound quality. Features 30-hour battery life, multipoint connection, and crystal-clear calls with 8 microphones.',
                'short_description' => 'Premium wireless noise-cancelling headphones',
                'base_price' => 280000,
                'compare_at_price' => 320000,
                'stock_quantity' => 25,
                'status' => 'active',
                'is_featured' => false,
                'images' => ['product-4-1.jpg', 'product-4-2.jpg'],
            ],
            [
                'name' => 'Nike Air Max 90',
                'description' => 'Iconic Nike Air Max 90 sneakers with visible Air cushioning. Classic design meets modern comfort. Perfect for both athletic activities and casual everyday wear.',
                'short_description' => 'Classic Nike Air Max sneakers',
                'base_price' => 95000,
                'compare_at_price' => null,
                'stock_quantity' => 50,
                'status' => 'active',
                'is_featured' => false,
                'images' => ['product-5-1.jpg', 'product-5-2.jpg'],
            ],
            [
                'name' => 'Organic Green Tea - 100 Bags',
                'description' => 'Premium organic green tea sourced from the finest tea gardens. Rich in antioxidants and perfect for a healthy lifestyle. Each pack contains 100 individually wrapped tea bags.',
                'short_description' => 'Premium organic green tea bags',
                'base_price' => 15000,
                'compare_at_price' => 18000,
                'stock_quantity' => 100,
                'status' => 'active',
                'is_featured' => false,
                'images' => ['product-6-1.jpg', 'product-6-2.jpg'],
            ],
            [
                'name' => 'Wireless Bluetooth Speaker',
                'description' => 'Portable Bluetooth speaker with powerful 360° sound. Waterproof IPX7 rating, 24-hour battery life, and built-in microphone for calls. Perfect for outdoor adventures.',
                'short_description' => 'Portable waterproof Bluetooth speaker',
                'base_price' => 45000,
                'compare_at_price' => 55000,
                'stock_quantity' => 35,
                'status' => 'active',
                'is_featured' => true,
                'images' => ['product-7-1.jpg', 'product-7-2.jpg'],
            ],
            [
                'name' => 'Vitamin C Serum 30ml',
                'description' => 'Professional-grade vitamin C serum for brighter, more youthful skin. Contains 20% L-ascorbic acid with hyaluronic acid for maximum absorption and hydration.',
                'short_description' => 'Anti-aging vitamin C face serum',
                'base_price' => 35000,
                'compare_at_price' => null,
                'stock_quantity' => 60,
                'status' => 'active',
                'is_featured' => false,
                'images' => ['product-8-1.jpg', 'product-8-2.jpg'],
            ],
            [
                'name' => 'Stainless Steel Water Bottle 1L',
                'description' => 'Double-walled vacuum insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof, and eco-friendly alternative to plastic bottles.',
                'short_description' => 'Insulated stainless steel water bottle',
                'base_price' => 12000,
                'compare_at_price' => 15000,
                'stock_quantity' => 80,
                'status' => 'active',
                'is_featured' => false,
                'images' => ['product-9-1.jpg', 'product-9-2.jpg'],
            ],
            [
                'name' => 'Wireless Charging Pad',
                'description' => 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek, compact design with LED indicator and over-charge protection.',
                'short_description' => '15W fast wireless charger',
                'base_price' => 18000,
                'compare_at_price' => 22000,
                'stock_quantity' => 45,
                'status' => 'active',
                'is_featured' => false,
                'images' => ['product-10-1.jpg', 'product-10-2.jpg'],
            ],
            [
                'name' => 'Leather Wallet - Brown',
                'description' => 'Genuine leather bi-fold wallet with RFID blocking technology. Multiple card slots, cash compartments, and a timeless design that gets better with age.',
                'short_description' => 'Premium genuine leather wallet',
                'base_price' => 25000,
                'compare_at_price' => null,
                'stock_quantity' => 40,
                'status' => 'active',
                'is_featured' => false,
                'images' => ['product-11-1.jpg', 'product-11-2.jpg'],
            ],
            [
                'name' => 'Smart Watch Pro',
                'description' => 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life. Track your fitness goals, receive notifications, and make contactless payments.',
                'short_description' => 'Feature-rich fitness smartwatch',
                'base_price' => 120000,
                'compare_at_price' => 145000,
                'stock_quantity' => 30,
                'status' => 'active',
                'is_featured' => true,
                'images' => ['product-12-1.jpg', 'product-12-2.jpg'],
            ],
            [
                'name' => 'Organic Honey 500g',
                'description' => 'Pure, raw organic honey harvested from local beekeepers. Unprocessed and unpasteurized to preserve natural enzymes and nutrients. Perfect for tea, cooking, or as a natural sweetener.',
                'short_description' => 'Pure raw organic honey',
                'base_price' => 8500,
                'compare_at_price' => null,
                'stock_quantity' => 75,
                'status' => 'active',
                'is_featured' => false,
                'images' => ['product-13-1.jpg', 'product-13-2.jpg'],
            ],
            [
                'name' => 'Running Shoes - Ultraboost',
                'description' => 'High-performance running shoes with responsive cushioning and adaptive fit. Breathable mesh upper and Continental rubber outsole for superior grip.',
                'short_description' => 'Premium performance running shoes',
                'base_price' => 135000,
                'compare_at_price' => 160000,
                'stock_quantity' => 25,
                'status' => 'active',
                'is_featured' => true,
                'images' => ['product-14-1.jpg', 'product-14-2.jpg'],
            ],
            [
                'name' => 'Backpack - Travel Series',
                'description' => 'Durable travel backpack with laptop compartment, multiple pockets, and water-resistant material. Perfect for daily commute or weekend adventures. 35L capacity.',
                'short_description' => 'Water-resistant travel backpack',
                'base_price' => 55000,
                'compare_at_price' => 65000,
                'stock_quantity' => 40,
                'status' => 'active',
                'is_featured' => false,
                'images' => ['product-15-1.jpg', 'product-15-2.jpg'],
            ],
            [
                'name' => 'Premium Coffee Beans 1kg',
                'description' => 'Single-origin Arabica coffee beans, medium roasted for a balanced flavor profile. Notes of chocolate, caramel, and citrus. Freshly roasted and packed to preserve aroma.',
                'short_description' => 'Freshly roasted Arabica coffee beans',
                'base_price' => 28000,
                'compare_at_price' => 32000,
                'stock_quantity' => 55,
                'status' => 'active',
                'is_featured' => false,
                'images' => ['product-16-1.jpg', 'product-16-2.jpg'],
            ],
        ];

        foreach ($products as $index => $productData) {
            $images = $productData['images'] ?? [];
            unset($productData['images']);

            $product = Product::create([
                'seller_id' => $seller->id,
                'category_id' => $categories->random()->id,
                'name' => $productData['name'],
                'slug' => Str::slug($productData['name']) . '-' . Str::random(5),
                'description' => $productData['description'],
                'short_description' => $productData['short_description'],
                'base_price' => $productData['base_price'],
                'compare_at_price' => $productData['compare_at_price'],
                'currency_id' => $currency->id,
                'sku' => 'SKU-' . strtoupper(Str::random(6)),
                'stock_quantity' => $productData['stock_quantity'],
                'low_stock_threshold' => 5,
                'track_inventory' => true,
                'status' => $productData['status'],
                'is_featured' => $productData['is_featured'],
            ]);

            // Add product images
            foreach ($images as $sortOrder => $imageName) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => 'products/' . $imageName,
                    'alt_text' => $product->name,
                    'sort_order' => $sortOrder,
                    'is_primary' => $sortOrder === 0,
                ]);
            }
        }
    }

    private function copyProductImages(): void
    {
        $sourcePath = public_path('images/frontend/shop');
        $destPath = storage_path('app/public/products');

        if (!file_exists($destPath)) {
            mkdir($destPath, 0755, true);
        }

        // Copy all product images
        for ($i = 1; $i <= 16; $i++) {
            for ($j = 1; $j <= 2; $j++) {
                $sourceFile = $sourcePath . "/product-{$i}-{$j}.jpg";
                $destFile = $destPath . "/product-{$i}-{$j}.jpg";
                if (file_exists($sourceFile) && !file_exists($destFile)) {
                    copy($sourceFile, $destFile);
                }
            }
        }
    }
}
