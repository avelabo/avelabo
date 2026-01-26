<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Product;
use App\Models\Slider;
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
            ->get(['id', 'title', 'subtitle', 'description', 'image', 'button_text', 'button_link']);

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

        // On sale products
        $saleProducts = Product::with(['category:id,name,slug', 'images'])
            ->active()
            ->inStock()
            ->whereNotNull('compare_at_price')
            ->whereRaw('compare_at_price > base_price')
            ->orderBy('views_count', 'desc')
            ->take(10)
            ->get()
            ->map->toCardArray();

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

        // Daily deals (random featured on-sale products)
        $dailyDeals = Product::with(['category:id,name,slug', 'images'])
            ->active()
            ->inStock()
            ->featured()
            ->whereNotNull('compare_at_price')
            ->inRandomOrder()
            ->take(4)
            ->get()
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
