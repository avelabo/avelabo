<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $content = view('sitemap.index', [
            'products' => Product::where('status', 'active')
                ->select('slug', 'updated_at')
                ->orderBy('updated_at', 'desc')
                ->get(),
            'categories' => Category::where('is_active', true)
                ->select('slug', 'updated_at')
                ->get(),
            'brands' => Brand::where('is_active', true)
                ->select('slug', 'updated_at')
                ->get(),
        ]);

        return response($content)
            ->header('Content-Type', 'application/xml');
    }
}
