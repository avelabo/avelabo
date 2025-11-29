import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Index() {
    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const products = [
        { id: 1, name: 'Seeds of Change Organic Quinoa', price: '$34.50', status: 'Active', date: '02.11.2021', image: '/images/admin/items/1.jpg' },
        { id: 2, name: 'All Natural Italian-Style Chicken', price: '$990.99', status: 'Active', date: '02.11.2021', image: '/images/admin/items/2.jpg' },
        { id: 3, name: 'Gortons Beer Battered Fish Fillets', price: '$76.99', status: 'Archived', date: '02.11.2021', image: '/images/admin/items/3.jpg' },
        { id: 4, name: 'Foster Farms Takeout Crispy Classic Buffalo', price: '$18.00', status: 'Active', date: '02.11.2021', image: '/images/admin/items/4.jpg' },
        { id: 5, name: 'Blue Diamond Almonds Lightly Salted', price: '$76.99', status: 'Disabled', date: '02.11.2021', image: '/images/admin/items/5.jpg' },
        { id: 6, name: 'Chobani Complete Vanilla Greek Yogurt', price: '$18.00', status: 'Archived', date: '02.11.2021', image: '/images/admin/items/6.jpg' },
        { id: 7, name: 'Canada Dry Ginger Ale 2 L Bottle', price: '$76.99', status: 'Active', date: '02.11.2021', image: '/images/admin/items/7.jpg' },
        { id: 8, name: 'Haagen-Dazs Caramel Cone Ice', price: '$180.99', status: 'Active', date: '02.11.2021', image: '/images/admin/items/8.jpg' },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            Active: 'badge-soft-success',
            Archived: 'badge-soft-warning',
            Disabled: 'badge-soft-danger',
        };
        return styles[status] || 'badge-soft-primary';
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(products.map(p => p.id));
        }
        setSelectAll(!selectAll);
    };

    const toggleItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    return (
        <AdminLayout>
            <Head title="Products List" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-heading dark:text-white">Products List</h2>
                        <p className="text-body">Manage your product inventory</p>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                        <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-heading rounded-lg font-medium text-sm transition-colors">
                            Export
                        </button>
                        <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-heading rounded-lg font-medium text-sm transition-colors">
                            Import
                        </button>
                        <Link
                            href="/admin/products/create"
                            className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors"
                        >
                            Create new
                        </Link>
                    </div>
                </div>

                {/* Filters Card */}
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-card">
                    <div className="p-5 border-b dark:border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            <div className="md:col-span-1 flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand"
                                />
                            </div>
                            <div className="md:col-span-5">
                                <select className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand">
                                    <option>All category</option>
                                    <option>Electronics</option>
                                    <option>Clothes</option>
                                    <option>Automobile</option>
                                </select>
                            </div>
                            <div className="md:col-span-3">
                                <input
                                    type="date"
                                    defaultValue="2021-05-02"
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                />
                            </div>
                            <div className="md:col-span-3">
                                <select className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand">
                                    <option>Status</option>
                                    <option>Active</option>
                                    <option>Disabled</option>
                                    <option>Show all</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Products List */}
                    <div className="p-5">
                        <div className="space-y-0 divide-y dark:divide-white/10">
                            {products.map((product) => (
                                <div key={product.id} className="flex items-center py-4">
                                    <div className="w-12 flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(product.id)}
                                            onChange={() => toggleItem(product.id)}
                                            className="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Link href={`/admin/products/${product.id}`} className="flex items-center gap-3">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-16 h-16 object-cover rounded border border-gray-200 dark:border-white/10"
                                            />
                                            <h6 className="text-sm font-medium text-heading dark:text-white hover:text-brand">
                                                {product.name}
                                            </h6>
                                        </Link>
                                    </div>
                                    <div className="w-24 text-sm text-body">{product.price}</div>
                                    <div className="w-32">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(product.status)}`}>
                                            {product.status}
                                        </span>
                                    </div>
                                    <div className="w-32 text-sm text-body">{product.date}</div>
                                    <div className="w-48 flex gap-2 justify-end">
                                        <Link
                                            href={`/admin/products/${product.id}/edit`}
                                            className="px-3 py-1.5 bg-brand hover:bg-brand-dark text-white rounded text-xs font-medium flex items-center gap-1"
                                        >
                                            <span className="material-icons text-sm">edit</span>
                                            Edit
                                        </Link>
                                        <button className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-heading rounded text-xs font-medium flex items-center gap-1">
                                            <span className="material-icons text-sm">delete_forever</span>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-start">
                    <nav className="flex items-center gap-1">
                        <button className="px-3 py-2 bg-brand text-white rounded text-sm font-medium">01</button>
                        <button className="px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 text-body rounded text-sm font-medium hover:bg-gray-50">02</button>
                        <button className="px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 text-body rounded text-sm font-medium hover:bg-gray-50">03</button>
                        <span className="px-3 py-2 text-body text-sm">...</span>
                        <button className="px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 text-body rounded text-sm font-medium hover:bg-gray-50">16</button>
                        <button className="px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 text-body rounded text-sm font-medium hover:bg-gray-50">
                            <span className="material-icons text-sm">chevron_right</span>
                        </button>
                    </nav>
                </div>
            </div>
        </AdminLayout>
    );
}
