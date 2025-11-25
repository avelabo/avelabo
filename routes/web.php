<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Frontend Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Frontend/Home');
})->name('home');

Route::get('/shop', function () {
    return Inertia::render('Frontend/Shop');
})->name('shop');

Route::get('/product/{slug}', function ($slug) {
    return Inertia::render('Frontend/ProductDetail', ['slug' => $slug]);
})->name('product.detail');

Route::get('/cart', function () {
    return Inertia::render('Frontend/Cart');
})->name('cart');

Route::get('/checkout', function () {
    return Inertia::render('Frontend/Checkout');
})->name('checkout');

Route::get('/wishlist', function () {
    return Inertia::render('Frontend/Wishlist');
})->name('wishlist');

Route::get('/compare', function () {
    return Inertia::render('Frontend/Compare');
})->name('compare');

Route::get('/about', function () {
    return Inertia::render('Frontend/About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Frontend/Contact');
})->name('contact');

Route::get('/blog', function () {
    return Inertia::render('Frontend/Blog');
})->name('blog');

Route::get('/vendors', function () {
    return Inertia::render('Frontend/Vendors');
})->name('vendors');

Route::get('/account', function () {
    return Inertia::render('Frontend/Account');
})->name('account');

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    Route::get('/products', function () {
        return Inertia::render('Admin/Products/Index');
    })->name('products.index');

    Route::get('/products/create', function () {
        return Inertia::render('Admin/Products/Create');
    })->name('products.create');

    Route::get('/categories', function () {
        return Inertia::render('Admin/Categories/Index');
    })->name('categories.index');

    Route::get('/orders', function () {
        return Inertia::render('Admin/Orders/Index');
    })->name('orders.index');

    Route::get('/orders/{id}', function ($id) {
        return Inertia::render('Admin/Orders/Show', ['id' => $id]);
    })->name('orders.show');

    Route::get('/sellers', function () {
        return Inertia::render('Admin/Sellers/Index');
    })->name('sellers.index');

    Route::get('/transactions', function () {
        return Inertia::render('Admin/Transactions/Index');
    })->name('transactions.index');

    Route::get('/brands', function () {
        return Inertia::render('Admin/Brands/Index');
    })->name('brands.index');

    Route::get('/reviews', function () {
        return Inertia::render('Admin/Reviews/Index');
    })->name('reviews.index');

    Route::get('/settings', function () {
        return Inertia::render('Admin/Settings');
    })->name('settings');
});
