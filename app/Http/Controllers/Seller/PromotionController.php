<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Promotion;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PromotionController extends Controller
{
    /**
     * Display a listing of the seller's promotions.
     */
    public function index(Request $request): Response
    {
        $seller = Auth::user()->seller;

        $promotions = Promotion::where('seller_id', $seller->id)
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->has('is_active') && $request->is_active !== '', function ($query) use ($request) {
                $query->where('is_active', $request->boolean('is_active'));
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Seller/Promotions/Index', [
            'promotions' => $promotions,
            'filters' => $request->only(['search', 'is_active']),
        ]);
    }

    /**
     * Show the form for creating a new promotion.
     */
    public function create(): Response
    {
        $seller = Auth::user()->seller;

        $categories = Category::whereIn('id', $seller->products()->pluck('category_id')->unique())
            ->get(['id', 'name']);

        $brands = Brand::whereIn('id', $seller->products()->pluck('brand_id')->unique()->filter())
            ->get(['id', 'name']);

        $tags = Tag::whereIn(
            'id',
            $seller->products()
                ->join('product_tag', 'products.id', '=', 'product_tag.product_id')
                ->pluck('product_tag.tag_id')
                ->unique()
        )->get(['id', 'name']);

        return Inertia::render('Seller/Promotions/Create', [
            'categories' => $categories,
            'brands' => $brands,
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created promotion.
     */
    public function store(Request $request): RedirectResponse
    {
        $seller = Auth::user()->seller;

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'discount_type' => ['required', 'in:percentage,fixed'],
            'discount_value' => ['required', 'numeric', 'min:0.01'],
            'scope_type' => ['required', 'in:all,category,brand,tag'],
            'scope_id' => ['nullable', 'integer', 'required_unless:scope_type,all'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'is_active' => ['boolean'],
        ]);

        Promotion::create([
            ...$validated,
            'type' => 'seller',
            'seller_id' => $seller->id,
        ]);

        return redirect()->route('seller.promotions.index')
            ->with('success', 'Promotion created successfully!');
    }

    /**
     * Show the form for editing the specified promotion.
     */
    public function edit(Promotion $promotion): Response
    {
        $seller = Auth::user()->seller;

        if ($promotion->seller_id !== $seller->id) {
            abort(403);
        }

        $categories = Category::whereIn('id', $seller->products()->pluck('category_id')->unique())
            ->get(['id', 'name']);

        $brands = Brand::whereIn('id', $seller->products()->pluck('brand_id')->unique()->filter())
            ->get(['id', 'name']);

        $tags = Tag::whereIn(
            'id',
            $seller->products()
                ->join('product_tag', 'products.id', '=', 'product_tag.product_id')
                ->pluck('product_tag.tag_id')
                ->unique()
        )->get(['id', 'name']);

        return Inertia::render('Seller/Promotions/Edit', [
            'promotion' => $promotion,
            'categories' => $categories,
            'brands' => $brands,
            'tags' => $tags,
        ]);
    }

    /**
     * Update the specified promotion.
     */
    public function update(Request $request, Promotion $promotion): RedirectResponse
    {
        $seller = Auth::user()->seller;

        if ($promotion->seller_id !== $seller->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'discount_type' => ['required', 'in:percentage,fixed'],
            'discount_value' => ['required', 'numeric', 'min:0.01'],
            'scope_type' => ['required', 'in:all,category,brand,tag'],
            'scope_id' => ['nullable', 'integer', 'required_unless:scope_type,all'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'is_active' => ['boolean'],
        ]);

        $promotion->update($validated);

        return redirect()->route('seller.promotions.index')
            ->with('success', 'Promotion updated successfully!');
    }

    /**
     * Remove the specified promotion.
     */
    public function destroy(Promotion $promotion): RedirectResponse
    {
        $seller = Auth::user()->seller;

        if ($promotion->seller_id !== $seller->id) {
            abort(403);
        }

        $promotion->delete();

        return redirect()->route('seller.promotions.index')
            ->with('success', 'Promotion deleted successfully!');
    }

    /**
     * Toggle the active status of a promotion.
     */
    public function toggleStatus(Promotion $promotion): RedirectResponse
    {
        $seller = Auth::user()->seller;

        if ($promotion->seller_id !== $seller->id) {
            abort(403);
        }

        $promotion->update(['is_active' => ! $promotion->is_active]);

        $status = $promotion->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Promotion {$status} successfully!");
    }
}
