<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Product;
use App\Models\Slider;
use App\Services\DiscountService;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the homepage
     */
    public function index()
    {
        // Get active sliders
        $sliders = Slider::active()
            ->ordered()
            ->get(['id', 'title', 'subtitle', 'description', 'image', 'button_text', 'button_link', 'text_options']);

        // Featured products (hot deals, featured items)
        $featuredProducts = Product::with(['category:id,name,slug', 'images'])
            ->active()
            ->inStock()
            ->featured()
            ->latest()
            ->take(10)
            ->get()
            ->map->toCardArray();

        // Popular products (most viewed or sold)
        $popularProducts = Product::with(['category:id,name,slug', 'images'])
            ->active()
            ->inStock()
            ->orderBy('views_count', 'desc')
            ->take(10)
            ->get()
            ->map->toCardArray();

        // New arrivals
        $newProducts = Product::with(['category:id,name,slug', 'images'])
            ->active()
            ->inStock()
            ->latest()
            ->take(10)
            ->get()
            ->map->toCardArray();

        // On sale products (products with active promotions)
        $discountService = app(DiscountService::class);
        $saleProducts = Product::with(['category:id,name,slug', 'images'])
            ->active()
            ->inStock()
            ->orderBy('views_count', 'desc')
            ->take(50)
            ->get()
            ->filter(fn ($product) => $discountService->getProductDiscount($product, $product->display_price)['has_discount'])
            ->take(10)
            ->map->toCardArray()
            ->values();

        // Featured brands with product count
        $featuredBrands = Brand::withCount(['products as active_products_count' => function ($query) {
            $query->active()->inStock();
        }])
            ->active()
            ->featured()
            ->orderByDesc('active_products_count')
            ->take(12)
            ->get()
            ->map(fn ($brand) => [
                'id' => $brand->id,
                'name' => $brand->name,
                'slug' => $brand->slug,
                'logo' => $brand->logo,
                'products_count' => $brand->active_products_count,
            ]);

        // Best selling products
        $bestSellers = Product::with(['category:id,name,slug', 'images'])
            ->active()
            ->inStock()
            ->orderBy('sales_count', 'desc')
            ->take(6)
            ->get()
            ->map->toCardArray();

        // Daily deals (random featured products with active promotions)
        $dailyDeals = Product::with(['category:id,name,slug', 'images'])
            ->active()
            ->inStock()
            ->featured()
            ->inRandomOrder()
            ->take(20)
            ->get()
            ->filter(fn ($product) => $discountService->getProductDiscount($product, $product->display_price)['has_discount'])
            ->take(4)
            ->map(fn ($product) => [
                ...$product->toCardArray(),
                'sale_ends_at' => $product->sale_ends_at?->toIso8601String(),
            ]);

        return Inertia::render('Frontend/Home', [
            'sliders' => $sliders,
            'featuredProducts' => $featuredProducts,
            'popularProducts' => $popularProducts,
            'newProducts' => $newProducts,
            'saleProducts' => $saleProducts,
            'featuredBrands' => $featuredBrands,
            'bestSellers' => $bestSellers,
            'dailyDeals' => $dailyDeals,
        ]);
    }
}
