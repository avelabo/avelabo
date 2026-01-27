<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Promotion;
use App\Models\Seller;
use App\Models\Tag;
use App\Services\DiscountService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PromotionController extends Controller
{
    public function __construct(protected DiscountService $discountService) {}

    public function index(Request $request): Response
    {
        $promotions = Promotion::query()
            ->with('seller')
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->when($request->type, fn ($q, $t) => $q->where('type', $t))
            ->when($request->status === 'active', fn ($q) => $q->where('is_active', true))
            ->when($request->status === 'inactive', fn ($q) => $q->where('is_active', false))
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'total' => Promotion::count(),
            'active' => Promotion::active()->count(),
            'seller' => Promotion::where('type', 'seller')->count(),
            'system' => Promotion::where('type', 'system')->count(),
        ];

        return Inertia::render('Admin/Promotions/Index', [
            'promotions' => $promotions,
            'filters' => $request->only(['search', 'type', 'status']),
            'stats' => $stats,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Promotions/Create', [
            'categories' => Category::active()->orderBy('name')->get(['id', 'name']),
            'brands' => Brand::active()->orderBy('name')->get(['id', 'name']),
            'tags' => Tag::active()->orderBy('name')->get(['id', 'name']),
            'sellers' => Seller::where('status', 'active')->orderBy('shop_name')->get(['id', 'shop_name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:seller,system'],
            'seller_id' => ['nullable', 'required_if:type,seller', 'exists:sellers,id'],
            'discount_type' => ['required', 'in:percentage,fixed'],
            'discount_value' => ['required', 'numeric', 'min:0.01'],
            'scope_type' => ['required', 'in:all,category,tag,brand'],
            'scope_id' => ['nullable', 'required_unless:scope_type,all', 'integer'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'priority' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        if ($validated['type'] === 'system') {
            $validated['seller_id'] = null;
        }

        Promotion::create($validated);

        $this->discountService->clearPromotionsCache();

        return redirect()->route('admin.promotions.index')
            ->with('success', 'Promotion created successfully!');
    }

    public function edit(Promotion $promotion): Response
    {
        return Inertia::render('Admin/Promotions/Edit', [
            'promotion' => $promotion,
            'categories' => Category::active()->orderBy('name')->get(['id', 'name']),
            'brands' => Brand::active()->orderBy('name')->get(['id', 'name']),
            'tags' => Tag::active()->orderBy('name')->get(['id', 'name']),
            'sellers' => Seller::where('status', 'active')->orderBy('shop_name')->get(['id', 'shop_name']),
        ]);
    }

    public function update(Request $request, Promotion $promotion): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:seller,system'],
            'seller_id' => ['nullable', 'required_if:type,seller', 'exists:sellers,id'],
            'discount_type' => ['required', 'in:percentage,fixed'],
            'discount_value' => ['required', 'numeric', 'min:0.01'],
            'scope_type' => ['required', 'in:all,category,tag,brand'],
            'scope_id' => ['nullable', 'required_unless:scope_type,all', 'integer'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'priority' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        if ($validated['type'] === 'system') {
            $validated['seller_id'] = null;
        }

        $promotion->update($validated);

        $this->discountService->clearPromotionsCache();

        return redirect()->route('admin.promotions.index')
            ->with('success', 'Promotion updated successfully!');
    }

    public function destroy(Promotion $promotion): RedirectResponse
    {
        $promotion->delete();

        $this->discountService->clearPromotionsCache();

        return redirect()->route('admin.promotions.index')
            ->with('success', 'Promotion deleted successfully!');
    }

    public function toggleStatus(Promotion $promotion): RedirectResponse
    {
        $promotion->update(['is_active' => ! $promotion->is_active]);

        $this->discountService->clearPromotionsCache();

        return back()->with('success', 'Promotion status updated!');
    }
}
