<?php

namespace App\Providers;

use App\Scout\PostgresSearchEngine;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;
use Laravel\Scout\EngineManager;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::automaticallyEagerLoadRelationships();

        // Register PostgreSQL full-text search engine for Scout
        resolve(EngineManager::class)->extend('pgsql', function () {
            return new PostgresSearchEngine;
        });
    }
}
