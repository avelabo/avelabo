<?php

namespace App\Jobs;

use App\Models\ProductImage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DeleteProductImages implements ShouldQueue
{
    use Queueable;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * Create a new job instance.
     *
     * @param  array<int>  $productIds
     */
    public function __construct(
        public array $productIds
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $disk = Storage::disk('public');
        $deletedCount = 0;
        $failedCount = 0;

        foreach ($this->productIds as $productId) {
            try {
                // Get all image paths for this product from database
                $images = ProductImage::withTrashed()
                    ->where('product_id', $productId)
                    ->pluck('path')
                    ->toArray();

                // Find unique directories from the image paths
                $directories = [];
                foreach ($images as $imagePath) {
                    if ($imagePath) {
                        $directory = dirname($imagePath);
                        $directories[$directory] = true;
                    }
                }

                // Delete each directory
                foreach (array_keys($directories) as $directory) {
                    if ($disk->exists($directory)) {
                        $disk->deleteDirectory($directory);
                        $deletedCount++;
                        Log::info("Deleted product image directory: {$directory}");
                    }
                }

                // Also try common patterns in case images aren't in DB
                $patterns = [
                    "products/{$productId}",
                    "products/takealot/{$productId}",
                    "products/noon/{$productId}",
                ];

                foreach ($patterns as $pattern) {
                    if ($disk->exists($pattern)) {
                        $disk->deleteDirectory($pattern);
                        Log::info("Deleted product image directory (pattern): {$pattern}");
                    }
                }
            } catch (\Exception $e) {
                $failedCount++;
                Log::error("Failed to delete images for product {$productId}: ".$e->getMessage());
            }
        }

        Log::info("DeleteProductImages completed: {$deletedCount} directories deleted, {$failedCount} failed for ".count($this->productIds).' products');
    }
}
