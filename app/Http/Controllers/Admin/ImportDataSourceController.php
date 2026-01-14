<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\ImportDataSource;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ImportDataSourceController extends Controller
{
    public function index(Request $request)
    {
        $dataSources = ImportDataSource::with('defaultCurrency:id,code,name')
            ->withCount('importTasks')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('base_url', 'like', "%{$search}%");
            })
            ->when($request->status === 'active', fn ($q) => $q->where('is_active', true))
            ->when($request->status === 'inactive', fn ($q) => $q->where('is_active', false))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'total' => ImportDataSource::count(),
            'active' => ImportDataSource::where('is_active', true)->count(),
            'inactive' => ImportDataSource::where('is_active', false)->count(),
        ];

        return Inertia::render('Admin/Import/DataSources/Index', [
            'dataSources' => $dataSources,
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Import/DataSources/Create', [
            'currencies' => Currency::where('is_active', true)->get(['id', 'code', 'name']),
            'authTypes' => [
                ['value' => 'none', 'label' => 'No Authentication'],
                ['value' => 'api_key', 'label' => 'API Key'],
                ['value' => 'bearer_token', 'label' => 'Bearer Token'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'base_url' => ['required', 'url', 'max:500'],
            'category_listing_url' => ['required', 'string', 'max:500'],
            'category_search_url' => ['nullable', 'string', 'max:500'],
            'product_listing_url' => ['nullable', 'string', 'max:500'],
            'product_by_category_url' => ['required', 'string', 'max:500'],
            'auth_type' => ['required', Rule::in(['none', 'api_key', 'bearer_token'])],
            'auth_credentials' => ['nullable', 'array'],
            'auth_credentials.api_key' => ['nullable', 'string'],
            'auth_credentials.bearer_token' => ['nullable', 'string'],
            'default_currency_id' => ['nullable', 'exists:currencies,id'],
            'is_active' => ['boolean'],
        ]);

        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $counter = 1;
        while (ImportDataSource::where('slug', $slug)->exists()) {
            $slug = $originalSlug.'-'.$counter++;
        }

        ImportDataSource::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'base_url' => $validated['base_url'],
            'category_listing_url' => $validated['category_listing_url'],
            'category_search_url' => $validated['category_search_url'] ?? null,
            'product_listing_url' => $validated['product_listing_url'] ?? null,
            'product_by_category_url' => $validated['product_by_category_url'],
            'auth_type' => $validated['auth_type'],
            'auth_credentials' => $validated['auth_credentials'] ?? null,
            'default_currency_id' => $validated['default_currency_id'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.import.data-sources.index')
            ->with('success', 'Data source created successfully!');
    }

    public function show(ImportDataSource $dataSource)
    {
        $dataSource->load(['defaultCurrency:id,code,name']);
        $dataSource->loadCount('importTasks');

        return Inertia::render('Admin/Import/DataSources/Show', [
            'dataSource' => $dataSource,
        ]);
    }

    public function edit(ImportDataSource $dataSource)
    {
        return Inertia::render('Admin/Import/DataSources/Edit', [
            'dataSource' => $dataSource,
            'currencies' => Currency::where('is_active', true)->get(['id', 'code', 'name']),
            'authTypes' => [
                ['value' => 'none', 'label' => 'No Authentication'],
                ['value' => 'api_key', 'label' => 'API Key'],
                ['value' => 'bearer_token', 'label' => 'Bearer Token'],
            ],
        ]);
    }

    public function update(Request $request, ImportDataSource $dataSource)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'base_url' => ['required', 'url', 'max:500'],
            'category_listing_url' => ['required', 'string', 'max:500'],
            'category_search_url' => ['nullable', 'string', 'max:500'],
            'product_listing_url' => ['nullable', 'string', 'max:500'],
            'product_by_category_url' => ['required', 'string', 'max:500'],
            'auth_type' => ['required', Rule::in(['none', 'api_key', 'bearer_token'])],
            'auth_credentials' => ['nullable', 'array'],
            'auth_credentials.api_key' => ['nullable', 'string'],
            'auth_credentials.bearer_token' => ['nullable', 'string'],
            'default_currency_id' => ['nullable', 'exists:currencies,id'],
            'is_active' => ['boolean'],
        ]);

        $dataSource->update([
            'name' => $validated['name'],
            'base_url' => $validated['base_url'],
            'category_listing_url' => $validated['category_listing_url'],
            'category_search_url' => $validated['category_search_url'] ?? null,
            'product_listing_url' => $validated['product_listing_url'] ?? null,
            'product_by_category_url' => $validated['product_by_category_url'],
            'auth_type' => $validated['auth_type'],
            'auth_credentials' => $validated['auth_credentials'] ?? null,
            'default_currency_id' => $validated['default_currency_id'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.import.data-sources.index')
            ->with('success', 'Data source updated successfully!');
    }

    public function destroy(ImportDataSource $dataSource)
    {
        if ($dataSource->importTasks()->exists()) {
            return back()->with('error', 'Cannot delete data source with existing import tasks.');
        }

        $dataSource->delete();

        return redirect()->route('admin.import.data-sources.index')
            ->with('success', 'Data source deleted successfully!');
    }

    public function toggleStatus(ImportDataSource $dataSource)
    {
        $dataSource->update(['is_active' => ! $dataSource->is_active]);

        return back()->with('success', 'Data source status updated successfully!');
    }
}
