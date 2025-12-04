<?php

namespace App\Http\Controllers;

use App\Models\Currency;
use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    public function set(Request $request)
    {
        $request->validate([
            'code' => 'required|string|exists:currencies,code',
        ]);

        $currency = Currency::where('code', $request->code)
            ->where('is_active', true)
            ->first();

        if (!$currency) {
            return back()->with('error', 'Invalid currency selected.');
        }

        session(['currency' => [
            'code' => $currency->code,
            'symbol' => $currency->symbol,
            'symbol_before' => $currency->symbol_before,
            'decimal_places' => $currency->decimal_places,
            'exchange_rate' => $currency->exchange_rate,
        ]]);

        return back()->with('success', 'Currency updated to ' . $currency->name);
    }
}
