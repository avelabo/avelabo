<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SellerMarkupTemplate;
use App\Models\SellerMarkupTemplateRange;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MarkupTemplateController extends Controller
{
    /**
     * Display a listing of markup templates
     */
    public function index()
    {
        $templates = SellerMarkupTemplate::withCount(['ranges', 'sellers'])
            ->orderBy('is_default', 'desc')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/MarkupTemplates/Index', [
            'templates' => $templates,
        ]);
    }

    /**
     * Show the form for creating a new template
     */
    public function create()
    {
        return Inertia::render('Admin/MarkupTemplates/Create');
    }

    /**
     * Store a newly created template
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'is_default' => ['boolean'],
            'is_active' => ['boolean'],
            'ranges' => ['required', 'array', 'min:1'],
            'ranges.*.min_price' => ['required', 'numeric', 'min:0'],
            'ranges.*.max_price' => ['nullable', 'numeric', 'min:0'],
            'ranges.*.markup_type' => ['required', 'in:percentage,fixed'],
            'ranges.*.markup_value' => ['required', 'numeric', 'min:0'],
        ]);

        DB::transaction(function () use ($validated) {
            // If setting as default, unset other defaults
            if ($validated['is_default'] ?? false) {
                SellerMarkupTemplate::where('is_default', true)->update(['is_default' => false]);
            }

            $template = SellerMarkupTemplate::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'is_default' => $validated['is_default'] ?? false,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            foreach ($validated['ranges'] as $index => $range) {
                SellerMarkupTemplateRange::create([
                    'seller_markup_template_id' => $template->id,
                    'min_price' => $range['min_price'],
                    'max_price' => $range['max_price'],
                    'markup_type' => $range['markup_type'],
                    'markup_value' => $range['markup_value'],
                    'sort_order' => $index,
                ]);
            }
        });

        return redirect()->route('admin.markup-templates.index')
            ->with('success', 'Markup template created successfully.');
    }

    /**
     * Display the specified template
     */
    public function show(SellerMarkupTemplate $markupTemplate)
    {
        $markupTemplate->load(['ranges' => fn($q) => $q->orderBy('sort_order'), 'sellers:id,shop_name']);

        return Inertia::render('Admin/MarkupTemplates/Show', [
            'template' => $markupTemplate,
        ]);
    }

    /**
     * Show the form for editing the template
     */
    public function edit(SellerMarkupTemplate $markupTemplate)
    {
        $markupTemplate->load(['ranges' => fn($q) => $q->orderBy('sort_order')]);

        return Inertia::render('Admin/MarkupTemplates/Edit', [
            'template' => $markupTemplate,
        ]);
    }

    /**
     * Update the specified template
     */
    public function update(Request $request, SellerMarkupTemplate $markupTemplate)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'is_default' => ['boolean'],
            'is_active' => ['boolean'],
            'ranges' => ['required', 'array', 'min:1'],
            'ranges.*.min_price' => ['required', 'numeric', 'min:0'],
            'ranges.*.max_price' => ['nullable', 'numeric', 'min:0'],
            'ranges.*.markup_type' => ['required', 'in:percentage,fixed'],
            'ranges.*.markup_value' => ['required', 'numeric', 'min:0'],
        ]);

        DB::transaction(function () use ($validated, $markupTemplate) {
            // If setting as default, unset other defaults
            if (($validated['is_default'] ?? false) && !$markupTemplate->is_default) {
                SellerMarkupTemplate::where('is_default', true)->update(['is_default' => false]);
            }

            $markupTemplate->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'is_default' => $validated['is_default'] ?? false,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            // Delete existing ranges and recreate
            $markupTemplate->ranges()->delete();

            foreach ($validated['ranges'] as $index => $range) {
                SellerMarkupTemplateRange::create([
                    'seller_markup_template_id' => $markupTemplate->id,
                    'min_price' => $range['min_price'],
                    'max_price' => $range['max_price'],
                    'markup_type' => $range['markup_type'],
                    'markup_value' => $range['markup_value'],
                    'sort_order' => $index,
                ]);
            }
        });

        return redirect()->route('admin.markup-templates.index')
            ->with('success', 'Markup template updated successfully.');
    }

    /**
     * Remove the specified template
     */
    public function destroy(SellerMarkupTemplate $markupTemplate)
    {
        // Check if template is in use
        if ($markupTemplate->sellers()->exists()) {
            return back()->with('error', 'Cannot delete template that is assigned to sellers.');
        }

        $markupTemplate->delete();

        return redirect()->route('admin.markup-templates.index')
            ->with('success', 'Markup template deleted.');
    }
}
