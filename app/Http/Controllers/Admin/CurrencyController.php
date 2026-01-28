<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\ExchangeRate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CurrencyController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $currencies = Currency::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            })
            ->orderByDesc('is_default')
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        $exchangeRates = ExchangeRate::with(['fromCurrency', 'toCurrency'])
            ->orderBy('from_currency_id')
            ->get();

        $stats = [
            'total' => Currency::count(),
            'active' => Currency::where('is_active', true)->count(),
            'default' => Currency::where('is_default', true)->value('code'),
        ];

        return Inertia::render('Admin/Currencies/Index', [
            'currencies' => $currencies,
            'exchangeRates' => $exchangeRates,
            'filters' => $request->only(['search']),
            'stats' => $stats,
        ]);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:10', 'unique:currencies,code'],
            'symbol' => ['required', 'string', 'max:10'],
            'decimal_places' => ['required', 'integer', 'min:0', 'max:8'],
            'symbol_before' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        Currency::create($validated);

        return back()->with('success', 'Currency created successfully!');
    }

    public function update(Request $request, Currency $currency): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:10', 'unique:currencies,code,'.$currency->id],
            'symbol' => ['required', 'string', 'max:10'],
            'decimal_places' => ['required', 'integer', 'min:0', 'max:8'],
            'symbol_before' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        $currency->update($validated);

        return back()->with('success', 'Currency updated successfully!');
    }

    public function destroy(Currency $currency): \Illuminate\Http\RedirectResponse
    {
        if ($currency->is_default) {
            return back()->with('error', 'Cannot delete the default currency.');
        }

        if ($currency->exchangeRatesFrom()->exists() || $currency->exchangeRatesTo()->exists()) {
            $currency->exchangeRatesFrom()->delete();
            $currency->exchangeRatesTo()->delete();
        }

        $currency->delete();

        return back()->with('success', 'Currency deleted successfully!');
    }

    public function toggleStatus(Currency $currency): \Illuminate\Http\RedirectResponse
    {
        if ($currency->is_default && $currency->is_active) {
            return back()->with('error', 'Cannot deactivate the default currency.');
        }

        $currency->update(['is_active' => ! $currency->is_active]);

        return back()->with('success', 'Currency status updated successfully!');
    }

    public function setDefault(Currency $currency): \Illuminate\Http\RedirectResponse
    {
        if (! $currency->is_active) {
            return back()->with('error', 'Cannot set an inactive currency as default.');
        }

        Currency::where('is_default', true)->update(['is_default' => false]);
        $currency->update(['is_default' => true, 'is_active' => true]);

        return back()->with('success', $currency->code.' is now the default currency.');
    }

    public function updateExchangeRate(Request $request, ExchangeRate $exchangeRate): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'rate' => ['required', 'numeric', 'min:0'],
            'markup_percentage' => ['required', 'numeric', 'min:0', 'max:100'],
        ]);

        $exchangeRate->update($validated);

        return back()->with('success', 'Exchange rate updated successfully!');
    }
}
