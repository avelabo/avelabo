import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Index({ currencies, exchangeRates, filters, stats }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [showModal, setShowModal] = useState(false);
    const [editingCurrency, setEditingCurrency] = useState(null);
    const [form, setForm] = useState({ name: '', code: '', symbol: '', decimal_places: 2, symbol_before: true, is_active: true });
    const [editingRate, setEditingRate] = useState(null);
    const [rateForm, setRateForm] = useState({ rate: '', markup_percentage: '' });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.currencies.index'), { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingCurrency(null);
        setForm({ name: '', code: '', symbol: '', decimal_places: 2, symbol_before: true, is_active: true });
        setShowModal(true);
    };

    const openEditModal = (currency) => {
        setEditingCurrency(currency);
        setForm({
            name: currency.name,
            code: currency.code,
            symbol: currency.symbol,
            decimal_places: currency.decimal_places,
            symbol_before: currency.symbol_before,
            is_active: currency.is_active,
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCurrency) {
            router.put(route('admin.currencies.update', editingCurrency.id), form, {
                onSuccess: () => setShowModal(false),
            });
        } else {
            router.post(route('admin.currencies.store'), form, {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const handleDelete = (currency) => {
        if (confirm(`Are you sure you want to delete "${currency.name}"?`)) {
            router.delete(route('admin.currencies.destroy', currency.id));
        }
    };

    const toggleStatus = (currency) => {
        router.patch(route('admin.currencies.toggle-status', currency.id));
    };

    const setDefault = (currency) => {
        router.patch(route('admin.currencies.set-default', currency.id));
    };

    const startEditRate = (rate) => {
        setEditingRate(rate.id);
        setRateForm({ rate: rate.rate, markup_percentage: rate.markup_percentage });
    };

    const saveRate = (rateId) => {
        router.put(route('admin.exchange-rates.update', rateId), rateForm, {
            onSuccess: () => setEditingRate(null),
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Currencies" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-heading dark:text-white">Currencies</h2>
                        <p className="text-body">Manage currencies and exchange rates</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2 mt-4 md:mt-0"
                    >
                        <span className="material-icons text-lg">add</span>
                        Add Currency
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-body">Total Currencies</p>
                        <p className="text-2xl font-bold text-heading dark:text-white">{stats?.total || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-green-600">Active</p>
                        <p className="text-2xl font-bold text-green-600">{stats?.active || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card">
                        <p className="text-sm text-body">Default</p>
                        <p className="text-2xl font-bold text-brand">{stats?.default || 'None'}</p>
                    </div>
                </div>

                {/* Currencies Table */}
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-card">
                    <div className="p-5 border-b dark:border-white/10">
                        <form onSubmit={handleSearch} className="max-w-md">
                            <div className="relative">
                                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                <input
                                    type="text"
                                    placeholder="Search currencies..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </form>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-dark-body">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Decimals</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-white/10">
                                {currencies?.data?.length > 0 ? (
                                    currencies.data.map((currency) => (
                                        <tr key={currency.id} className="hover:bg-gray-50 dark:hover:bg-dark-body/50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-heading dark:text-white">{currency.name}</p>
                                                    <p className="text-sm text-body">{currency.code}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-heading dark:text-white">
                                                {currency.symbol} ({currency.symbol_before ? 'Before' : 'After'})
                                            </td>
                                            <td className="px-6 py-4 text-sm text-body">{currency.decimal_places}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleStatus(currency)}
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        currency.is_active
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    {currency.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                {currency.is_default ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand/10 text-brand">
                                                        Default
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => setDefault(currency)}
                                                        className="text-sm text-body hover:text-brand"
                                                    >
                                                        Set as default
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(currency)}
                                                        className="p-2 text-gray-500 hover:text-brand hover:bg-gray-100 dark:hover:bg-dark-body rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <span className="material-icons text-lg">edit</span>
                                                    </button>
                                                    {!currency.is_default && (
                                                        <button
                                                            onClick={() => handleDelete(currency)}
                                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <span className="material-icons text-lg">delete</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <span className="material-icons text-5xl text-gray-300 mb-4">currency_exchange</span>
                                            <h3 className="text-lg font-medium text-heading dark:text-white mb-2">No currencies found</h3>
                                            <p className="text-body mb-6">Get started by creating your first currency.</p>
                                            <button
                                                onClick={openCreateModal}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors"
                                            >
                                                <span className="material-icons text-lg">add</span>
                                                Add Currency
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {currencies?.last_page > 1 && (
                        <div className="px-6 py-4 border-t dark:border-white/10">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-body">
                                    Showing {currencies.from} to {currencies.to} of {currencies.total} currencies
                                </p>
                                <div className="flex gap-2">
                                    {currencies.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url)}
                                            className={`px-3 py-1.5 rounded text-sm ${
                                                link.active
                                                    ? 'bg-brand text-white'
                                                    : link.url
                                                    ? 'bg-gray-100 dark:bg-dark-body text-body hover:bg-gray-200'
                                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            disabled={!link.url}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Exchange Rates Section */}
                {exchangeRates?.length > 0 && (
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card">
                        <div className="p-5 border-b dark:border-white/10">
                            <h3 className="text-lg font-semibold text-heading dark:text-white">Exchange Rates</h3>
                            <p className="text-sm text-body">Manage currency conversion rates and markup percentages</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-dark-body">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Markup %</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Rate</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Fetched</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y dark:divide-white/10">
                                    {exchangeRates.map((rate) => (
                                        <tr key={rate.id} className="hover:bg-gray-50 dark:hover:bg-dark-body/50">
                                            <td className="px-6 py-4 text-sm font-medium text-heading dark:text-white">
                                                {rate.from_currency?.code}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-heading dark:text-white">
                                                {rate.to_currency?.code}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {editingRate === rate.id ? (
                                                    <input
                                                        type="number"
                                                        step="0.00000001"
                                                        className="w-32 px-2 py-1 bg-gray-100 dark:bg-dark-body border-0 rounded text-sm focus:ring-2 focus:ring-brand"
                                                        value={rateForm.rate}
                                                        onChange={(e) => setRateForm({ ...rateForm, rate: e.target.value })}
                                                    />
                                                ) : (
                                                    <span className="text-body">{parseFloat(rate.rate).toFixed(4)}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {editingRate === rate.id ? (
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        className="w-24 px-2 py-1 bg-gray-100 dark:bg-dark-body border-0 rounded text-sm focus:ring-2 focus:ring-brand"
                                                        value={rateForm.markup_percentage}
                                                        onChange={(e) => setRateForm({ ...rateForm, markup_percentage: e.target.value })}
                                                    />
                                                ) : (
                                                    <span className="text-body">{parseFloat(rate.markup_percentage).toFixed(2)}%</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-heading dark:text-white">
                                                {(parseFloat(rate.rate) * (1 + parseFloat(rate.markup_percentage) / 100)).toFixed(4)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-body">
                                                {rate.fetched_at ? new Date(rate.fetched_at).toLocaleDateString() : 'Manual'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {editingRate === rate.id ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => saveRate(rate.id)}
                                                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                            title="Save"
                                                        >
                                                            <span className="material-icons text-lg">check</span>
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingRate(null)}
                                                            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-body rounded-lg transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <span className="material-icons text-lg">close</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => startEditRate(rate)}
                                                        className="p-2 text-gray-500 hover:text-brand hover:bg-gray-100 dark:hover:bg-dark-body rounded-lg transition-colors"
                                                        title="Edit rate"
                                                    >
                                                        <span className="material-icons text-lg">edit</span>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Currency Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white dark:bg-dark-card rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-5 border-b dark:border-white/10">
                            <h3 className="text-lg font-semibold text-heading dark:text-white">
                                {editingCurrency ? 'Edit Currency' : 'Add Currency'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Malawian Kwacha"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-1">Code</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand uppercase"
                                        value={form.code}
                                        onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                        placeholder="MWK"
                                        maxLength={10}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-1">Symbol</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                        value={form.symbol}
                                        onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                                        placeholder="MK"
                                        maxLength={10}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-heading dark:text-white mb-1">Decimal Places</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="8"
                                        className="w-full px-3 py-2 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                        value={form.decimal_places}
                                        onChange={(e) => setForm({ ...form, decimal_places: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className="flex items-end gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="rounded text-brand focus:ring-brand"
                                            checked={form.symbol_before}
                                            onChange={(e) => setForm({ ...form, symbol_before: e.target.checked })}
                                        />
                                        <span className="text-sm text-heading dark:text-white">Symbol before</span>
                                    </label>
                                </div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="rounded text-brand focus:ring-brand"
                                    checked={form.is_active}
                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                />
                                <span className="text-sm text-heading dark:text-white">Active</span>
                            </label>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-body hover:text-heading rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors"
                                >
                                    {editingCurrency ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
