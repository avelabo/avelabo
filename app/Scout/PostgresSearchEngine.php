<?php

namespace App\Scout;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\LazyCollection;
use Laravel\Scout\Builder;
use Laravel\Scout\Engines\Engine;

class PostgresSearchEngine extends Engine
{
    /**
     * Update the given model in the index.
     */
    public function update($models): void
    {
        // The search vector is updated by PostgreSQL triggers automatically.
        // This method can be used to manually trigger an update if needed.
        foreach ($models as $model) {
            $this->updateSearchVector($model);
        }
    }

    /**
     * Remove the given model from the index.
     */
    public function delete($models): void
    {
        // Models are soft-deleted or hard-deleted from the database directly.
        // The search vector doesn't need separate cleanup.
    }

    /**
     * Perform the given search on the engine.
     */
    public function search(Builder $builder): mixed
    {
        return $this->performSearch($builder);
    }

    /**
     * Perform the given search on the engine.
     */
    public function paginate(Builder $builder, $perPage, $page): mixed
    {
        return $this->performSearch($builder, [
            'limit' => $perPage,
            'offset' => ($page - 1) * $perPage,
        ]);
    }

    /**
     * Perform the actual search query.
     *
     * @param  array<string, mixed>  $options
     */
    protected function performSearch(Builder $builder, array $options = []): array
    {
        $model = $builder->model;
        $table = $model->getTable();
        $query = $builder->query;

        // Build the base query with PostgreSQL full-text search
        $sql = "SELECT id, ts_rank(search_vector, plainto_tsquery('english', ?)) AS rank
                FROM {$table}
                WHERE search_vector @@ plainto_tsquery('english', ?)";

        $bindings = [$query, $query];

        // Add any additional where clauses from the builder
        if ($builder->wheres) {
            foreach ($builder->wheres as $field => $value) {
                if (is_array($value)) {
                    $placeholders = implode(',', array_fill(0, count($value), '?'));
                    $sql .= " AND {$field} IN ({$placeholders})";
                    $bindings = array_merge($bindings, $value);
                } else {
                    $sql .= " AND {$field} = ?";
                    $bindings[] = $value;
                }
            }
        }

        $sql .= ' ORDER BY rank DESC';

        // Get total count before pagination
        $countSql = "SELECT COUNT(*) as total FROM {$table} WHERE search_vector @@ plainto_tsquery('english', ?)";
        $countBindings = [$query];

        if ($builder->wheres) {
            foreach ($builder->wheres as $field => $value) {
                if (is_array($value)) {
                    $placeholders = implode(',', array_fill(0, count($value), '?'));
                    $countSql .= " AND {$field} IN ({$placeholders})";
                    $countBindings = array_merge($countBindings, $value);
                } else {
                    $countSql .= " AND {$field} = ?";
                    $countBindings[] = $value;
                }
            }
        }

        $total = DB::selectOne($countSql, $countBindings)->total;

        // Apply limit from builder or options
        $limit = $options['limit'] ?? $builder->limit;
        if ($limit) {
            $sql .= ' LIMIT ?';
            $bindings[] = $limit;
        }

        // Apply offset for pagination
        if (isset($options['offset'])) {
            $sql .= ' OFFSET ?';
            $bindings[] = $options['offset'];
        }

        $results = DB::select($sql, $bindings);

        return [
            'results' => $results,
            'total' => $total,
        ];
    }

    /**
     * Pluck and return the primary keys of the given results.
     */
    public function mapIds($results): Collection
    {
        return collect($results['results'])->pluck('id');
    }

    /**
     * Map the given results to instances of the given model.
     */
    public function map(Builder $builder, $results, $model): Collection
    {
        if (empty($results['results'])) {
            return $model->newCollection();
        }

        $ids = collect($results['results'])->pluck('id')->all();
        $ranks = collect($results['results'])->pluck('rank', 'id')->all();

        $models = $model->getScoutModelsByIds($builder, $ids)->keyBy('id');

        // Preserve order by rank
        return $model->newCollection(
            collect($ids)
                ->map(fn ($id) => $models->get($id))
                ->filter()
                ->values()
                ->all()
        );
    }

    /**
     * Map the given results to instances of the given model via a lazy collection.
     */
    public function lazyMap(Builder $builder, $results, $model): LazyCollection
    {
        return LazyCollection::make($this->map($builder, $results, $model)->all());
    }

    /**
     * Get the total count from the raw results.
     */
    public function getTotalCount($results): int
    {
        return $results['total'] ?? 0;
    }

    /**
     * Flush all of the model's records from the engine.
     */
    public function flush($model): void
    {
        // Clear all search vectors for the model
        DB::table($model->getTable())->update(['search_vector' => null]);
    }

    /**
     * Create a search index.
     */
    public function createIndex($name, array $options = []): void
    {
        // Indexes are created via migrations for PostgreSQL FTS
    }

    /**
     * Delete a search index.
     */
    public function deleteIndex($name): void
    {
        // Indexes are managed via migrations for PostgreSQL FTS
    }

    /**
     * Manually update the search vector for a model.
     */
    protected function updateSearchVector($model): void
    {
        $table = $model->getTable();
        $searchableData = $model->toSearchableArray();

        // Build the tsvector update based on model type
        if ($table === 'products') {
            $sql = "UPDATE {$table} SET search_vector =
                    setweight(to_tsvector('english', COALESCE(?, '')), 'A') ||
                    setweight(to_tsvector('english', COALESCE(?, '')), 'B') ||
                    setweight(to_tsvector('english', COALESCE(?, '')), 'C')
                    WHERE id = ?";

            DB::statement($sql, [
                $searchableData['name'] ?? '',
                $searchableData['short_description'] ?? '',
                $searchableData['description'] ?? '',
                $model->getKey(),
            ]);
        } else {
            // For categories and brands
            $sql = "UPDATE {$table} SET search_vector =
                    setweight(to_tsvector('english', COALESCE(?, '')), 'A') ||
                    setweight(to_tsvector('english', COALESCE(?, '')), 'B')
                    WHERE id = ?";

            DB::statement($sql, [
                $searchableData['name'] ?? '',
                $searchableData['description'] ?? '',
                $model->getKey(),
            ]);
        }
    }
}
