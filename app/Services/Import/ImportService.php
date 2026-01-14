<?php

namespace App\Services\Import;

use App\Models\ImportDataSource;
use App\Models\ImportTask;
use App\Models\ImportTaskRun;
use App\Services\Import\Converters\CategoryConverter;
use App\Services\Import\Converters\ProductConverter;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ImportService
{
    public function __construct(
        protected CategoryConverter $categoryConverter,
        protected ProductConverter $productConverter
    ) {}

    public function execute(ImportTask $task, ImportTaskRun $run): void
    {
        $run->markAsRunning();
        $task->update(['last_run_at' => now()]);

        try {
            if ($task->isForCategories()) {
                $this->importCategories($task, $run);
            } else {
                $this->importProducts($task, $run);
            }

            $run->markAsCompleted();
        } catch (\Exception $e) {
            Log::error('Import task failed', [
                'task_id' => $task->id,
                'run_id' => $run->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            $run->markAsFailed($e->getMessage());
            throw $e;
        }
    }

    protected function importCategories(ImportTask $task, ImportTaskRun $run): void
    {
        $dataSource = $task->dataSource;
        $url = $dataSource->getCategoryListingFullUrl();

        $response = $this->fetchFromSource($dataSource, $url);

        if (! $response->successful()) {
            throw new \Exception('Failed to fetch categories: '.$response->status());
        }

        $data = $response->json();
        $categories = $data['categories'] ?? [];

        // If a specific source category is selected, filter to only that category and its children
        if ($task->source_category_id) {
            $categories = $this->filterCategoryTree($categories, $task->source_category_id);
        }

        $run->update(['total_items' => count($categories)]);

        foreach ($categories as $categoryData) {
            try {
                $result = $this->categoryConverter->convert($categoryData, $task, $dataSource);

                $run->increment('processed_items');
                $run->increment($result['action'] === 'created' ? 'created_items' : 'updated_items');

                $run->items()->create([
                    'source_id' => (string) $categoryData['id'],
                    'source_data' => $categoryData,
                    'item_type' => 'category',
                    'local_id' => $result['category']->id,
                    'status' => $result['action'],
                ]);
            } catch (\Exception $e) {
                $run->increment('processed_items');
                $run->increment('failed_items');

                $run->items()->create([
                    'source_id' => (string) ($categoryData['id'] ?? 'unknown'),
                    'source_data' => $categoryData,
                    'item_type' => 'category',
                    'status' => 'failed',
                    'error_message' => $e->getMessage(),
                ]);

                Log::warning('Failed to import category', [
                    'source_id' => $categoryData['id'] ?? 'unknown',
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }

    /**
     * Filter categories to only include the specified category and its descendants
     */
    protected function filterCategoryTree(array $categories, int $targetId): array
    {
        $result = [];
        $targetFound = false;

        foreach ($categories as $category) {
            if ((int) $category['id'] === $targetId) {
                $result[] = $category;
                $targetFound = true;
            } elseif (isset($category['parent_id']) && (int) $category['parent_id'] === $targetId) {
                // Include children of the target
                $result[] = $category;
            }
        }

        // If we found the target, also include all its descendants
        if ($targetFound) {
            $idsToInclude = array_column($result, 'id');
            $changed = true;

            while ($changed) {
                $changed = false;
                foreach ($categories as $category) {
                    if (isset($category['parent_id']) && in_array($category['parent_id'], $idsToInclude) && ! in_array($category['id'], $idsToInclude)) {
                        $result[] = $category;
                        $idsToInclude[] = $category['id'];
                        $changed = true;
                    }
                }
            }
        }

        return $result;
    }

    protected function importProducts(ImportTask $task, ImportTaskRun $run): void
    {
        $dataSource = $task->dataSource;

        // Check if we're importing from all categories or a specific one
        $isAllCategories = ! $task->source_category_id && $task->source_category_name === 'All Categories';

        if ($isAllCategories) {
            $this->importProductsFromAllCategories($task, $run, $dataSource);
        } else {
            if (! $task->source_category_id) {
                throw new \Exception('No source category selected for product import.');
            }
            $this->importProductsFromCategory($task, $run, $dataSource, $task->source_category_id);
        }
    }

    /**
     * Import products from all available categories
     */
    protected function importProductsFromAllCategories(ImportTask $task, ImportTaskRun $run, ImportDataSource $dataSource): void
    {
        // First, fetch all categories
        $url = $dataSource->getCategoryListingFullUrl();
        $response = $this->fetchFromSource($dataSource, $url);

        if (! $response->successful()) {
            throw new \Exception('Failed to fetch categories for product import: '.$response->status());
        }

        $data = $response->json();
        $categories = $data['categories'] ?? [];

        if (empty($categories)) {
            throw new \Exception('No categories found in data source.');
        }

        // Log that we're importing from all categories
        Log::info('Starting product import from all categories', [
            'task_id' => $task->id,
            'run_id' => $run->id,
            'category_count' => count($categories),
        ]);

        // Import products from each category
        foreach ($categories as $category) {
            try {
                $this->importProductsFromCategory($task, $run, $dataSource, (int) $category['id'], $category['name'] ?? null);
            } catch (\Exception $e) {
                // Log the error but continue with other categories
                Log::warning('Failed to import products from category', [
                    'task_id' => $task->id,
                    'category_id' => $category['id'],
                    'category_name' => $category['name'] ?? 'unknown',
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }

    /**
     * Import products from a specific category
     */
    protected function importProductsFromCategory(ImportTask $task, ImportTaskRun $run, ImportDataSource $dataSource, int $categoryId, ?string $categoryName = null): void
    {
        $page = 1;
        $hasMorePages = true;

        Log::info('Importing products from category', [
            'task_id' => $task->id,
            'category_id' => $categoryId,
            'category_name' => $categoryName,
        ]);

        while ($hasMorePages) {
            $url = $dataSource->getProductsByCategoryUrl($categoryId);
            $url .= (str_contains($url, '?') ? '&' : '?').'page='.$page;

            $response = $this->fetchFromSource($dataSource, $url);

            if (! $response->successful()) {
                throw new \Exception("Failed to fetch products from category {$categoryId}: ".$response->status());
            }

            $data = $response->json();
            $products = $data['products']['data'] ?? $data['data'] ?? [];
            $lastPage = $data['products']['last_page'] ?? $data['last_page'] ?? 1;

            if ($page === 1) {
                $totalItems = $data['products']['total'] ?? $data['total'] ?? count($products);
                // Increment the total items (since we might be importing from multiple categories)
                $run->increment('total_items', $totalItems);
            }

            foreach ($products as $productData) {
                try {
                    $result = $this->productConverter->convert($productData, $task, $dataSource);

                    $run->increment('processed_items');
                    $run->increment($result['action'] === 'created' ? 'created_items' : 'updated_items');

                    $run->items()->create([
                        'source_id' => (string) $productData['id'],
                        'source_data' => $productData,
                        'item_type' => 'product',
                        'local_id' => $result['product']->id,
                        'status' => $result['action'],
                    ]);

                    // Log related items (brand, images, variants)
                    if (isset($result['brand']) && $result['brand_action']) {
                        $run->items()->create([
                            'source_id' => (string) ($productData['brand']['slug'] ?? 'unknown'),
                            'source_data' => $productData['brand'] ?? [],
                            'item_type' => 'brand',
                            'local_id' => $result['brand']->id,
                            'status' => $result['brand_action'],
                        ]);
                    }
                } catch (\Exception $e) {
                    $run->increment('processed_items');
                    $run->increment('failed_items');

                    $run->items()->create([
                        'source_id' => (string) ($productData['id'] ?? 'unknown'),
                        'source_data' => $productData,
                        'item_type' => 'product',
                        'status' => 'failed',
                        'error_message' => $e->getMessage(),
                    ]);

                    Log::warning('Failed to import product', [
                        'source_id' => $productData['id'] ?? 'unknown',
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            $hasMorePages = $page < $lastPage;
            $page++;
        }
    }

    protected function fetchFromSource(ImportDataSource $dataSource, string $url): \Illuminate\Http\Client\Response
    {
        $headers = [];

        if ($dataSource->auth_type === 'bearer_token' && isset($dataSource->auth_credentials['bearer_token'])) {
            $headers['Authorization'] = 'Bearer '.$dataSource->auth_credentials['bearer_token'];
        } elseif ($dataSource->auth_type === 'api_key' && isset($dataSource->auth_credentials['api_key'])) {
            $headers['X-API-Key'] = $dataSource->auth_credentials['api_key'];
        }

        return Http::withHeaders($headers)
            ->timeout(60)
            ->get($url);
    }
}
