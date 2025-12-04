<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use App\Models\SellerMarkupTemplate;
use App\Models\SellerPriceMarkup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SellerController extends Controller
{
    /**
     * Display a listing of sellers
     */
    public function index(Request $request)
    {
        $sellers = Seller::with(['user:id,name,email'])
            ->withCount(['products', 'orders'])
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('shop_name', 'like', "%{$search}%")
                        ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'total' => Seller::count(),
            'approved' => Seller::where('status', 'approved')->count(),
            'pending' => Seller::where('status', 'pending')->orWhere('status', 'pending_kyc')->count(),
            'rejected' => Seller::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Sellers/Index', [
            'sellers' => $sellers,
            'stats' => $stats,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Display the specified seller
     */
    public function show(Seller $seller)
    {
        $seller->load([
            'user:id,name,email,phone,created_at',
            'kyc',
            'bankAccounts',
            'priceMarkups',
            'markupTemplate.ranges',
        ]);

        $stats = [
            'total_products' => $seller->products()->count(),
            'active_products' => $seller->products()->where('status', 'active')->count(),
            'total_orders' => $seller->orders()->count(),
            'total_revenue' => $seller->orders()->whereNotNull('paid_at')->sum('total'),
        ];

        $markupTemplates = SellerMarkupTemplate::where('is_active', true)->get();

        return Inertia::render('Admin/Sellers/Show', [
            'seller' => $seller,
            'stats' => $stats,
            'markupTemplates' => $markupTemplates,
        ]);
    }

    /**
     * Update seller details
     */
    public function update(Request $request, Seller $seller)
    {
        $validated = $request->validate([
            'shop_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'commission_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'is_featured' => ['boolean'],
            'show_seller_name' => ['boolean'],
            'has_storefront' => ['boolean'],
        ]);

        $seller->update($validated);

        return back()->with('success', 'Seller updated successfully.');
    }

    /**
     * Update seller status
     */
    public function updateStatus(Request $request, Seller $seller)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:approved,suspended,rejected'],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $seller->update([
            'status' => $validated['status'],
            'is_verified' => $validated['status'] === 'approved',
        ]);

        // TODO: Send notification to seller

        return back()->with('success', 'Seller status updated.');
    }

    /**
     * Apply markup template to seller
     */
    public function applyMarkupTemplate(Request $request, Seller $seller)
    {
        $validated = $request->validate([
            'template_id' => ['required', 'exists:seller_markup_templates,id'],
        ]);

        $seller->update(['markup_template_id' => $validated['template_id']]);

        return back()->with('success', 'Markup template applied successfully.');
    }

    /**
     * Set custom markup for seller
     */
    public function setCustomMarkup(Request $request, Seller $seller)
    {
        $validated = $request->validate([
            'markups' => ['required', 'array'],
            'markups.*.min_price' => ['required', 'numeric', 'min:0'],
            'markups.*.max_price' => ['nullable', 'numeric', 'min:0'],
            'markups.*.markup_type' => ['required', 'in:percentage,fixed'],
            'markups.*.markup_value' => ['required', 'numeric', 'min:0'],
        ]);

        // Clear existing custom markups
        SellerPriceMarkup::where('seller_id', $seller->id)->delete();

        // Create new markups
        foreach ($validated['markups'] as $markup) {
            SellerPriceMarkup::create([
                'seller_id' => $seller->id,
                'min_price' => $markup['min_price'],
                'max_price' => $markup['max_price'],
                'markup_type' => $markup['markup_type'],
                'markup_value' => $markup['markup_value'],
                'is_active' => true,
            ]);
        }

        // Clear template assignment since using custom
        $seller->update(['markup_template_id' => null]);

        return back()->with('success', 'Custom markup rules saved.');
    }
}
