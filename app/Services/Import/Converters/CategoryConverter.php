<?php

namespace App\Services\Import\Converters;

use App\Models\Category;
use App\Models\ImportDataSource;
use App\Models\ImportTask;
use Illuminate\Support\Str;

class CategoryConverter
{
    /**
     * Convert external category data to local format and save
     *
     * @return array{category: Category, action: string}
     */
    public function convert(array $data, ImportTask $task, ImportDataSource $dataSource): array
    {
        $sourceId = (string) $data['id'];
        $source = $dataSource->slug;

        // Check if category already exists by source tracking
        $existingCategory = Category::where('source', $source)
            ->where('source_id', $sourceId)
            ->first();

        // Resolve parent category if provided
        $parentId = null;
        if (! empty($data['parent_id'])) {
            $parentCategory = Category::where('source', $source)
                ->where('source_id', (string) $data['parent_id'])
                ->first();
            $parentId = $parentCategory?->id;
        }

        // If target category is set, use it as parent for top-level imports
        if (! $parentId && $task->target_category_id) {
            $parentId = $task->target_category_id;
        }

        $categoryData = [
            'name' => $data['name'],
            'slug' => $this->generateUniqueSlug($data['slug'] ?? $data['name'], $existingCategory?->id),
            'description' => $data['description'] ?? null,
            'parent_id' => $parentId,
            'is_active' => true,
            'is_featured' => false,
            'source' => $source,
            'source_id' => $sourceId,
        ];

        if ($existingCategory) {
            $existingCategory->update($categoryData);

            return [
                'category' => $existingCategory->fresh(),
                'action' => 'updated',
            ];
        }

        $category = Category::create($categoryData);

        return [
            'category' => $category,
            'action' => 'created',
        ];
    }

    protected function generateUniqueSlug(string $name, ?int $excludeId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        $query = Category::where('slug', $slug);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        while ($query->exists()) {
            $slug = $originalSlug.'-'.$counter++;
            $query = Category::where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
        }

        return $slug;
    }
}
