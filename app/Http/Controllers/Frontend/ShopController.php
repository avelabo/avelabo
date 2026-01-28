<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Services\DiscountService;
use App\Services\PriceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function __construct(
        protected PriceService $priceService
    ) {}

    /**
     * Display the shop page with product listings
     */
    public function index(Request $request, ?string $slug = null)
    {
        // If accessed via /brand/{slug} route, merge slug into request as brand filter
        if ($slug !== null && ! $request->filled('brand')) {
            $request->merge(['brand' => $slug]);
        }

        $query = Product::with(['category:id,name,slug', 'seller:id,shop_name,display_name', 'images'])
            ->active()
            ->inStock();

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $category = Category::where('slug', $request->category)->first();
            if ($category) {
                // Include subcategory products
                $categoryIds = collect([$category->id]);
                $childIds = $category->children()->pluck('id');
                $categoryIds = $categoryIds->merge($childIds);
                $query->whereIn('category_id', $categoryIds);
            }
        }

        // Brand filter (accepts slug or ID)
        if ($request->filled('brand')) {
            $brandQuery = Brand::where('slug', $request->brand);
            if (is_numeric($request->brand)) {
                $brandQuery->orWhere('id', $request->brand);
            }
            $brand = $brandQuery->first();
            if ($brand) {
                $query->where('brand_id', $brand->id);
            }
        }

        // Seller filter
        if ($request->filled('seller')) {
            $query->where('seller_id', $request->seller);
        }

        // Price range filter using display price (base_price + seller markup)
        $displayPriceSql = 'products.base_price + COALESCE((
            SELECT spm.markup_amount FROM seller_price_markups spm
            WHERE spm.seller_id = products.seller_id
              AND spm.is_active = true
              AND products.base_price >= spm.min_price
              AND products.base_price <= spm.max_price
            LIMIT 1
        ), 0)';

        if ($request->filled('min_price')) {
            $query->whereRaw("({$displayPriceSql}) >= ?", [$request->min_price]);
        }
        if ($request->filled('max_price')) {
            $query->whereRaw("({$displayPriceSql}) <= ?", [$request->max_price]);
        }

        // Featured filter
        if ($request->boolean('featured')) {
            $query->featured();
        }

        // On sale filter (via active promotions)
        if ($request->boolean('on_sale')) {
            $discountService = app(DiscountService::class);
            $allProducts = Product::active()->inStock()->get();
            $onSaleIds = $discountService->getProductIdsWithActivePromotions($allProducts);
            $query->whereIn('id', $onSaleIds);
        }

        // Sorting
        $sortBy = $request->get('sort', 'featured');
        switch ($sortBy) {
            case 'price_low':
                $query->orderByRaw("({$displayPriceSql}) ASC");
                break;
            case 'price_high':
                $query->orderByRaw("({$displayPriceSql}) DESC");
                break;
            case 'newest':
                $query->latest();
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'popular':
                $query->orderBy('sales_count', 'desc');
                break;
            case 'featured':
            default:
                $query->orderBy('is_featured', 'desc')->latest();
                break;
        }

        $perPage = min($request->get('per_page', 12), 48);
        $products = $query->paginate($perPage)->withQueryString();

        // Transform products for card display
        $products->through(fn ($product) => $product->toCardArray());

        // Get categories for sidebar with active product counts
        $categories = Category::with(['children' => function ($query) {
            $query->active()->ordered();
        }])
            ->whereNull('parent_id')
            ->active()
            ->ordered()
            ->get()
            ->map(function ($category) {
                // Count active, in-stock products for this category
                $productCount = Product::where('category_id', $category->id)
                    ->active()
                    ->inStock()
                    ->count();

                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'icon' => $category->icon,
                    'products_count' => $productCount,
                    'children' => $category->children->map(function ($child) {
                        $childProductCount = Product::where('category_id', $child->id)
                            ->active()
                            ->inStock()
                            ->count();

                        return [
                            'id' => $child->id,
                            'name' => $child->name,
                            'slug' => $child->slug,
                            'products_count' => $childProductCount,
                        ];
                    }),
                ];
            });

        // Get brands for filter
        $brands = Brand::active()
            ->withCount(['products' => function ($query) {
                $query->active()->inStock();
            }])
            ->orderBy('name')
            ->get(['id', 'name', 'slug'])
            ->filter(fn ($brand) => $brand->products_count > 0)
            ->values();

        // Get price range (using display price = base_price + markup)
        $displayPriceExpr = 'products.base_price + COALESCE((
            SELECT spm.markup_amount FROM seller_price_markups spm
            WHERE spm.seller_id = products.seller_id
              AND spm.is_active = true
              AND products.base_price >= spm.min_price
              AND products.base_price <= spm.max_price
            LIMIT 1
        ), 0)';
        $priceRange = [
            'min' => Product::active()->inStock()->selectRaw("MIN({$displayPriceExpr}) as min_price")->value('min_price') ?? 0,
            'max' => Product::active()->inStock()->selectRaw("MAX({$displayPriceExpr}) as max_price")->value('max_price') ?? 10000,
        ];

        // Featured/Deal products for sidebar
        $featuredProducts = Product::with(['images'])
            ->active()
            ->inStock()
            ->featured()
            ->take(3)
            ->get()
            ->map->toCardArray();

        // Current category info
        $currentCategory = null;
        if ($request->filled('category')) {
            $cat = Category::where('slug', $request->category)->first();
            if ($cat) {
                $currentCategory = [
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'slug' => $cat->slug,
                    'breadcrumb' => collect($cat->getBreadcrumb())->map(fn ($c) => [
                        'id' => $c->id,
                        'name' => $c->name,
                        'slug' => $c->slug,
                    ]),
                ];
            }
        }

        // Current brand info (reuse $brand from filter above)
        $currentBrand = null;
        if (isset($brand) && $brand) {
            $currentBrand = [
                'id' => $brand->id,
                'name' => $brand->name,
                'slug' => $brand->slug,
                'logo' => $brand->logo,
                'description' => $brand->description,
            ];
        }

        return Inertia::render('Frontend/Shop', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'priceRange' => $priceRange,
            'featuredProducts' => $featuredProducts,
            'currentCategory' => $currentCategory,
            'currentBrand' => $currentBrand,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'brand' => $request->brand,
                'seller' => $request->seller,
                'min_price' => $request->min_price,
                'max_price' => $request->max_price,
                'sort' => $sortBy,
                'featured' => $request->boolean('featured'),
                'on_sale' => $request->boolean('on_sale'),
            ],
        ]);
    }

    /**
     * Display a single product
     */
    public function show(string $slug)
    {
        $product = Product::with([
            'category',
            'brand',
            'seller:id,slug,shop_name,display_name,description,logo,show_seller_name,has_storefront',
            'images',
            'variants.attributes.attribute',
            'variants.attributes.attributeValue',
            'reviews' => function ($query) {
                $query->with('user:id,name')->latest()->take(5);
            },
        ])
            ->where('slug', $slug)
            ->active()
            ->firstOrFail();

        // Get price data
        $priceData = $this->priceService->getPrice($product);
        $discount = $this->priceService->getPriceWithDiscount($product);

        // Transform product data
        $productData = [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'short_description' => $product->short_description,
            'specifications' => $product->specifications,
            'price' => $priceData,
            'compare_price' => $discount['has_discount'] ? $discount['original_price'] : null,
            'is_on_sale' => $discount['has_discount'],
            'discount_percentage' => $discount['discount_percentage'],
            'is_featured' => $product->is_featured,
            'is_new' => $product->is_new,
            'rating' => $product->rating,
            'reviews_count' => $product->reviews_count,
            'stock_quantity' => $product->stock_quantity,
            'is_in_stock' => $product->isInStock(),
            'is_low_stock' => $product->isLowStock(),
            'sku' => $product->sku,
            'images' => $product->images->map(fn ($img) => [
                'id' => $img->id,
                'url' => $img->url,
                'alt' => $img->alt_text,
                'is_primary' => $img->is_primary,
            ]),
            'category' => $product->category ? [
                'id' => $product->category->id,
                'name' => $product->category->name,
                'slug' => $product->category->slug,
                'breadcrumb' => collect($product->category->getBreadcrumb())->map(fn ($c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                    'slug' => $c->slug,
                ]),
            ] : null,
            'brand' => $product->brand ? [
                'id' => $product->brand->id,
                'name' => $product->brand->name,
                'slug' => $product->brand->slug,
            ] : null,
            'seller' => $product->seller ? [
                'id' => $product->seller->id,
                'name' => $product->seller->public_name,
                'slug' => $product->seller->slug,
                'description' => $product->seller->show_seller_name ? $product->seller->description : null,
                'logo' => $product->seller->show_seller_name ? $product->seller->logo : null,
                'has_storefront' => $product->seller->has_storefront,
                'show_seller_name' => $product->seller->show_seller_name,
            ] : null,
            'variants' => $product->variants->map(function ($variant) {
                return [
                    'id' => $variant->id,
                    'sku' => $variant->sku,
                    'price' => $this->priceService->getVariantPrice($variant),
                    'stock_quantity' => $variant->stock_quantity,
                    'is_in_stock' => $variant->stock_quantity > 0 || $variant->product->allow_backorders,
                    'image' => $variant->image,
                    'attributes' => $variant->attributes->map(fn ($attr) => [
                        'name' => $attr->attribute->name,
                        'value' => $attr->attributeValue->value,
                        'color_code' => $attr->attributeValue->color_code,
                    ]),
                ];
            }),
            'reviews' => $product->reviews->map(fn ($review) => [
                'id' => $review->id,
                'rating' => $review->rating,
                'title' => $review->title,
                'comment' => $review->comment,
                'user_name' => $review->user?->name ?? 'Anonymous',
                'created_at' => $review->created_at->diffForHumans(),
            ]),
        ];

        // Related products (same category)
        $relatedProducts = Product::with(['images'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->active()
            ->inStock()
            ->take(4)
            ->get()
            ->map->toCardArray();

        // Increment view count
        $product->increment('views_count');

        return Inertia::render('Frontend/ProductDetail', [
            'product' => $productData,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
