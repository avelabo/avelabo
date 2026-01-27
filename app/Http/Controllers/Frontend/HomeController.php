<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\Slider;
use App\Services\DiscountService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __construct(
        protected DiscountService $discountService
    ) {}
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
            ->map(fn($product) => $this->transformProduct($product));

        // Popular products (most viewed or sold)
        $popularProducts = Product::with(['category:id,name,slug', 'images'])
            ->active()
            ->inStock()
            ->orderBy('views_count', 'desc')
            ->take(10)
            ->get()
            ->map(fn($product) => $this->transformProduct($product));

        // New arrivals
        $newProducts = Product::with(['category:id,name,slug', 'images'])
            ->active()
            ->inStock()
            ->latest()
            ->take(10)
            ->get()
            ->map(fn($product) => $this->transformProduct($product));

        // On sale products (products with active promotions)
        $saleProducts = Product::with(['category:id,name,slug', 'images'])
            ->active()
            ->inStock()
            ->where(function ($q) {
                if (Promotion::active()->exists()) {
                    $q->whereHas('seller', fn ($sq) => $sq->whereHas('promotions', fn ($pq) => $pq->active()->where('scope_type', 'all')))
                        ->orWhereHas('category', fn ($cq) => $cq->whereExists(fn ($eq) => $eq->from('promotions')->whereColumn('promotions.scope_id', 'categories.id')->where('promotions.scope_type', 'category')->where('promotions.is_active', true)->where('promotions.start_date', '<=', now())->where('promotions.end_date', '>=', now())))
                        ->orWhereHas('brand', fn ($bq) => $bq->whereExists(fn ($eq) => $eq->from('promotions')->whereColumn('promotions.scope_id', 'brands.id')->where('promotions.scope_type', 'brand')->where('promotions.is_active', true)->where('promotions.start_date', '<=', now())->where('promotions.end_date', '>=', now())))
                        ->orWhereHas('tags', fn ($tq) => $tq->whereExists(fn ($eq) => $eq->from('promotions')->whereColumn('promotions.scope_id', 'tags.id')->where('promotions.scope_type', 'tag')->where('promotions.is_active', true)->where('promotions.start_date', '<=', now())->where('promotions.end_date', '>=', now())));
                }
            })
            ->orderBy('views_count', 'desc')
            ->take(10)
            ->get()
            ->map(fn($product) => $this->transformProduct($product));

        // Featured categories with product count
        $categories = Category::with(['children' => function ($query) {
                $query->active()->ordered()->take(6);
            }])
            ->withCount(['products' => function ($query) {
                $query->active()->inStock();
            }])
            ->whereNull('parent_id')
            ->active()
            ->ordered()
            ->take(10)
            ->get()
            ->map(fn($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'icon' => $category->icon,
                'image' => $category->image,
                'products_count' => $category->products_count,
                'children' => $category->children->map(fn($child) => [
                    'id' => $child->id,
                    'name' => $child->name,
                    'slug' => $child->slug,
                ]),
            ]);

        // Best selling products
        $bestSellers = Product::with(['category:id,name,slug', 'images'])
            ->active()
            ->inStock()
            ->orderBy('sales_count', 'desc')
            ->take(6)
            ->get()
            ->map(fn($product) => $this->transformProduct($product));

        // Daily deals (random featured products with active promotions)
        $dailyDeals = Product::with(['category:id,name,slug', 'images'])
            ->active()
            ->inStock()
            ->featured()
            ->inRandomOrder()
            ->take(4)
            ->get()
            ->map(fn($product) => $this->transformProduct($product, true));

        return Inertia::render('Frontend/Home', [
            'sliders' => $sliders,
            'featuredProducts' => $featuredProducts,
            'popularProducts' => $popularProducts,
            'newProducts' => $newProducts,
            'saleProducts' => $saleProducts,
            'categories' => $categories,
            'bestSellers' => $bestSellers,
            'dailyDeals' => $dailyDeals,
        ]);
    }

    /**
     * Transform product data for frontend display
     */
    protected function transformProduct(Product $product, bool $includeDeadline = false): array
    {
        $discount = $this->discountService->getProductDiscount($product, $product->display_price);

        $data = [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'short_description' => $product->short_description,
            'price' => $discount['discounted_price'],
            'original_price' => $discount['has_discount'] ? $discount['original_price'] : null,
            'has_discount' => $discount['has_discount'],
            'discount_percentage' => $discount['discount_percentage'],
            'promotion_name' => $discount['promotion_name'],
            'is_featured' => $product->is_featured,
            'is_new' => $product->is_new,
            'rating' => $product->rating ?? 0,
            'reviews_count' => $product->reviews_count ?? 0,
            'is_in_stock' => $product->isInStock(),
            'primary_image' => $product->primary_image_url,
            'category' => $product->category ? [
                'id' => $product->category->id,
                'name' => $product->category->name,
                'slug' => $product->category->slug,
            ] : null,
        ];

        // Add deadline for daily deals
        if ($includeDeadline && $product->sale_ends_at) {
            $data['sale_ends_at'] = $product->sale_ends_at->toIso8601String();
        }

        return $data;
    }
}
