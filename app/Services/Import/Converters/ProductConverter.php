<?php

namespace App\Services\Import\Converters;

use App\Models\Brand;
use App\Models\ImportDataSource;
use App\Models\ImportTask;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductConverter
{
    /**
     * Convert external product data to local format and save
     *
     * @return array{product: Product, action: string, brand: ?Brand, brand_action: ?string}
     */
    public function convert(array $data, ImportTask $task, ImportDataSource $dataSource): array
    {
        $sourceId = (string) $data['id'];
        $source = $data['source'] ?? $dataSource->slug;

        // Check if product already exists by source tracking
        $existingProduct = Product::where('source', $source)
            ->where('source_id', $sourceId)
            ->first();

        return DB::transaction(function () use ($data, $task, $dataSource, $source, $sourceId, $existingProduct) {
            // Handle brand
            $brandResult = $this->handleBrand($data['brand'] ?? null);

            // Determine currency
            $currencyId = $dataSource->default_currency_id ?? 1;

            // Determine stock status and backorder setting
            $stockStatus = $data['stock_status'] ?? 'in_stock';
            $allowBackorders = $stockStatus === 'in_stock';

            // Prepare product data
            $productData = [
                'seller_id' => $task->seller_id,
                'category_id' => $task->target_category_id,
                'brand_id' => $brandResult['brand']?->id,
                'name' => $data['name'],
                'slug' => $this->generateUniqueSlug($data['slug'] ?? $data['name'], $existingProduct?->id),
                'description' => $data['description'] ?? null,
                'short_description' => $data['short_description'] ?? null,
                'specifications' => is_array($data['specifications'] ?? null) ? json_encode($data['specifications']) : ($data['specifications'] ?? null),
                'base_price' => (float) ($data['base_price'] ?? 0),
                'compare_at_price' => ! empty($data['compare_at_price']) ? (float) $data['compare_at_price'] : null,
                'currency_id' => $currencyId,
                'stock_quantity' => $stockStatus === 'in_stock' ? 100 : 0,
                'allow_backorders' => $allowBackorders,
                'status' => 'draft',
                'is_featured' => $data['is_featured'] ?? false,
                'is_new' => $data['is_new'] ?? true,
                'rating' => (float) ($data['rating'] ?? 0),
                'reviews_count' => (int) ($data['reviews_count'] ?? 0),
                'source' => $source,
                'source_id' => $sourceId,
                'source_url' => $data['source_url'] ?? null,
            ];

            // Get the base URL for resolving relative image paths
            $baseUrl = $dataSource->base_url;

            if ($existingProduct) {
                $existingProduct->update($productData);
                $product = $existingProduct->fresh();
                $action = 'updated';

                // Update images and variants
                $this->syncImages($product, $data['images'] ?? [], $source, $baseUrl);
                $this->syncVariants($product, $data['variants'] ?? []);
            } else {
                $product = Product::create($productData);
                $action = 'created';

                // Create images and variants
                $this->createImages($product, $data['images'] ?? [], $source, $baseUrl);
                $this->createVariants($product, $data['variants'] ?? []);
            }

            return [
                'product' => $product,
                'action' => $action,
                'brand' => $brandResult['brand'],
                'brand_action' => $brandResult['action'],
            ];
        });
    }

    /**
     * @return array{brand: ?Brand, action: ?string}
     */
    protected function handleBrand(?array $brandData): array
    {
        if (! $brandData || empty($brandData['name'])) {
            return ['brand' => null, 'action' => null];
        }

        $slug = Str::slug($brandData['slug'] ?? $brandData['name']);

        $existingBrand = Brand::where('slug', $slug)->first();

        if ($existingBrand) {
            return ['brand' => $existingBrand, 'action' => 'updated'];
        }

        $brand = Brand::create([
            'name' => $brandData['name'],
            'slug' => $slug,
            'is_active' => true,
        ]);

        return ['brand' => $brand, 'action' => 'created'];
    }

    protected function createImages(Product $product, array $images, string $source, ?string $baseUrl = null): void
    {
        foreach ($images as $index => $imageData) {
            $path = $this->downloadImage($imageData['path'] ?? $imageData['url'] ?? null, $product, $source, $baseUrl);

            if ($path) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => $path,
                    'alt_text' => $imageData['alt_text'] ?? $product->name,
                    'sort_order' => $imageData['sort_order'] ?? $index,
                    'is_primary' => $imageData['is_primary'] ?? ($index === 0),
                ]);
            }
        }
    }

    protected function syncImages(Product $product, array $images, string $source, ?string $baseUrl = null): void
    {
        // Delete existing images
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->path);
        }
        $product->images()->delete();

        // Create new images
        $this->createImages($product, $images, $source, $baseUrl);
    }

    protected function downloadImage(?string $imagePath, Product $product, string $source, ?string $baseUrl = null): ?string
    {
        if (! $imagePath) {
            return null;
        }

        try {
            // If the path is a relative URL (starts with /), prepend the base URL
            if (! str_starts_with($imagePath, 'http') && str_starts_with($imagePath, '/') && $baseUrl) {
                $imagePath = rtrim($baseUrl, '/').$imagePath;
            } elseif (! str_starts_with($imagePath, 'http') && $baseUrl) {
                $imagePath = rtrim($baseUrl ?? '', '/').'/'.ltrim($imagePath, '/');
            } else {
                // If it's still not an absolute URL, we can't download it
                \Log::warning('No base URL provided', [
                    'image_path' => $imagePath,
                    'product_id' => $product->id,
                ]);

                return null;
            }

            // If it's still not an absolute URL, we can't download it
            // if (! str_starts_with($imagePath, 'http')) {
            //     \Log::warning('Cannot download image: not an absolute URL or no base URL provided', [
            //         'image_path' => $imagePath,
            //         'product_id' => $product->id,
            //     ]);

            //     return null;
            // }

            // Download the image
            $response = Http::timeout(30)->get($imagePath);

            if (! $response->successful()) {
                return null;
            }

            // Determine file extension from URL or content type
            $extension = pathinfo(parse_url($imagePath, PHP_URL_PATH), PATHINFO_EXTENSION);
            if (empty($extension) || ! in_array($extension, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
                $contentType = $response->header('Content-Type');
                $extension = match (true) {
                    str_contains($contentType, 'jpeg'), str_contains($contentType, 'jpg') => 'jpg',
                    str_contains($contentType, 'png') => 'png',
                    str_contains($contentType, 'webp') => 'webp',
                    str_contains($contentType, 'gif') => 'gif',
                    default => 'jpg',
                };
            }

            // Generate unique filename
            $filename = Str::uuid().'.'.$extension;
            $path = "products/{$source}/{$product->id}/{$filename}";

            // Store the image
            Storage::disk('public')->put($path, $response->body());

            return $path;
        } catch (\Exception $e) {
            // Log error but don't fail the import
            \Log::warning('Failed to download product image', [
                'url' => $imagePath,
                'product_id' => $product->id,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    protected function createVariants(Product $product, array $variants): void
    {
        foreach ($variants as $variantData) {
            $stockStatus = $variantData['stock_status'] ?? 'in_stock';
            $stockQuantity = $stockStatus === 'in_stock' ? 100 : 0;

            ProductVariant::create([
                'product_id' => $product->id,
                'name' => $variantData['name'] ?? 'Default',
                'sku' => $variantData['sku'] ?? null,
                'price' => (float) ($variantData['price'] ?? $product->base_price),
                'compare_at_price' => ! empty($variantData['list_price']) ? (float) $variantData['list_price'] : null,
                'stock_quantity' => $stockQuantity,
                'is_active' => true,
            ]);
        }

        // If no variants provided, create a default one
        if (empty($variants)) {
            ProductVariant::create([
                'product_id' => $product->id,
                'name' => 'Default',
                'price' => $product->base_price,
                'stock_quantity' => 100,
                'is_active' => true,
            ]);
        }
    }

    protected function syncVariants(Product $product, array $variants): void
    {
        $product->variants()->delete();
        $this->createVariants($product, $variants);
    }

    protected function generateUniqueSlug(string $name, ?int $excludeId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        $query = Product::where('slug', $slug);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        while ($query->exists()) {
            $slug = $originalSlug.'-'.$counter++;
            $query = Product::where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
        }

        return $slug;
    }
}
