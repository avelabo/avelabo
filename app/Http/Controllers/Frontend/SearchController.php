<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\SearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __construct(
        protected SearchService $searchService
    ) {}

    /**
     * Redirect to shop page with search query.
     */
    public function index(Request $request): RedirectResponse
    {
        $query = $request->get('q', '');

        return redirect()->route('shop', ['search' => $query]);
    }

    /**
     * Instant search for autocomplete dropdown.
     */
    public function instant(Request $request): JsonResponse
    {
        $query = $request->get('q', '');

        if (strlen(trim($query)) < 2) {
            return response()->json([
                'products' => [],
                'categories' => [],
                'brands' => [],
                'query' => $query,
            ]);
        }

        $results = $this->searchService->search($query, 8);

        return response()->json([
            ...$results,
            'query' => $query,
        ]);
    }
}
