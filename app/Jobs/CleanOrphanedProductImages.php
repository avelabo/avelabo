<?php

namespace App\Jobs;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CleanOrphanedProductImages implements ShouldQueue
{
    use Queueable;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 1;

    /**
     * The job timeout in seconds.
     */
    public int $timeout = 600;

    /**
     * Create a new job instance.
     *
     * @param  bool  $force  If true, also delete images for soft-deleted products
     */
    public function __construct(
        public bool $force = false
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $disk = Storage::disk('public');
        $productsDir = 'products';

        if (! $disk->exists($productsDir)) {
            Log::info('CleanOrphanedProductImages: No products directory found');

            return;
        }

        $deletedFiles = 0;
        $deletedDirectories = 0;
        $freedBytes = 0;

        // Get existing product IDs - if force mode, only check non-deleted products
        $existingProductIds = $this->force
            ? Product::pluck('id')->toArray()
            : Product::withTrashed()->pluck('id')->toArray();

        // Get all product image paths from database
        $dbImagePaths = ProductImage::pluck('path')->toArray();

        $mode = $this->force ? 'FORCE' : 'SAFE';
        Log::info("CleanOrphanedProductImages starting in {$mode} mode");

        // Recursively find all product ID directories
        $this->scanDirectory($disk, $productsDir, $existingProductIds, $dbImagePaths, $deletedFiles, $deletedDirectories, $freedBytes);

        $freedMB = round($freedBytes / 1024 / 1024, 2);
        Log::info("CleanOrphanedProductImages completed: {$deletedDirectories} directories, {$deletedFiles} files deleted, {$freedMB}MB freed");
    }

    /**
     * Recursively scan directories for orphaned product folders
     */
    private function scanDirectory(
        $disk,
        string $path,
        array $existingProductIds,
        array $dbImagePaths,
        int &$deletedFiles,
        int &$deletedDirectories,
        int &$freedBytes
    ): void {
        $directories = $disk->directories($path);

        foreach ($directories as $directory) {
            $dirName = basename($directory);

            // Check if this is a numeric directory (product ID)
            if (is_numeric($dirName)) {
                $productId = (int) $dirName;

                // If product doesn't exist, delete entire directory
                if (! in_array($productId, $existingProductIds)) {
                    $files = $disk->allFiles($directory);
                    foreach ($files as $file) {
                        try {
                            $freedBytes += $disk->size($file);
                        } catch (\Exception $e) {
                            // Ignore size errors
                        }
                    }
                    $disk->deleteDirectory($directory);
                    $deletedDirectories++;
                    Log::info("Deleted orphaned product directory: {$directory}");

                    continue;
                }

                // Product exists - check for orphaned files within the directory
                $files = $disk->files($directory);
                foreach ($files as $file) {
                    if (! in_array($file, $dbImagePaths)) {
                        try {
                            $freedBytes += $disk->size($file);
                        } catch (\Exception $e) {
                            // Ignore size errors
                        }
                        $disk->delete($file);
                        $deletedFiles++;
                        Log::info("Deleted orphaned image file: {$file}");
                    }
                }

                // In force mode, delete empty directories after cleaning files
                if ($this->force) {
                    $remainingFiles = $disk->allFiles($directory);
                    if (empty($remainingFiles)) {
                        $disk->deleteDirectory($directory);
                        $deletedDirectories++;
                        Log::info("Deleted empty product directory: {$directory}");
                    }
                }
            } else {
                // Not a numeric directory, recurse into it (e.g., "takealot", "noon")
                $this->scanDirectory($disk, $directory, $existingProductIds, $dbImagePaths, $deletedFiles, $deletedDirectories, $freedBytes);
            }
        }
    }
}
