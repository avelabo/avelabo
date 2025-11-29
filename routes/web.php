<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Seller\SellerRegistrationController;
use App\Http\Controllers\Seller\DashboardController as SellerDashboardController;
use App\Http\Controllers\Seller\ProductController as SellerProductController;
use App\Http\Controllers\Seller\OrderController as SellerOrderController;
use App\Http\Controllers\Admin\KycController;
use App\Http\Controllers\Admin\SellerController as AdminSellerController;
use App\Http\Controllers\Admin\MarkupTemplateController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Frontend Routes (Public)
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

Route::get('/vendor-guide', function () {
    return Inertia::render('Frontend/VendorGuide');
})->name('vendor.guide');

Route::get('/vendor/{id}', function ($id) {
    return Inertia::render('Frontend/VendorDetails1', ['id' => $id]);
})->name('vendor.details');

Route::get('/privacy-policy', function () {
    return Inertia::render('Frontend/PrivacyPolicy');
})->name('privacy.policy');

Route::get('/purchase-guide', function () {
    return Inertia::render('Frontend/PurchaseGuide');
})->name('purchase.guide');

/*
|--------------------------------------------------------------------------
| Authentication Routes (Guest)
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::get('/verify-email', EmailVerificationPromptController::class)->name('verification.notice');
});

/*
|--------------------------------------------------------------------------
| Customer Routes (Authenticated)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/checkout', function () {
        return Inertia::render('Frontend/Checkout');
    })->name('checkout');

    Route::get('/account', function () {
        return Inertia::render('Frontend/Account');
    })->name('account');

    Route::get('/invoice/{id?}', function ($id = null) {
        return Inertia::render('Frontend/Invoice', ['id' => $id]);
    })->name('invoice');
});

/*
|--------------------------------------------------------------------------
| Seller Routes
|--------------------------------------------------------------------------
*/

Route::prefix('seller')->name('seller.')->group(function () {
    // Seller Registration (authenticated users who aren't sellers yet)
    Route::middleware('auth')->group(function () {
        Route::get('/register', [SellerRegistrationController::class, 'create'])->name('register');
        Route::post('/register', [SellerRegistrationController::class, 'store'])->name('register.store');
        Route::get('/kyc', [SellerRegistrationController::class, 'showKycForm'])->name('kyc.create');
        Route::post('/kyc', [SellerRegistrationController::class, 'storeKyc'])->name('kyc.store');
        Route::get('/kyc/status', [SellerRegistrationController::class, 'kycStatus'])->name('kyc.status');
    });

    // Protected Seller Routes (approved sellers only)
    Route::middleware(['auth', 'seller'])->group(function () {
        // Dashboard
        Route::get('/', [SellerDashboardController::class, 'index'])->name('dashboard');

        // Products
        Route::resource('products', SellerProductController::class);

        // Orders
        Route::get('/orders', [SellerOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [SellerOrderController::class, 'show'])->name('orders.show');
        Route::patch('/orders/{order}/status', [SellerOrderController::class, 'updateStatus'])->name('orders.update-status');

        // Profile & Settings
        Route::get('/profile', function () {
            return Inertia::render('Seller/Profile');
        })->name('profile');

        Route::get('/settings', function () {
            return Inertia::render('Seller/Settings');
        })->name('settings');
    });
});

/*
|--------------------------------------------------------------------------
| Admin Auth Routes (Guest)
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('/login', function () {
            return Inertia::render('Admin/Auth/Login');
        })->name('login');

        Route::get('/register', function () {
            return Inertia::render('Admin/Auth/Register');
        })->name('register');

        Route::get('/forgot-password', function () {
            return Inertia::render('Admin/Auth/ForgotPassword');
        })->name('password.request');
    });

    Route::post('/logout', function () {
        auth()->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
        return redirect()->route('admin.login');
    })->name('logout');
});

/*
|--------------------------------------------------------------------------
| Admin Routes (Authenticated & Admin Role)
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    // Dashboard
    Route::get('/', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    // KYC Management
    Route::get('/kyc', [KycController::class, 'index'])->name('kyc.index');
    Route::get('/kyc/{kyc}', [KycController::class, 'show'])->name('kyc.show');
    Route::post('/kyc/{kyc}/approve', [KycController::class, 'approve'])->name('kyc.approve');
    Route::post('/kyc/{kyc}/reject', [KycController::class, 'reject'])->name('kyc.reject');
    Route::post('/kyc/{kyc}/request-documents', [KycController::class, 'requestDocuments'])->name('kyc.request-documents');

    // Sellers
    Route::get('/sellers', [AdminSellerController::class, 'index'])->name('sellers.index');
    Route::get('/sellers/{seller}', [AdminSellerController::class, 'show'])->name('sellers.show');
    Route::put('/sellers/{seller}', [AdminSellerController::class, 'update'])->name('sellers.update');
    Route::patch('/sellers/{seller}/status', [AdminSellerController::class, 'updateStatus'])->name('sellers.update-status');
    Route::post('/sellers/{seller}/apply-markup-template', [AdminSellerController::class, 'applyMarkupTemplate'])->name('sellers.apply-markup-template');
    Route::post('/sellers/{seller}/custom-markup', [AdminSellerController::class, 'setCustomMarkup'])->name('sellers.custom-markup');

    // Markup Templates
    Route::resource('markup-templates', MarkupTemplateController::class);

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

    // Settings
    Route::get('/settings', function () {
        return Inertia::render('Admin/Settings/Index');
    })->name('settings');
});
