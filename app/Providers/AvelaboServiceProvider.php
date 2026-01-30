<?php

namespace App\Providers;

use App\Contracts\SmsProvider;
use App\Services\CurrencyService;
use App\Services\DiscountService;
use App\Services\MarkupService;
use App\Services\NotificationService;
use App\Services\PriceService;
use App\Services\Sms\NullSmsProvider;
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
            return new CurrencyService;
        });

        $this->app->singleton(MarkupService::class, function ($app) {
            return new MarkupService;
        });

        $this->app->singleton(DiscountService::class, function ($app) {
            return new DiscountService;
        });

        $this->app->singleton(PriceService::class, function ($app) {
            return new PriceService(
                $app->make(CurrencyService::class),
                $app->make(MarkupService::class),
                $app->make(DiscountService::class)
            );
        });

        // SMS Provider - swap out NullSmsProvider for real implementation when ready
        $this->app->singleton(SmsProvider::class, function ($app) {
            return new NullSmsProvider;
        });

        $this->app->singleton(NotificationService::class, function ($app) {
            return new NotificationService;
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
