<?php

namespace App\Services;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class SearchService
{
    /**
     * Minimum similarity threshold for fuzzy matching (0.0 to 1.0).
     * Lower = more fuzzy, Higher = stricter matching.
     */
    protected const SIMILARITY_THRESHOLD = 0.3;

    /**
     * Lower threshold for short queries (3 chars or less).
     */
    protected const SHORT_QUERY_THRESHOLD = 0.2;

    /**
     * Perform a unified search across products, categories, and brands.
     * Uses full-text search first, falls back to fuzzy matching if no results.
     *
     * @return array{products: array, categories: array, brands: array, fuzzy: bool}
     */
    public function search(string $query, int $limit = 10): array
    {
        $query = trim($query);

        if (strlen($query) < 2) {
            return [
                'products' => [],
                'categories' => [],
                'brands' => [],
                'fuzzy' => false,
            ];
        }

        // Try full-text search first
        $products = $this->searchProducts($query, $limit);
        $categories = $this->searchCategories($query, min($limit, 5));
        $brands = $this->searchBrands($query, min($limit, 5));

        $hasResults = ! empty($products) || ! empty($categories) || ! empty($brands);

        // If no results from FTS, try fuzzy matching
        if (! $hasResults) {
            $products = $this->fuzzySearchProducts($query, $limit);
            $categories = $this->fuzzySearchCategories($query, min($limit, 5));
            $brands = $this->fuzzySearchBrands($query, min($limit, 5));

            return [
                'products' => $products,
                'categories' => $categories,
                'brands' => $brands,
                'fuzzy' => true,
            ];
        }

        return [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'fuzzy' => false,
        ];
    }

    /**
     * Search for products using PostgreSQL full-text search with prefix matching.
     */
    public function searchProducts(string $query, int $limit = 10): array
    {
        $prefixQuery = $this->buildPrefixQuery($query);

        $results = DB::select("
            SELECT id, name, slug, short_description, base_price,
                   ts_rank(search_vector, to_tsquery('english', ?)) AS rank
            FROM products
            WHERE search_vector @@ to_tsquery('english', ?)
              AND status = 'active'
              AND deleted_at IS NULL
            ORDER BY rank DESC
            LIMIT ?
        ", [$prefixQuery, $prefixQuery, $limit]);

        return $this->formatProductResults($results);
    }

    /**
     * Build a prefix-enabled tsquery string from user input.
     * Converts "jimmy choo" to "jimmy:* & choo:*" for prefix matching.
     */
    protected function buildPrefixQuery(string $query): string
    {
        $words = preg_split('/\s+/', trim($query), -1, PREG_SPLIT_NO_EMPTY);

        $prefixedWords = array_map(function ($word) {
            $word = preg_replace('/[^\w]/', '', $word);

            return $word.':*';
        }, $words);

        return implode(' & ', $prefixedWords);
    }

    /**
     * Fuzzy search for products using trigram similarity and ILIKE prefix.
     */
    public function fuzzySearchProducts(string $query, int $limit = 10): array
    {
        $threshold = $this->getSimilarityThreshold($query);
        $likePattern = $query.'%';

        $results = DB::select("
            SELECT id, name, slug, short_description, base_price,
                   GREATEST(
                       similarity(name, ?),
                       similarity(COALESCE(short_description, ''), ?),
                       CASE WHEN name ILIKE ? THEN 0.9 ELSE 0 END
                   ) AS rank
            FROM products
            WHERE (
                similarity(name, ?) > ?
                OR similarity(COALESCE(short_description, ''), ?) > ?
                OR name ILIKE ?
            )
              AND status = 'active'
              AND deleted_at IS NULL
            ORDER BY rank DESC
            LIMIT ?
        ", [
            $query, $query, $likePattern,
            $query, $threshold,
            $query, $threshold,
            $likePattern,
            $limit,
        ]);

        return $this->formatProductResults($results);
    }

    /**
     * Get similarity threshold based on query length.
     * Shorter queries need lower thresholds to find partial matches.
     */
    protected function getSimilarityThreshold(string $query): float
    {
        return strlen(trim($query)) <= 3
            ? self::SHORT_QUERY_THRESHOLD
            : self::SIMILARITY_THRESHOLD;
    }

    /**
     * Format product search results.
     */
    protected function formatProductResults(array $results): array
    {
        if (empty($results)) {
            return [];
        }

        $ids = array_column($results, 'id');
        $products = Product::query()
            ->whereIn('id', $ids)
            ->with(['images', 'category', 'brand', 'seller', 'currency'])
            ->get()
            ->keyBy('id');

        $formatted = [];
        foreach ($results as $result) {
            $product = $products->get($result->id);
            if ($product) {
                $formatted[] = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'short_description' => $product->short_description,
                    'price' => $product->display_price,
                    'formatted_price' => number_format($product->display_price, 2),
                    'image' => $product->primary_image_url,
                    'category' => $product->category?->name,
                    'brand' => $product->brand?->name,
                    'url' => route('product.detail', $product->slug),
                    'rank' => $result->rank,
                ];
            }
        }

        return $formatted;
    }

    /**
     * Search for categories using PostgreSQL full-text search with prefix matching.
     */
    public function searchCategories(string $query, int $limit = 5): array
    {
        $prefixQuery = $this->buildPrefixQuery($query);

        $results = DB::select("
            SELECT id, name, slug, image,
                   ts_rank(search_vector, to_tsquery('english', ?)) AS rank
            FROM categories
            WHERE search_vector @@ to_tsquery('english', ?)
              AND is_active = true
            ORDER BY rank DESC
            LIMIT ?
        ", [$prefixQuery, $prefixQuery, $limit]);

        return $this->formatCategoryResults($results);
    }

    /**
     * Fuzzy search for categories using trigram similarity and ILIKE prefix.
     */
    public function fuzzySearchCategories(string $query, int $limit = 5): array
    {
        $threshold = $this->getSimilarityThreshold($query);
        $likePattern = $query.'%';

        $results = DB::select('
            SELECT id, name, slug, image,
                   GREATEST(
                       similarity(name, ?),
                       CASE WHEN name ILIKE ? THEN 0.9 ELSE 0 END
                   ) AS rank
            FROM categories
            WHERE (
                similarity(name, ?) > ?
                OR name ILIKE ?
            )
              AND is_active = true
            ORDER BY rank DESC
            LIMIT ?
        ', [$query, $likePattern, $query, $threshold, $likePattern, $limit]);

        return $this->formatCategoryResults($results);
    }

    /**
     * Format category search results.
     */
    protected function formatCategoryResults(array $results): array
    {
        if (empty($results)) {
            return [];
        }

        $ids = array_column($results, 'id');
        $categories = Category::query()
            ->whereIn('id', $ids)
            ->withCount('products')
            ->get()
            ->keyBy('id');

        $formatted = [];
        foreach ($results as $result) {
            $category = $categories->get($result->id);
            if ($category) {
                $formatted[] = [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'image' => $category->image,
                    'products_count' => $category->products_count,
                    'url' => route('shop', ['category' => $category->slug]),
                    'rank' => $result->rank,
                ];
            }
        }

        return $formatted;
    }

    /**
     * Search for brands using PostgreSQL full-text search with prefix matching.
     */
    public function searchBrands(string $query, int $limit = 5): array
    {
        $prefixQuery = $this->buildPrefixQuery($query);

        $results = DB::select("
            SELECT id, name, slug, logo,
                   ts_rank(search_vector, to_tsquery('english', ?)) AS rank
            FROM brands
            WHERE search_vector @@ to_tsquery('english', ?)
              AND is_active = true
            ORDER BY rank DESC
            LIMIT ?
        ", [$prefixQuery, $prefixQuery, $limit]);

        return $this->formatBrandResults($results);
    }

    /**
     * Fuzzy search for brands using trigram similarity and ILIKE prefix.
     */
    public function fuzzySearchBrands(string $query, int $limit = 5): array
    {
        $threshold = $this->getSimilarityThreshold($query);
        $likePattern = $query.'%';

        $results = DB::select('
            SELECT id, name, slug, logo,
                   GREATEST(
                       similarity(name, ?),
                       CASE WHEN name ILIKE ? THEN 0.9 ELSE 0 END
                   ) AS rank
            FROM brands
            WHERE (
                similarity(name, ?) > ?
                OR name ILIKE ?
            )
              AND is_active = true
            ORDER BY rank DESC
            LIMIT ?
        ', [$query, $likePattern, $query, $threshold, $likePattern, $limit]);

        return $this->formatBrandResults($results);
    }

    /**
     * Format brand search results.
     */
    protected function formatBrandResults(array $results): array
    {
        if (empty($results)) {
            return [];
        }

        $ids = array_column($results, 'id');
        $brands = Brand::query()
            ->whereIn('id', $ids)
            ->withCount('products')
            ->get()
            ->keyBy('id');

        $formatted = [];
        foreach ($results as $result) {
            $brand = $brands->get($result->id);
            if ($brand) {
                $formatted[] = [
                    'id' => $brand->id,
                    'name' => $brand->name,
                    'slug' => $brand->slug,
                    'logo' => $brand->logo,
                    'products_count' => $brand->products_count,
                    'url' => route('shop.brand', ['slug' => $brand->slug]),
                    'rank' => $result->rank,
                ];
            }
        }

        return $formatted;
    }

    /**
     * Check if a search query has any results.
     */
    public function hasResults(string $query): bool
    {
        if (strlen(trim($query)) < 2) {
            return false;
        }

        $prefixQuery = $this->buildPrefixQuery($query);

        $productCount = DB::selectOne("
            SELECT COUNT(*) as count FROM products
            WHERE search_vector @@ to_tsquery('english', ?)
              AND status = 'active' AND deleted_at IS NULL
        ", [$prefixQuery])->count;

        if ($productCount > 0) {
            return true;
        }

        $categoryCount = DB::selectOne("
            SELECT COUNT(*) as count FROM categories
            WHERE search_vector @@ to_tsquery('english', ?)
              AND is_active = true
        ", [$prefixQuery])->count;

        if ($categoryCount > 0) {
            return true;
        }

        $brandCount = DB::selectOne("
            SELECT COUNT(*) as count FROM brands
            WHERE search_vector @@ to_tsquery('english', ?)
              AND is_active = true
        ", [$prefixQuery])->count;

        return $brandCount > 0;
    }
}
