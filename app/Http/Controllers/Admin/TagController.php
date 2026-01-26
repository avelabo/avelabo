<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    /**
     * Display a listing of tags
     */
    public function index(Request $request): Response
    {
        $tags = Tag::query()
            ->withCount('products')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->status === 'active', fn ($q) => $q->where('is_active', true))
            ->when($request->status === 'inactive', fn ($q) => $q->where('is_active', false))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'total' => Tag::count(),
            'active' => Tag::where('is_active', true)->count(),
            'with_products' => Tag::whereHas('products')->count(),
        ];

        return Inertia::render('Admin/Tags/Index', [
            'tags' => $tags,
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new tag
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Tags/Create');
    }

    /**
     * Store a newly created tag
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'color' => ['required', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'is_active' => ['boolean'],
        ]);

        Tag::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']).'-'.Str::random(5),
            'color' => $validated['color'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.tags.index')
            ->with('success', 'Tag created successfully!');
    }

    /**
     * Show the form for editing the specified tag
     */
    public function edit(Tag $tag): Response
    {
        return Inertia::render('Admin/Tags/Edit', [
            'tag' => $tag,
        ]);
    }

    /**
     * Update the specified tag
     */
    public function update(Request $request, Tag $tag): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'color' => ['required', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'is_active' => ['boolean'],
        ]);

        $tag->update([
            'name' => $validated['name'],
            'color' => $validated['color'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.tags.index')
            ->with('success', 'Tag updated successfully!');
    }

    /**
     * Remove the specified tag
     */
    public function destroy(Tag $tag): RedirectResponse
    {
        // Detach from all products first
        $tag->products()->detach();
        $tag->delete();

        return redirect()->route('admin.tags.index')
            ->with('success', 'Tag deleted successfully!');
    }

    /**
     * Toggle tag status
     */
    public function toggleStatus(Tag $tag): RedirectResponse
    {
        $tag->update(['is_active' => ! $tag->is_active]);

        return back()->with('success', 'Tag status updated successfully!');
    }
}
