<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PopulateSearchVectors extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'search:populate {--table= : Specific table to populate (products, categories, or brands)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate search vectors for existing products, categories, and brands';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $table = $this->option('table');

        if ($table && ! in_array($table, ['products', 'categories', 'brands'])) {
            $this->error('Invalid table. Must be one of: products, categories, brands');

            return self::FAILURE;
        }

        $tables = $table ? [$table] : ['products', 'categories', 'brands'];

        foreach ($tables as $tableName) {
            $this->populateTable($tableName);
        }

        $this->newLine();
        $this->info('Search vectors populated successfully!');

        return self::SUCCESS;
    }

    /**
     * Populate search vectors for a specific table.
     */
    protected function populateTable(string $table): void
    {
        $this->info("Populating search vectors for {$table}...");

        $count = DB::table($table)->count();

        if ($count === 0) {
            $this->warn("No records found in {$table}");

            return;
        }

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        // Update in chunks to avoid memory issues
        DB::table($table)
            ->orderBy('id')
            ->chunk(100, function ($records) use ($table, $bar) {
                foreach ($records as $record) {
                    $this->updateSearchVector($table, $record);
                    $bar->advance();
                }
            });

        $bar->finish();
        $this->newLine();
        $this->info("Populated {$count} records in {$table}");
    }

    /**
     * Update the search vector for a single record.
     */
    protected function updateSearchVector(string $table, object $record): void
    {
        if ($table === 'products') {
            DB::statement("
                UPDATE products SET search_vector =
                    setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
                    setweight(to_tsvector('english', COALESCE(short_description, '')), 'B') ||
                    setweight(to_tsvector('english', COALESCE(description, '')), 'C')
                WHERE id = ?
            ", [$record->id]);
        } else {
            // Categories and brands have the same structure
            DB::statement("
                UPDATE {$table} SET search_vector =
                    setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
                    setweight(to_tsvector('english', COALESCE(description, '')), 'B')
                WHERE id = ?
            ", [$record->id]);
        }
    }
}
