import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function NotificationSettings({ emailSettings = {}, globalSettings = {}, categories = {}, mailProviders = {} }) {
    const [activeCategory, setActiveCategory] = useState('customer');
    const [saving, setSaving] = useState(false);

    const handleToggle = (setting, field) => {
        router.patch(route('admin.notification-settings.toggle', setting.id), {
            field: field,
        }, {
            preserveScroll: true,
        });
    };

    const handleGlobalToggle = (field, value) => {
        setSaving(true);
        router.post(route('admin.notification-settings.update-global'), {
            [field]: value,
        }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    const categoryIcons = {
        customer: 'person',
        seller: 'storefront',
        admin: 'admin_panel_settings',
    };

    const getCategorySettings = (category) => {
        return emailSettings[category] || [];
    };

    return (
        <AdminLayout>
            <Head title="Notification Settings" />

            <section className="content-main p-4 lg:p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-quicksand font-bold text-heading dark:text-white">
                        Notification Settings
                    </h2>
                    <p className="text-body mt-1">Manage email notifications and SMS settings</p>
                </div>

                {/* Global Settings Card */}
                <div className="bg-white dark:bg-dark-card rounded-card border border-gray-100 dark:border-gray-700 mb-6">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-quicksand font-bold text-heading dark:text-white flex items-center gap-2">
                            <span className="material-icons text-brand">tune</span>
                            Global Settings
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {/* Queue Setting */}
                            <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
                                <div className="flex items-center gap-3">
                                    <span className="material-icons text-amber-600 dark:text-amber-400">schedule_send</span>
                                    <div>
                                        <h4 className="font-medium text-heading dark:text-white">Queue Notifications</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Send emails and SMS via queue for better performance
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleGlobalToggle('email_queue_enabled', !globalSettings.email_queue_enabled)}
                                    disabled={saving}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ${
                                        globalSettings.email_queue_enabled ? 'bg-brand' : 'bg-gray-200 dark:bg-gray-600'
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            globalSettings.email_queue_enabled ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email Provider */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-heading dark:text-white">Email Provider</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Select mail service for emails
                                        </p>
                                    </div>
                                    <select
                                        value={globalSettings.mail_provider || 'log'}
                                        onChange={(e) => handleGlobalToggle('mail_provider', e.target.value)}
                                        disabled={saving}
                                        className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:border-brand focus:ring-brand"
                                    >
                                        {Object.entries(mailProviders).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* SMS Provider */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-heading dark:text-white">SMS Provider</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Select gateway for SMS
                                        </p>
                                    </div>
                                    <select
                                        value={globalSettings.sms_provider || 'null'}
                                        onChange={(e) => handleGlobalToggle('sms_provider', e.target.value)}
                                        disabled={saving}
                                        className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:border-brand focus:ring-brand"
                                    >
                                        <option value="null">Disabled (Log Only)</option>
                                        <option value="tnm">TNM Mpamba</option>
                                        <option value="airtel">Airtel Money</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email Settings by Category */}
                <div className="bg-white dark:bg-dark-card rounded-card border border-gray-100 dark:border-gray-700">
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left sidebar navigation */}
                            <aside className="lg:col-span-3 lg:border-r border-gray-200 dark:border-gray-700 lg:pr-8">
                                <nav className="space-y-2">
                                    {Object.entries(categories).map(([key, label]) => (
                                        <button
                                            key={key}
                                            onClick={() => setActiveCategory(key)}
                                            className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                                                activeCategory === key
                                                    ? 'bg-brand text-white'
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-body dark:text-gray-300'
                                            }`}
                                        >
                                            <span className="material-icons text-lg">{categoryIcons[key]}</span>
                                            <div className="flex-1">
                                                <span>{label}</span>
                                                <span className="ml-2 text-xs opacity-75">
                                                    ({getCategorySettings(key).length})
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </nav>

                                {/* Legend */}
                                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <h4 className="text-sm font-medium text-heading dark:text-white mb-3">Legend</h4>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="material-icons text-blue-500 text-sm">email</span>
                                            <span className="text-gray-600 dark:text-gray-400">Email enabled</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-icons text-green-500 text-sm">sms</span>
                                            <span className="text-gray-600 dark:text-gray-400">SMS enabled</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-icons text-red-500 text-sm">priority_high</span>
                                            <span className="text-gray-600 dark:text-gray-400">Critical notification</span>
                                        </div>
                                    </div>
                                </div>
                            </aside>

                            {/* Right content area */}
                            <div className="lg:col-span-9">
                                <div className="space-y-4">
                                    {getCategorySettings(activeCategory).map((setting) => (
                                        <div
                                            key={setting.id}
                                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand/30 transition-colors"
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                                {/* Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium text-heading dark:text-white">
                                                            {setting.name}
                                                        </h4>
                                                        {setting.is_critical && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                                <span className="material-icons text-xs mr-1">priority_high</span>
                                                                Critical
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        {setting.description}
                                                    </p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono">
                                                        {setting.email_type}
                                                    </p>
                                                </div>

                                                {/* Toggles */}
                                                <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                                                    {/* Customer Toggle */}
                                                    {activeCategory === 'customer' && (
                                                        <ToggleSwitch
                                                            label="Customers"
                                                            icon="person"
                                                            enabled={setting.customer_enabled}
                                                            onChange={() => handleToggle(setting, 'customer_enabled')}
                                                        />
                                                    )}

                                                    {/* Seller Toggle */}
                                                    {activeCategory === 'seller' && (
                                                        <ToggleSwitch
                                                            label="Sellers"
                                                            icon="storefront"
                                                            enabled={setting.seller_enabled}
                                                            onChange={() => handleToggle(setting, 'seller_enabled')}
                                                        />
                                                    )}

                                                    {/* Admin Toggle */}
                                                    {activeCategory === 'admin' && (
                                                        <ToggleSwitch
                                                            label="Admins"
                                                            icon="admin_panel_settings"
                                                            enabled={setting.admin_enabled}
                                                            onChange={() => handleToggle(setting, 'admin_enabled')}
                                                        />
                                                    )}

                                                    {/* SMS Toggle */}
                                                    <ToggleSwitch
                                                        label="SMS"
                                                        icon="sms"
                                                        enabled={setting.sms_enabled}
                                                        onChange={() => handleToggle(setting, 'sms_enabled')}
                                                        color="green"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {getCategorySettings(activeCategory).length === 0 && (
                                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                            <span className="material-icons text-4xl mb-2">email</span>
                                            <p>No notification settings in this category</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}

function ToggleSwitch({ label, icon, enabled, onChange, color = 'brand' }) {
    const colorClasses = {
        brand: enabled ? 'bg-brand' : 'bg-gray-200 dark:bg-gray-600',
        green: enabled ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600',
        blue: enabled ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600',
    };

    return (
        <div className="flex items-center gap-2">
            <span className={`material-icons text-sm ${enabled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}`}>
                {icon}
            </span>
            <span className={`text-xs ${enabled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}`}>
                {label}
            </span>
            <button
                type="button"
                onClick={onChange}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ${colorClasses[color]}`}
            >
                <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        enabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                />
            </button>
        </div>
    );
}
