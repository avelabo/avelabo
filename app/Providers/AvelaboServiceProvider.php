<?php

namespace App\Providers;

use App\Services\CurrencyService;
use App\Services\DiscountService;
use App\Services\MarkupService;
use App\Services\PriceService;
use Illuminate\Support\ServiceProvider;

class AvelaboServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register as singletons to maintain state during request
        $this->app->singleton(CurrencyService::class, function ($app) {
            return new CurrencyService();
        });

        $this->app->singleton(MarkupService::class, function ($app) {
            return new MarkupService();
        });

        $this->app->singleton(DiscountService::class, function ($app) {
            return new DiscountService();
        });

        $this->app->singleton(PriceService::class, function ($app) {
            return new PriceService(
                $app->make(CurrencyService::class),
                $app->make(MarkupService::class),
                $app->make(DiscountService::class)
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
