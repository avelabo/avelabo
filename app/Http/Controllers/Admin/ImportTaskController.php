<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\RunImportTaskJob;
use App\Models\Category;
use App\Models\ImportDataSource;
use App\Models\ImportTask;
use App\Models\ImportTaskRun;
use App\Models\Seller;
use App\Services\Import\ImportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ImportTaskController extends Controller
{
    public function __construct(protected ImportService $importService) {}

    public function index(Request $request)
    {
        $tasks = ImportTask::with([
            'dataSource:id,name,slug',
            'seller:id,shop_name',
            'targetCategory:id,name',
            'latestRun:id,import_task_id,status,started_at,completed_at,total_items,processed_items,created_items,updated_items,failed_items',
        ])
            ->withCount('runs')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->data_source_id, fn ($q, $id) => $q->where('data_source_id', $id))
            ->when($request->seller_id, fn ($q, $id) => $q->where('seller_id', $id))
            ->when($request->import_type, fn ($q, $type) => $q->where('import_type', $type))
            ->when($request->status === 'active', fn ($q) => $q->where('is_active', true))
            ->when($request->status === 'inactive', fn ($q) => $q->where('is_active', false))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'total' => ImportTask::count(),
            'active' => ImportTask::where('is_active', true)->count(),
            'categories' => ImportTask::where('import_type', 'categories')->count(),
            'products' => ImportTask::where('import_type', 'products')->count(),
        ];

        return Inertia::render('Admin/Import/Tasks/Index', [
            'tasks' => $tasks,
            'filters' => $request->only(['search', 'data_source_id', 'seller_id', 'import_type', 'status']),
            'stats' => $stats,
            'dataSources' => ImportDataSource::active()->get(['id', 'name']),
            'sellers' => Seller::active()->get(['id', 'shop_name']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Import/Tasks/Create', [
            'dataSources' => ImportDataSource::active()->get(['id', 'name', 'slug']),
            'sellers' => Seller::active()->get(['id', 'shop_name']),
            'categories' => Category::active()->whereNull('parent_id')->with('children:id,name,parent_id')->get(['id', 'name']),
            'importTypes' => [
                ['value' => 'categories', 'label' => 'Import Categories'],
                ['value' => 'products', 'label' => 'Import Products'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'data_source_id' => ['required', 'exists:import_data_sources,id'],
            'seller_id' => ['required', 'exists:sellers,id'],
            'import_type' => ['required', Rule::in(['categories', 'products'])],
            'source_category_id' => ['nullable', 'integer'],
            'source_category_name' => ['nullable', 'string', 'max:255'],
            'target_category_id' => ['nullable', 'exists:categories,id'],
            'run_in_background' => ['boolean'],
            'settings' => ['nullable', 'array'],
            'is_active' => ['boolean'],
        ]);

        ImportTask::create([
            'name' => $validated['name'],
            'data_source_id' => $validated['data_source_id'],
            'seller_id' => $validated['seller_id'],
            'import_type' => $validated['import_type'],
            'source_category_id' => $validated['source_category_id'] ?? null,
            'source_category_name' => $validated['source_category_name'] ?? null,
            'target_category_id' => $validated['target_category_id'] ?? null,
            'run_in_background' => $validated['run_in_background'] ?? false,
            'settings' => $validated['settings'] ?? [],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.import.tasks.index')
            ->with('success', 'Import task created successfully!');
    }

    public function show(ImportTask $task)
    {
        $task->load([
            'dataSource:id,name,slug,base_url',
            'seller:id,shop_name',
            'targetCategory:id,name',
        ]);

        $runs = $task->runs()
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $runStats = [
            'total' => $task->runs()->count(),
            'completed' => $task->runs()->where('status', 'completed')->count(),
            'failed' => $task->runs()->where('status', 'failed')->count(),
            'running' => $task->runs()->where('status', 'running')->count(),
        ];

        return Inertia::render('Admin/Import/Tasks/Show', [
            'task' => $task,
            'runs' => $runs,
            'runStats' => $runStats,
        ]);
    }

    public function edit(ImportTask $task)
    {
        return Inertia::render('Admin/Import/Tasks/Edit', [
            'task' => $task,
            'dataSources' => ImportDataSource::active()->get(['id', 'name', 'slug']),
            'sellers' => Seller::active()->get(['id', 'shop_name']),
            'categories' => Category::active()->whereNull('parent_id')->with('children:id,name,parent_id')->get(['id', 'name']),
            'importTypes' => [
                ['value' => 'categories', 'label' => 'Import Categories'],
                ['value' => 'products', 'label' => 'Import Products'],
            ],
        ]);
    }

    public function update(Request $request, ImportTask $task)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'data_source_id' => ['required', 'exists:import_data_sources,id'],
            'seller_id' => ['required', 'exists:sellers,id'],
            'import_type' => ['required', Rule::in(['categories', 'products'])],
            'source_category_id' => ['nullable', 'integer'],
            'source_category_name' => ['nullable', 'string', 'max:255'],
            'target_category_id' => ['nullable', 'exists:categories,id'],
            'run_in_background' => ['boolean'],
            'settings' => ['nullable', 'array'],
            'is_active' => ['boolean'],
        ]);

        $task->update([
            'name' => $validated['name'],
            'data_source_id' => $validated['data_source_id'],
            'seller_id' => $validated['seller_id'],
            'import_type' => $validated['import_type'],
            'source_category_id' => $validated['source_category_id'] ?? null,
            'source_category_name' => $validated['source_category_name'] ?? null,
            'target_category_id' => $validated['target_category_id'] ?? null,
            'run_in_background' => $validated['run_in_background'] ?? false,
            'settings' => $validated['settings'] ?? [],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.import.tasks.index')
            ->with('success', 'Import task updated successfully!');
    }

    public function destroy(ImportTask $task)
    {
        $task->delete();

        return redirect()->route('admin.import.tasks.index')
            ->with('success', 'Import task deleted successfully!');
    }

    public function run(ImportTask $task)
    {
        if (! $task->is_active) {
            return back()->with('error', 'Cannot run an inactive task.');
        }

        // Check if there's already a running task
        if ($task->runs()->where('status', 'running')->exists()) {
            return back()->with('error', 'This task is already running.');
        }

        // Create a new run record
        $run = ImportTaskRun::create([
            'import_task_id' => $task->id,
            'status' => 'pending',
        ]);

        if ($task->run_in_background) {
            // Dispatch to queue
            RunImportTaskJob::dispatch($task, $run);

            return back()->with('success', 'Import task queued for background execution.');
        }

        // Run synchronously
        try {
            $this->importService->execute($task, $run);

            return back()->with('success', 'Import task completed successfully!');
        } catch (\Exception $e) {
            $run->markAsFailed($e->getMessage());

            return back()->with('error', 'Import task failed: '.$e->getMessage());
        }
    }

    public function fetchCategories(ImportTask $task)
    {
        $dataSource = $task->dataSource;

        try {
            $url = $dataSource->getCategoryListingFullUrl();
            $response = Http::timeout(30)->get($url);

            if ($response->successful()) {
                $data = $response->json();

                return response()->json([
                    'success' => true,
                    'categories' => $data['categories'] ?? [],
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch categories from data source.',
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function fetchSourceCategories(Request $request)
    {
        $validated = $request->validate([
            'data_source_id' => ['required', 'exists:import_data_sources,id'],
        ]);

        $dataSource = ImportDataSource::findOrFail($validated['data_source_id']);

        try {
            $url = $dataSource->getCategoryListingFullUrl();
            $headers = [];

            if ($dataSource->auth_type === 'bearer_token' && isset($dataSource->auth_credentials['bearer_token'])) {
                $headers['Authorization'] = 'Bearer '.$dataSource->auth_credentials['bearer_token'];
            } elseif ($dataSource->auth_type === 'api_key' && isset($dataSource->auth_credentials['api_key'])) {
                $headers['X-API-Key'] = $dataSource->auth_credentials['api_key'];
            }

            $response = Http::withHeaders($headers)->timeout(30)->get($url);

            if ($response->successful()) {
                $data = $response->json();

                return response()->json([
                    'success' => true,
                    'categories' => $data['categories'] ?? [],
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch categories from data source.',
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function runDetails(ImportTask $task, ImportTaskRun $run)
    {
        if ($run->import_task_id !== $task->id) {
            abort(404);
        }

        $run->load('task');

        $items = $run->items()
            ->latest('created_at')
            ->paginate(50)
            ->withQueryString();

        $itemStats = [
            'total' => $run->items()->count(),
            'created' => $run->items()->where('status', 'created')->count(),
            'updated' => $run->items()->where('status', 'updated')->count(),
            'skipped' => $run->items()->where('status', 'skipped')->count(),
            'failed' => $run->items()->where('status', 'failed')->count(),
        ];

        return Inertia::render('Admin/Import/Tasks/RunDetails', [
            'task' => $task,
            'run' => $run,
            'items' => $items,
            'itemStats' => $itemStats,
        ]);
    }
}
