<?php

namespace App\Services;

use App\Models\Currency;
use App\Models\ExchangeRate;
use Illuminate\Support\Facades\Cache;

class CurrencyService
{
    protected ?Currency $defaultCurrency = null;

    public function getDefaultCurrency(): Currency
    {
        if ($this->defaultCurrency === null) {
            $this->defaultCurrency = Cache::remember('default_currency', 3600, function () {
                return Currency::where('is_default', true)->first()
                    ?? Currency::where('code', 'MWK')->first()
                    ?? Currency::first();
            });
        }

        return $this->defaultCurrency;
    }

    public function getCurrency(string $code): ?Currency
    {
        return Cache::remember("currency.{$code}", 3600, function () use ($code) {
            return Currency::where('code', $code)->active()->first();
        });
    }

    public function getActiveCurrencies(): array
    {
        return Cache::remember('active_currencies', 3600, function () {
            return Currency::active()->orderBy('sort_order')->get()->toArray();
        });
    }

    public function convert(float $amount, string $fromCurrency, string $toCurrency): float
    {
        if ($fromCurrency === $toCurrency) {
            return $amount;
        }

        $rate = $this->getExchangeRate($fromCurrency, $toCurrency);

        return round($amount * $rate, 2);
    }

    public function getExchangeRate(string $fromCurrency, string $toCurrency): float
    {
        if ($fromCurrency === $toCurrency) {
            return 1.0;
        }

        $cacheKey = "exchange_rate.{$fromCurrency}.{$toCurrency}";

        return Cache::remember($cacheKey, 3600, function () use ($fromCurrency, $toCurrency) {
            $from = $this->getCurrency($fromCurrency);
            $to = $this->getCurrency($toCurrency);

            if (!$from || !$to) {
                return 1.0;
            }

            // Try direct rate
            $directRate = ExchangeRate::where('from_currency_id', $from->id)
                ->where('to_currency_id', $to->id)
                ->first();

            if ($directRate) {
                return (float) $directRate->rate;
            }

            // Try inverse rate
            $inverseRate = ExchangeRate::where('from_currency_id', $to->id)
                ->where('to_currency_id', $from->id)
                ->first();

            if ($inverseRate && $inverseRate->rate > 0) {
                return 1 / (float) $inverseRate->rate;
            }

            // Try conversion through default currency (MWK)
            $defaultCurrency = $this->getDefaultCurrency();

            if ($from->id !== $defaultCurrency->id && $to->id !== $defaultCurrency->id) {
                $toDefault = $this->getExchangeRate($fromCurrency, $defaultCurrency->code);
                $fromDefault = $this->getExchangeRate($defaultCurrency->code, $toCurrency);
                return $toDefault * $fromDefault;
            }

            return 1.0;
        });
    }

    public function format(float $amount, string $currencyCode): string
    {
        $currency = $this->getCurrency($currencyCode);

        if (!$currency) {
            return number_format($amount, 2) . ' ' . $currencyCode;
        }

        $formatted = number_format($amount, $currency->decimal_places, '.', ',');

        return $currency->symbol_position === 'before'
            ? $currency->symbol . $formatted
            : $formatted . ' ' . $currency->symbol;
    }

    public function clearCache(): void
    {
        Cache::forget('default_currency');
        Cache::forget('active_currencies');

        // Clear all currency-specific caches
        $currencies = Currency::all();
        foreach ($currencies as $currency) {
            Cache::forget("currency.{$currency->code}");
            foreach ($currencies as $other) {
                Cache::forget("exchange_rate.{$currency->code}.{$other->code}");
            }
        }
    }
}
