<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentGateway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PaymentGatewayController extends Controller
{
    public function index(Request $request)
    {
        $gateways = PaymentGateway::query()
            ->withCount('payments')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('display_name', 'like', "%{$search}%");
            })
            ->when($request->status === 'active', fn ($q) => $q->where('is_active', true))
            ->when($request->status === 'inactive', fn ($q) => $q->where('is_active', false))
            ->orderBy('sort_order')
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'total' => PaymentGateway::count(),
            'active' => PaymentGateway::where('is_active', true)->count(),
            'test_mode' => PaymentGateway::where('is_test_mode', true)->count(),
        ];

        return Inertia::render('Admin/PaymentGateways/Index', [
            'gateways' => $gateways,
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    public function create(): \Inertia\Response
    {
        return Inertia::render('Admin/PaymentGateways/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'display_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:2048'],
            'config' => ['nullable', 'array'],
            'supported_currencies' => ['nullable', 'array'],
            'supported_countries' => ['nullable', 'array'],
            'transaction_fee_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'transaction_fee_fixed' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
            'is_test_mode' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $slug = Str::slug($validated['name']);

        $data = [
            'name' => $validated['name'],
            'slug' => $slug,
            'display_name' => $validated['display_name'],
            'description' => $validated['description'] ?? null,
            'config' => $validated['config'] ?? null,
            'supported_currencies' => $validated['supported_currencies'] ?? null,
            'supported_countries' => $validated['supported_countries'] ?? null,
            'transaction_fee_percentage' => $validated['transaction_fee_percentage'] ?? 0,
            'transaction_fee_fixed' => $validated['transaction_fee_fixed'] ?? 0,
            'is_active' => $validated['is_active'] ?? false,
            'is_test_mode' => $validated['is_test_mode'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ];

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('payment-gateways', 'public');
        }

        PaymentGateway::create($data);

        return redirect()->route('admin.payment-gateways.index')
            ->with('success', 'Payment gateway created successfully.');
    }

    public function edit(PaymentGateway $paymentGateway): \Inertia\Response
    {
        return Inertia::render('Admin/PaymentGateways/Edit', [
            'gateway' => [
                'id' => $paymentGateway->id,
                'name' => $paymentGateway->name,
                'slug' => $paymentGateway->slug,
                'display_name' => $paymentGateway->display_name,
                'description' => $paymentGateway->description,
                'logo' => $paymentGateway->logo,
                'config' => $paymentGateway->config ?? [],
                'supported_currencies' => $paymentGateway->supported_currencies ?? [],
                'supported_countries' => $paymentGateway->supported_countries ?? [],
                'transaction_fee_percentage' => $paymentGateway->transaction_fee_percentage,
                'transaction_fee_fixed' => $paymentGateway->transaction_fee_fixed,
                'is_active' => $paymentGateway->is_active,
                'is_test_mode' => $paymentGateway->is_test_mode,
                'sort_order' => $paymentGateway->sort_order,
            ],
        ]);
    }

    public function update(Request $request, PaymentGateway $paymentGateway)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'display_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:2048'],
            'config' => ['nullable', 'array'],
            'supported_currencies' => ['nullable', 'array'],
            'supported_countries' => ['nullable', 'array'],
            'transaction_fee_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'transaction_fee_fixed' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
            'is_test_mode' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $data = [
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'display_name' => $validated['display_name'],
            'description' => $validated['description'] ?? null,
            'config' => $validated['config'] ?? null,
            'supported_currencies' => $validated['supported_currencies'] ?? null,
            'supported_countries' => $validated['supported_countries'] ?? null,
            'transaction_fee_percentage' => $validated['transaction_fee_percentage'] ?? 0,
            'transaction_fee_fixed' => $validated['transaction_fee_fixed'] ?? 0,
            'is_active' => $validated['is_active'] ?? false,
            'is_test_mode' => $validated['is_test_mode'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ];

        if ($request->hasFile('logo')) {
            if ($paymentGateway->logo) {
                Storage::disk('public')->delete($paymentGateway->logo);
            }
            $data['logo'] = $request->file('logo')->store('payment-gateways', 'public');
        }

        $paymentGateway->update($data);

        return redirect()->route('admin.payment-gateways.index')
            ->with('success', 'Payment gateway updated successfully.');
    }

    public function destroy(PaymentGateway $paymentGateway)
    {
        if ($paymentGateway->payments()->exists()) {
            return back()->with('error', 'Cannot delete this gateway — it has associated payments.');
        }

        if ($paymentGateway->logo) {
            Storage::disk('public')->delete($paymentGateway->logo);
        }

        $paymentGateway->delete();

        return redirect()->route('admin.payment-gateways.index')
            ->with('success', 'Payment gateway deleted successfully.');
    }

    public function toggleStatus(PaymentGateway $paymentGateway)
    {
        $paymentGateway->update(['is_active' => ! $paymentGateway->is_active]);

        return back()->with('success', 'Gateway status updated.');
    }

    public function toggleTestMode(PaymentGateway $paymentGateway)
    {
        $paymentGateway->update(['is_test_mode' => ! $paymentGateway->is_test_mode]);

        return back()->with('success', 'Test mode updated.');
    }
}
