# HTML to React/Inertia Conversion Guide

This guide provides comprehensive instructions for converting the original Nest HTML templates to React components for use with Laravel + Inertia.js.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Conversion Process](#conversion-process)
3. [HTML to JSX Rules](#html-to-jsx-rules)
4. [Component Patterns](#component-patterns)
5. [Tailwind CSS Classes](#tailwind-css-classes)
6. [Frontend Pages](#frontend-pages)
7. [Admin Pages](#admin-pages)
8. [Common Components](#common-components)
9. [Icons & Assets](#icons--assets)
10. [Best Practices](#best-practices)

---

## Project Structure

```
avelabo/
├── resources/
│   ├── js/
│   │   ├── app.jsx                    # Main entry point
│   │   ├── Components/
│   │   │   ├── Frontend/              # Frontend components
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── MobileMenu.jsx
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── HeroSlider.jsx
│   │   │   │   └── CategorySlider.jsx
│   │   │   └── Admin/                 # Admin components
│   │   │       ├── Sidebar.jsx
│   │   │       ├── AdminHeader.jsx
│   │   │       ├── StatCard.jsx
│   │   │       └── SalesChart.jsx
│   │   ├── Layouts/
│   │   │   ├── FrontendLayout.jsx     # Frontend wrapper
│   │   │   └── AdminLayout.jsx        # Admin wrapper
│   │   └── Pages/
│   │       ├── Frontend/              # Frontend pages
│   │       │   ├── Home.jsx
│   │       │   ├── Shop.jsx
│   │       │   ├── ProductDetail.jsx
│   │       │   └── ...
│   │       └── Admin/                 # Admin pages
│   │           ├── Dashboard.jsx
│   │           ├── Products/
│   │           ├── Orders/
│   │           └── ...
│   └── css/
│       └── app.css                    # Global styles + Tailwind
├── public/
│   └── images/
│       ├── frontend/                  # Frontend images
│       └── admin/                     # Admin images
└── routes/
    └── web.php                        # All routes
```

---

## Conversion Process

### Step 1: Identify the HTML Page

Locate the HTML file you want to convert in:
- Frontend: `nest-tailwind/` directory
- Admin: `nest-admin-tailwind/` directory

### Step 2: Create the React Component

1. Create a new `.jsx` file in the appropriate directory
2. Import required dependencies
3. Convert HTML to JSX following the rules below

### Step 3: Basic Component Template

```jsx
import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
// OR for admin:
// import AdminLayout from '@/Layouts/AdminLayout';

export default function PageName({ propName }) {
    return (
        <FrontendLayout>
            <Head title="Page Title" />

            {/* Your converted HTML goes here */}
            <div className="container mx-auto px-4">
                {/* Content */}
            </div>
        </FrontendLayout>
    );
}
```

### Step 4: Add Route

Add the route to `routes/web.php`:

```php
Route::get('/page-url', function () {
    return Inertia::render('Frontend/PageName', [
        'propName' => $value,
    ]);
})->name('page.name');
```

---

## HTML to JSX Rules

### 1. Class to className

```html
<!-- HTML -->
<div class="container">

<!-- JSX -->
<div className="container">
```

### 2. Self-Closing Tags

```html
<!-- HTML -->
<img src="image.jpg">
<input type="text">
<br>

<!-- JSX -->
<img src="image.jpg" />
<input type="text" />
<br />
```

### 3. Style Attribute

```html
<!-- HTML -->
<div style="background-color: red; font-size: 14px;">

<!-- JSX -->
<div style={{ backgroundColor: 'red', fontSize: '14px' }}>
```

### 4. Event Handlers

```html
<!-- HTML -->
<button onclick="handleClick()">

<!-- JSX -->
<button onClick={handleClick}>
// OR
<button onClick={() => handleClick()}>
```

### 5. For to htmlFor

```html
<!-- HTML -->
<label for="input-id">

<!-- JSX -->
<label htmlFor="input-id">
```

### 6. Comments

```html
<!-- HTML comment -->

{/* JSX comment */}
```

### 7. Conditional Rendering

```html
<!-- HTML (show/hide with class) -->
<div class="menu hidden">

<!-- JSX -->
{isMenuOpen && (
    <div className="menu">
)}

// OR with ternary
<div className={`menu ${isMenuOpen ? '' : 'hidden'}`}>
```

### 8. Lists/Loops

```html
<!-- HTML -->
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>

<!-- JSX -->
<ul>
    {items.map((item, index) => (
        <li key={index}>{item}</li>
    ))}
</ul>
```

### 9. Links

```html
<!-- HTML -->
<a href="/page">Link</a>

<!-- JSX (with Inertia) -->
import { Link } from '@inertiajs/react';
<Link href="/page">Link</Link>
```

---

## Component Patterns

### Reusable Component with Props

```jsx
// Components/Frontend/ProductCard.jsx
export default function ProductCard({ product }) {
    const { name, price, image, rating } = product;

    return (
        <div className="product-card">
            <img src={image} alt={name} />
            <h3>{name}</h3>
            <span>${price}</span>
        </div>
    );
}

// Usage in a page
import ProductCard from '@/Components/Frontend/ProductCard';

{products.map(product => (
    <ProductCard key={product.id} product={product} />
))}
```

### Component with State

```jsx
import { useState } from 'react';

export default function Dropdown() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="dropdown">
            <button onClick={() => setIsOpen(!isOpen)}>
                Toggle
            </button>
            {isOpen && (
                <div className="dropdown-menu">
                    {/* Menu items */}
                </div>
            )}
        </div>
    );
}
```

### Component with Effects

```jsx
import { useState, useEffect } from 'react';

export default function StickyHeader() {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={isSticky ? 'sticky' : ''}>
            {/* Header content */}
        </header>
    );
}
```

---

## Tailwind CSS Classes

### Common Class Mappings

| Original CSS | Tailwind Equivalent |
|-------------|---------------------|
| `margin: 20px` | `m-5` |
| `padding: 20px` | `p-5` |
| `display: flex` | `flex` |
| `justify-content: space-between` | `justify-between` |
| `align-items: center` | `items-center` |
| `background-color: #3BB77E` | `bg-brand` |
| `color: #253D4E` | `text-heading` |
| `font-weight: bold` | `font-bold` |
| `border-radius: 10px` | `rounded-xl` |
| `box-shadow: ...` | `shadow-card` |

### Custom Theme Colors

```jsx
// Brand colors
className="bg-brand"        // #3BB77E
className="bg-brand-dark"   // #29A56C
className="bg-brand-light"  // #DEF9EC
className="bg-brand-2"      // #FDC040 (accent/yellow)

// Text colors
className="text-heading"    // #253D4E
className="text-body"       // #7E7E7E
className="text-muted"      // #B6B6B6

// Status colors
className="text-success"    // #3BB77E
className="text-warning"    // #FDC040
className="text-danger"     // #FD6E6E
className="text-info"       // #50A5F1
```

---

## Frontend Pages

### Pages to Convert from nest-tailwind/

| HTML File | React Component | Route |
|-----------|-----------------|-------|
| `index.html` | `Pages/Frontend/Home.jsx` | `/` |
| `shop-grid.html` | `Pages/Frontend/Shop.jsx` | `/shop` |
| `shop-product-detail.html` | `Pages/Frontend/ProductDetail.jsx` | `/product/{slug}` |
| `shop-cart.html` | `Pages/Frontend/Cart.jsx` | `/cart` |
| `shop-checkout.html` | `Pages/Frontend/Checkout.jsx` | `/checkout` |
| `shop-wishlist.html` | `Pages/Frontend/Wishlist.jsx` | `/wishlist` |
| `shop-compare.html` | `Pages/Frontend/Compare.jsx` | `/compare` |
| `page-about.html` | `Pages/Frontend/About.jsx` | `/about` |
| `page-contact.html` | `Pages/Frontend/Contact.jsx` | `/contact` |
| `blog-category.html` | `Pages/Frontend/Blog.jsx` | `/blog` |
| `vendors-grid.html` | `Pages/Frontend/Vendors.jsx` | `/vendors` |
| `page-account.html` | `Pages/Frontend/Account.jsx` | `/account` |
| `page-login.html` | `Pages/Frontend/Login.jsx` | `/login` |
| `page-register.html` | `Pages/Frontend/Register.jsx` | `/register` |

### Example: Converting Shop Page

```jsx
// Pages/Frontend/Shop.jsx
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import ProductCard from '@/Components/Frontend/ProductCard';

export default function Shop({ products, categories, filters }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState([0, 1000]);

    return (
        <FrontendLayout>
            <Head title="Shop" />

            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-body hover:text-brand">Home</Link>
                        <span>/</span>
                        <span className="text-heading">Shop</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-64 hidden lg:block">
                        {/* Category Filter */}
                        <div className="mb-6">
                            <h5 className="font-bold text-heading mb-4">Category</h5>
                            <ul className="space-y-2">
                                {categories.map(cat => (
                                    <li key={cat.id}>
                                        <button
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`text-body hover:text-brand ${
                                                selectedCategory === cat.id ? 'text-brand font-medium' : ''
                                            }`}
                                        >
                                            {cat.name} ({cat.count})
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price Filter */}
                        <div className="mb-6">
                            <h5 className="font-bold text-heading mb-4">Price</h5>
                            {/* Price range slider */}
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {/* Sort & View Options */}
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-body">
                                Showing 1-{products.length} of {products.length} results
                            </p>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border rounded-lg px-4 py-2"
                            >
                                <option value="newest">Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="popular">Most Popular</option>
                            </select>
                        </div>

                        {/* Products */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-8 flex justify-center">
                            {/* Pagination component */}
                        </div>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
```

---

## Admin Pages

### Pages to Convert from nest-admin-tailwind/

| HTML File | React Component | Route |
|-----------|-----------------|-------|
| `index.html` | `Pages/Admin/Dashboard.jsx` | `/admin` |
| `page-products-list.html` | `Pages/Admin/Products/Index.jsx` | `/admin/products` |
| `page-form-product-1.html` | `Pages/Admin/Products/Create.jsx` | `/admin/products/create` |
| `page-categories.html` | `Pages/Admin/Categories/Index.jsx` | `/admin/categories` |
| `page-orders-1.html` | `Pages/Admin/Orders/Index.jsx` | `/admin/orders` |
| `page-orders-detail.html` | `Pages/Admin/Orders/Show.jsx` | `/admin/orders/{id}` |
| `page-sellers-list.html` | `Pages/Admin/Sellers/Index.jsx` | `/admin/sellers` |
| `page-transactions.html` | `Pages/Admin/Transactions/Index.jsx` | `/admin/transactions` |
| `page-brands.html` | `Pages/Admin/Brands/Index.jsx` | `/admin/brands` |
| `page-reviews.html` | `Pages/Admin/Reviews/Index.jsx` | `/admin/reviews` |
| `page-settings.html` | `Pages/Admin/Settings.jsx` | `/admin/settings` |
| `page-login.html` | `Pages/Admin/Login.jsx` | `/admin/login` |
| `page-register.html` | `Pages/Admin/Register.jsx` | `/admin/register` |

### Example: Converting Products List

```jsx
// Pages/Admin/Products/Index.jsx
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function ProductsIndex({ products, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedProducts, setSelectedProducts] = useState([]);

    const handleDelete = (id) => {
        if (confirm('Are you sure?')) {
            router.delete(`/admin/products/${id}`);
        }
    };

    const handleBulkDelete = () => {
        if (selectedProducts.length && confirm('Delete selected products?')) {
            router.post('/admin/products/bulk-delete', {
                ids: selectedProducts
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Products" />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-heading">Products</h2>
                <Link
                    href="/admin/products/create"
                    className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark"
                >
                    <span className="material-icons text-sm mr-2">add</span>
                    Add Product
                </Link>
            </div>

            {/* Filters Card */}
            <div className="bg-white rounded-xl shadow-card p-6 mb-6">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 border rounded-lg px-4 py-2"
                    />
                    <select className="border rounded-lg px-4 py-2">
                        <option>All Categories</option>
                        {/* Categories */}
                    </select>
                    <select className="border rounded-lg px-4 py-2">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-card">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedProducts(products.map(p => p.id));
                                            } else {
                                                setSelectedProducts([]);
                                            }
                                        }}
                                    />
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-body uppercase">Product</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-body uppercase">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-body uppercase">Price</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-body uppercase">Stock</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-body uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-body uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.includes(product.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedProducts([...selectedProducts, product.id]);
                                                } else {
                                                    setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                                                }
                                            }}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover" />
                                            <div>
                                                <p className="font-medium text-heading">{product.name}</p>
                                                <p className="text-sm text-body">SKU: {product.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-body">{product.category}</td>
                                    <td className="px-6 py-4 font-medium">${product.price}</td>
                                    <td className="px-6 py-4">{product.stock}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs ${
                                            product.status === 'active'
                                                ? 'badge-soft-success'
                                                : 'badge-soft-danger'
                                        }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Link href={`/admin/products/${product.id}/edit`} className="text-brand hover:text-brand-dark">
                                                <span className="material-icons text-sm">edit</span>
                                            </Link>
                                            <button onClick={() => handleDelete(product.id)} className="text-danger hover:text-red-700">
                                                <span className="material-icons text-sm">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
```

---

## Common Components

### Creating Shared Components

For elements that appear multiple times, create reusable components:

```jsx
// Components/Admin/DataTable.jsx
export default function DataTable({ columns, data, onRowSelect, actions }) {
    return (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} className="px-6 py-4 text-left text-xs font-medium text-body uppercase">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {data.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            {columns.map(col => (
                                <td key={col.key} className="px-6 py-4">
                                    {col.render ? col.render(row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
```

---

## Icons & Assets

### Material Icons

Already configured via Google Fonts CDN. Use as:

```jsx
<span className="material-icons">icon_name</span>
```

Common icons:
- `dashboard`, `inventory_2`, `shopping_cart`, `person`
- `edit`, `delete`, `add`, `search`, `menu`
- `expand_more`, `expand_less`, `close`
- `notifications`, `settings`, `logout`

### Image Paths

```jsx
// Frontend images
src="/images/frontend/shop/product-1-1.jpg"
src="/images/frontend/banner/banner-1.png"
src="/images/frontend/theme/logo.svg"

// Admin images
src="/images/admin/items/1.jpg"
src="/images/admin/people/avatar-1.png"
src="/images/admin/theme/logo.svg"
```

---

## Best Practices

### 1. Keep Components Small

Split large HTML sections into smaller components:

```jsx
// Instead of one huge component
<FrontendLayout>
    <Header />
    <HeroSection />
    <FeaturedCategories />
    <PopularProducts />
    <BannerSection />
    <Footer />
</FrontendLayout>
```

### 2. Use Props for Dynamic Content

```jsx
// Pass data from Laravel to React
// In routes/web.php
Route::get('/shop', function () {
    return Inertia::render('Frontend/Shop', [
        'products' => Product::all(),
        'categories' => Category::all(),
    ]);
});

// In React component
export default function Shop({ products, categories }) {
    // Use props directly
}
```

### 3. Handle Forms with Inertia

```jsx
import { useForm } from '@inertiajs/react';

export default function CreateProduct() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        price: '',
        category_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/products');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={data.name}
                onChange={e => setData('name', e.target.value)}
            />
            {errors.name && <span className="text-danger">{errors.name}</span>}

            <button type="submit" disabled={processing}>
                {processing ? 'Saving...' : 'Save'}
            </button>
        </form>
    );
}
```

### 4. Use Layouts Consistently

Always wrap pages in the appropriate layout:

```jsx
// Frontend pages
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function Page() {
    return (
        <FrontendLayout>
            {/* Content */}
        </FrontendLayout>
    );
}

// Admin pages
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminPage() {
    return (
        <AdminLayout>
            {/* Content */}
        </AdminLayout>
    );
}
```

### 5. Preserve Original Styling

When converting, maintain the exact Tailwind classes from the HTML templates. The custom CSS in `app.css` handles special cases like:
- Product card hover effects
- Badge styles
- Progress bars
- Custom scrollbars

---

## Quick Reference Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run Laravel server
php artisan serve

# Clear caches
php artisan cache:clear
php artisan view:clear
php artisan route:clear
```

---

## Need Help?

1. Check the existing converted components in `resources/js/Components/`
2. Reference the original HTML files in `nest-tailwind/` and `nest-admin-tailwind/`
3. Review the Tailwind configuration in `tailwind.config.js`
4. Check custom CSS in `resources/css/app.css`
