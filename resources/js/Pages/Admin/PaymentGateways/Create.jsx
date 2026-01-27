import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Create() {
    const [logoPreview, setLogoPreview] = useState(null);
    const [configEntries, setConfigEntries] = useState([{ key: '', value: '' }]);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        display_name: '',
        description: '',
        logo: null,
        config: {},
        supported_currencies: '',
        supported_countries: '',
        transaction_fee_percentage: '',
        transaction_fee_fixed: '',
        is_active: true,
        is_test_mode: true,
        sort_order: 0,
    });

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const removeLogo = () => {
        setData('logo', null);
        if (logoPreview) {
            URL.revokeObjectURL(logoPreview);
            setLogoPreview(null);
        }
    };

    const addConfigEntry = () => {
        setConfigEntries([...configEntries, { key: '', value: '' }]);
    };

    const removeConfigEntry = (index) => {
        setConfigEntries(configEntries.filter((_, i) => i !== index));
    };

    const updateConfigEntry = (index, field, value) => {
        const updated = [...configEntries];
        updated[index][field] = value;
        setConfigEntries(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const configObject = {};
        configEntries.forEach((entry) => {
            if (entry.key.trim()) {
                configObject[entry.key.trim()] = entry.value;
            }
        });

        const supported_currencies = data.supported_currencies
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        const supported_countries = data.supported_countries
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        const submitData = {
            ...data,
            config: configObject,
            supported_currencies,
            supported_countries,
        };

        Object.keys(submitData).forEach((key) => setData(key, submitData[key]));

        post(route('admin.payment-gateways.store'), {
            forceFormData: true,
        });
    };

    const inputClass = (field) =>
        `w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand ${errors[field] ? 'ring-2 ring-red-500' : ''}`;

    return (
        <AdminLayout>
            <Head title="Add Payment Gateway" />

            <div className="max-w-3xl mx-auto">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-heading dark:text-white">Add Payment Gateway</h2>
                        <p className="text-body">Configure a new payment gateway</p>
                    </div>
                    <Link
                        href={route('admin.payment-gateways.index')}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-heading rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2"
                    >
                        <span className="material-icons text-lg">arrow_back</span>
                        Back
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Gateway Details */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Gateway Details</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-1.5">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={inputClass('name')}
                                    placeholder="e.g. paychangu"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-1.5">
                                    Display Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.display_name}
                                    onChange={(e) => setData('display_name', e.target.value)}
                                    className={inputClass('display_name')}
                                    placeholder="e.g. PayChangu"
                                />
                                {errors.display_name && <p className="text-red-500 text-sm mt-1">{errors.display_name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    placeholder="Brief description of the payment gateway"
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Logo */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Logo</h3>
                        {!logoPreview ? (
                            <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg p-6">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                    id="logo"
                                />
                                <label
                                    htmlFor="logo"
                                    className="flex flex-col items-center justify-center cursor-pointer"
                                >
                                    <span className="material-icons text-5xl text-gray-400 mb-3">cloud_upload</span>
                                    <p className="text-sm text-body mb-1">Click to upload</p>
                                    <p className="text-xs text-body">PNG, JPG, WEBP, SVG up to 2MB</p>
                                </label>
                            </div>
                        ) : (
                            <div className="relative inline-block">
                                <img
                                    src={logoPreview}
                                    alt="Preview"
                                    className="w-40 h-40 object-contain rounded-lg bg-white p-2"
                                />
                                <button
                                    type="button"
                                    onClick={removeLogo}
                                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600"
                                >
                                    <span className="material-icons text-sm">close</span>
                                </button>
                            </div>
                        )}
                        {errors.logo && <p className="mt-2 text-sm text-red-500">{errors.logo}</p>}
                    </div>

                    {/* API Configuration */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-heading dark:text-white">API Configuration</h3>
                            <button
                                type="button"
                                onClick={addConfigEntry}
                                className="px-3 py-1.5 bg-brand/10 text-brand rounded-lg text-sm font-medium hover:bg-brand/20 transition-colors inline-flex items-center gap-1"
                            >
                                <span className="material-icons text-sm">add</span>
                                Add Field
                            </button>
                        </div>
                        <div className="space-y-3">
                            {configEntries.map((entry, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={entry.key}
                                        onChange={(e) => updateConfigEntry(index, 'key', e.target.value)}
                                        className="w-1/3 px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                        placeholder="Key (e.g. api_key)"
                                    />
                                    <input
                                        type="text"
                                        value={entry.value}
                                        onChange={(e) => updateConfigEntry(index, 'value', e.target.value)}
                                        className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                        placeholder="Value"
                                    />
                                    {configEntries.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeConfigEntry(index)}
                                            className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                                        >
                                            <span className="material-icons text-lg">delete</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {errors.config && <p className="text-red-500 text-sm mt-1">{errors.config}</p>}
                    </div>

                    {/* Supported Regions */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Supported Regions</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-1.5">
                                    Supported Currencies
                                </label>
                                <input
                                    type="text"
                                    value={data.supported_currencies}
                                    onChange={(e) => setData('supported_currencies', e.target.value)}
                                    className={inputClass('supported_currencies')}
                                    placeholder="MWK, ZAR, USD"
                                />
                                <p className="text-xs text-body mt-1">Comma-separated currency codes</p>
                                {errors.supported_currencies && <p className="text-red-500 text-sm mt-1">{errors.supported_currencies}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-1.5">
                                    Supported Countries
                                </label>
                                <input
                                    type="text"
                                    value={data.supported_countries}
                                    onChange={(e) => setData('supported_countries', e.target.value)}
                                    className={inputClass('supported_countries')}
                                    placeholder="MW, ZA"
                                />
                                <p className="text-xs text-body mt-1">Comma-separated country codes</p>
                                {errors.supported_countries && <p className="text-red-500 text-sm mt-1">{errors.supported_countries}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Fees */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Fees</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-1.5">
                                    Transaction Fee (%)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.transaction_fee_percentage}
                                    onChange={(e) => setData('transaction_fee_percentage', e.target.value)}
                                    className={inputClass('transaction_fee_percentage')}
                                    placeholder="0.00"
                                />
                                {errors.transaction_fee_percentage && <p className="text-red-500 text-sm mt-1">{errors.transaction_fee_percentage}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-heading dark:text-white mb-1.5">
                                    Transaction Fee (Fixed)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.transaction_fee_fixed}
                                    onChange={(e) => setData('transaction_fee_fixed', e.target.value)}
                                    className={inputClass('transaction_fee_fixed')}
                                    placeholder="0.00"
                                />
                                {errors.transaction_fee_fixed && <p className="text-red-500 text-sm mt-1">{errors.transaction_fee_fixed}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-card p-6">
                        <h3 className="text-lg font-semibold text-heading dark:text-white mb-4">Status</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand"
                                />
                                <label htmlFor="is_active" className="text-sm text-heading dark:text-white">
                                    Active (available for use on checkout)
                                </label>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_test_mode"
                                    checked={data.is_test_mode}
                                    onChange={(e) => setData('is_test_mode', e.target.checked)}
                                    className="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand"
                                />
                                <label htmlFor="is_test_mode" className="text-sm text-heading dark:text-white">
                                    Test Mode (use sandbox/test credentials)
                                </label>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-heading dark:text-white mb-1.5">
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', e.target.value)}
                                    className="w-32 px-4 py-2.5 bg-gray-100 dark:bg-dark-body border-0 rounded-lg text-sm focus:ring-2 focus:ring-brand"
                                    placeholder="0"
                                />
                                {errors.sort_order && <p className="text-red-500 text-sm mt-1">{errors.sort_order}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end gap-4">
                        <Link
                            href={route('admin.payment-gateways.index')}
                            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-heading rounded-lg font-medium text-sm transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                        >
                            {processing && <span className="material-icons animate-spin text-lg">sync</span>}
                            Create Gateway
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
