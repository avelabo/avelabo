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

Route::get('/vendor-guide', function () {
    return Inertia::render('Frontend/VendorGuide');
})->name('vendor.guide');

Route::get('/vendor/{id}', function ($id) {
    return Inertia::render('Frontend/VendorDetails1', ['id' => $id]);
})->name('vendor.details');

Route::get('/vendor/{id}/alt', function ($id) {
    return Inertia::render('Frontend/VendorDetails2', ['id' => $id]);
})->name('vendor.details.alt');

Route::get('/forgot-password', function () {
    return Inertia::render('Frontend/ForgotPassword');
})->name('password.forgot');

Route::get('/reset-password', function () {
    return Inertia::render('Frontend/ResetPassword');
})->name('password.reset');

Route::get('/privacy-policy', function () {
    return Inertia::render('Frontend/PrivacyPolicy');
})->name('privacy.policy');

Route::get('/purchase-guide', function () {
    return Inertia::render('Frontend/PurchaseGuide');
})->name('purchase.guide');

Route::get('/invoice/{id?}', function ($id = null) {
    return Inertia::render('Frontend/Invoice', ['id' => $id]);
})->name('invoice');

/*
|--------------------------------------------------------------------------
| Admin Auth Routes (Guest)
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->name('admin.')->group(function () {
    // Auth routes (no auth required)
    Route::get('/login', function () {
        return Inertia::render('Admin/Auth/Login');
    })->name('login');

    Route::post('/login', function () {
        // Handle login - to be implemented with controller
        return redirect()->route('admin.dashboard');
    })->name('login.post');

    Route::get('/register', function () {
        return Inertia::render('Admin/Auth/Register');
    })->name('register');

    Route::post('/register', function () {
        // Handle registration - to be implemented with controller
        return redirect()->route('admin.dashboard');
    })->name('register.post');

    Route::get('/forgot-password', function () {
        return Inertia::render('Admin/Auth/ForgotPassword');
    })->name('password.request');

    Route::post('/logout', function () {
        // Handle logout - to be implemented with controller
        return redirect()->route('admin.login');
    })->name('logout');
});

/*
|--------------------------------------------------------------------------
| Admin Routes (Authenticated)
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    // Products
    Route::get('/products', function () {
        return Inertia::render('Admin/Products/Index');
    })->name('products.index');

    Route::get('/products/grid', function () {
        return Inertia::render('Admin/Products/Grid');
    })->name('products.grid');

    Route::get('/products/create', function () {
        return Inertia::render('Admin/Products/Create');
    })->name('products.create');

    Route::get('/products/{id}', function ($id) {
        return Inertia::render('Admin/Products/Show', ['id' => $id]);
    })->name('products.show');

    Route::get('/products/{id}/edit', function ($id) {
        return Inertia::render('Admin/Products/Edit', ['id' => $id]);
    })->name('products.edit');

    Route::post('/products', function () {
        // Handle store - to be implemented with controller
        return redirect()->route('admin.products.index');
    })->name('products.store');

    Route::put('/products/{id}', function ($id) {
        // Handle update - to be implemented with controller
        return redirect()->route('admin.products.index');
    })->name('products.update');

    Route::delete('/products/{id}', function ($id) {
        // Handle delete - to be implemented with controller
        return redirect()->route('admin.products.index');
    })->name('products.destroy');

    // Categories
    Route::get('/categories', function () {
        return Inertia::render('Admin/Categories/Index');
    })->name('categories.index');

    // Orders
    Route::get('/orders', function () {
        return Inertia::render('Admin/Orders/Index');
    })->name('orders.index');

    Route::get('/orders/{id}', function ($id) {
        return Inertia::render('Admin/Orders/Show', ['id' => $id]);
    })->name('orders.show');

    Route::put('/orders/{id}/status', function ($id) {
        // Handle status update - to be implemented with controller
        return redirect()->route('admin.orders.show', $id);
    })->name('orders.update-status');

    // Sellers
    Route::get('/sellers', function () {
        return Inertia::render('Admin/Sellers/Index');
    })->name('sellers.index');

    Route::get('/sellers/create', function () {
        return Inertia::render('Admin/Sellers/Create');
    })->name('sellers.create');

    Route::get('/sellers/{id}', function ($id) {
        return Inertia::render('Admin/Sellers/Show', ['id' => $id]);
    })->name('sellers.show');

    Route::get('/sellers/{id}/edit', function ($id) {
        return Inertia::render('Admin/Sellers/Edit', ['id' => $id]);
    })->name('sellers.edit');

    Route::post('/sellers', function () {
        // Handle store - to be implemented with controller
        return redirect()->route('admin.sellers.index');
    })->name('sellers.store');

    Route::put('/sellers/{id}', function ($id) {
        // Handle update - to be implemented with controller
        return redirect()->route('admin.sellers.index');
    })->name('sellers.update');

    Route::delete('/sellers/{id}', function ($id) {
        // Handle delete - to be implemented with controller
        return redirect()->route('admin.sellers.index');
    })->name('sellers.destroy');

    // Transactions
    Route::get('/transactions', function () {
        return Inertia::render('Admin/Transactions/Index');
    })->name('transactions.index');

    Route::get('/transactions/{id}', function ($id) {
        return Inertia::render('Admin/Transactions/Show', ['id' => $id]);
    })->name('transactions.show');

    // Brands
    Route::get('/brands', function () {
        return Inertia::render('Admin/Brands/Index');
    })->name('brands.index');

    // Reviews
    Route::get('/reviews', function () {
        return Inertia::render('Admin/Reviews/Index');
    })->name('reviews.index');

    Route::get('/reviews/{id}', function ($id) {
        return Inertia::render('Admin/Reviews/Show', ['id' => $id]);
    })->name('reviews.show');

    Route::delete('/reviews/{id}', function ($id) {
        // Handle delete - to be implemented with controller
        return redirect()->route('admin.reviews.index');
    })->name('reviews.destroy');

    // Settings
    Route::get('/settings', function () {
        return Inertia::render('Admin/Settings/Index');
    })->name('settings');

    Route::put('/settings', function () {
        // Handle settings update - to be implemented with controller
        return redirect()->route('admin.settings');
    })->name('settings.update');
});
