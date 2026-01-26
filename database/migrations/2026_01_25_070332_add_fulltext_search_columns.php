<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add search_vector column and GIN index to products table
        DB::statement('ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector');
        DB::statement('CREATE INDEX IF NOT EXISTS products_search_vector_idx ON products USING GIN(search_vector)');

        // Create trigger function for products
        DB::statement("
            CREATE OR REPLACE FUNCTION products_search_vector_update() RETURNS trigger AS $$
            BEGIN
                NEW.search_vector :=
                    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
                    setweight(to_tsvector('english', COALESCE(NEW.short_description, '')), 'B') ||
                    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C');
                RETURN NEW;
            END
            $$ LANGUAGE plpgsql;
        ");

        // Create trigger for products
        DB::statement('DROP TRIGGER IF EXISTS products_search_vector_trigger ON products');
        DB::statement('
            CREATE TRIGGER products_search_vector_trigger
            BEFORE INSERT OR UPDATE OF name, short_description, description
            ON products
            FOR EACH ROW
            EXECUTE FUNCTION products_search_vector_update();
        ');

        // Add search_vector column and GIN index to categories table
        DB::statement('ALTER TABLE categories ADD COLUMN IF NOT EXISTS search_vector tsvector');
        DB::statement('CREATE INDEX IF NOT EXISTS categories_search_vector_idx ON categories USING GIN(search_vector)');

        // Create trigger function for categories
        DB::statement("
            CREATE OR REPLACE FUNCTION categories_search_vector_update() RETURNS trigger AS $$
            BEGIN
                NEW.search_vector :=
                    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
                    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B');
                RETURN NEW;
            END
            $$ LANGUAGE plpgsql;
        ");

        // Create trigger for categories
        DB::statement('DROP TRIGGER IF EXISTS categories_search_vector_trigger ON categories');
        DB::statement('
            CREATE TRIGGER categories_search_vector_trigger
            BEFORE INSERT OR UPDATE OF name, description
            ON categories
            FOR EACH ROW
            EXECUTE FUNCTION categories_search_vector_update();
        ');

        // Add search_vector column and GIN index to brands table
        DB::statement('ALTER TABLE brands ADD COLUMN IF NOT EXISTS search_vector tsvector');
        DB::statement('CREATE INDEX IF NOT EXISTS brands_search_vector_idx ON brands USING GIN(search_vector)');

        // Create trigger function for brands
        DB::statement("
            CREATE OR REPLACE FUNCTION brands_search_vector_update() RETURNS trigger AS $$
            BEGIN
                NEW.search_vector :=
                    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
                    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B');
                RETURN NEW;
            END
            $$ LANGUAGE plpgsql;
        ");

        // Create trigger for brands
        DB::statement('DROP TRIGGER IF EXISTS brands_search_vector_trigger ON brands');
        DB::statement('
            CREATE TRIGGER brands_search_vector_trigger
            BEFORE INSERT OR UPDATE OF name, description
            ON brands
            FOR EACH ROW
            EXECUTE FUNCTION brands_search_vector_update();
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop triggers
        DB::statement('DROP TRIGGER IF EXISTS products_search_vector_trigger ON products');
        DB::statement('DROP TRIGGER IF EXISTS categories_search_vector_trigger ON categories');
        DB::statement('DROP TRIGGER IF EXISTS brands_search_vector_trigger ON brands');

        // Drop trigger functions
        DB::statement('DROP FUNCTION IF EXISTS products_search_vector_update()');
        DB::statement('DROP FUNCTION IF EXISTS categories_search_vector_update()');
        DB::statement('DROP FUNCTION IF EXISTS brands_search_vector_update()');

        // Drop indexes
        DB::statement('DROP INDEX IF EXISTS products_search_vector_idx');
        DB::statement('DROP INDEX IF EXISTS categories_search_vector_idx');
        DB::statement('DROP INDEX IF EXISTS brands_search_vector_idx');

        // Drop columns
        DB::statement('ALTER TABLE products DROP COLUMN IF EXISTS search_vector');
        DB::statement('ALTER TABLE categories DROP COLUMN IF EXISTS search_vector');
        DB::statement('ALTER TABLE brands DROP COLUMN IF EXISTS search_vector');
    }
};
