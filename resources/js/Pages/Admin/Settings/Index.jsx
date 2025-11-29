import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Settings() {
    const [activeSection, setActiveSection] = useState('general');
    const [formData, setFormData] = useState({
        homePageTitle: '',
        description: '',
        access: 'all',
        notificationEnabled: true,
        notificationText: '',
        mainCurrency: 'US Dollar',
        supportedCurrencies: 'US dollar',
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    const handleReset = () => {
        setFormData({
            homePageTitle: '',
            description: '',
            access: 'all',
            notificationEnabled: true,
            notificationText: '',
            mainCurrency: 'US Dollar',
            supportedCurrencies: 'US dollar',
        });
    };

    const navigationItems = [
        { id: 'general', label: 'General' },
        { id: 'moderators', label: 'Moderators' },
        { id: 'admin', label: 'Admin account' },
        { id: 'seo', label: 'SEO settings' },
        { id: 'mail', label: 'Mail settings' },
        { id: 'newsletter', label: 'Newsletter' },
    ];

    return (
        <AdminLayout>
            <Head title="Site Settings - Nest Dashboard" />

            {/* Content */}
            <section className="content-main p-4 lg:p-8">
                {/* Page title */}
                <div className="mb-8">
                    <h2 className="text-3xl font-quicksand font-bold text-heading dark:text-white">
                        Site settings
                    </h2>
                </div>

                {/* Settings Card */}
                <div className="bg-white dark:bg-dark-card rounded-card border border-gray-100 dark:border-gray-700">
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left sidebar navigation */}
                            <aside className="lg:col-span-3 lg:border-r border-gray-200 dark:border-gray-700 lg:pr-8">
                                <nav className="space-y-2">
                                    {navigationItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveSection(item.id)}
                                            className={`block w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                                                activeSection === item.id
                                                    ? 'bg-brand text-white'
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-body dark:text-gray-300'
                                            }`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </nav>
                            </aside>

                            {/* Right content area */}
                            <div className="lg:col-span-9">
                                <form className="xl:px-8" onSubmit={handleSubmit}>
                                    {/* Website name section */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
                                        <div className="md:col-span-5">
                                            <h5 className="text-lg font-quicksand font-bold text-heading dark:text-white mb-2">
                                                Website name
                                            </h5>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Supported languages of all pages including each product lorem ipsum dolor sit amet, consectetur adipisicing
                                            </p>
                                        </div>
                                        <div className="md:col-span-7">
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                    Home page title
                                                </label>
                                                <input
                                                    type="text"
                                                    name="homePageTitle"
                                                    value={formData.homePageTitle}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-bg-input dark:bg-gray-700 border-0 rounded-lg outline-none focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                    placeholder="Type here"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                    Description
                                                </label>
                                                <textarea
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    rows="4"
                                                    className="w-full px-4 py-3 bg-bg-input dark:bg-gray-700 border-0 rounded-lg outline-none focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Access section */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
                                        <div className="md:col-span-5">
                                            <h5 className="text-lg font-quicksand font-bold text-heading dark:text-white mb-2">
                                                Access
                                            </h5>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Give access of all pages including each product lorem ipsum dolor sit amet, consectetur adipisicing
                                            </p>
                                        </div>
                                        <div className="md:col-span-7">
                                            <div className="space-y-3">
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="access"
                                                        value="all"
                                                        checked={formData.access === 'all'}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4 text-brand border-gray-300 focus:ring-brand"
                                                    />
                                                    <span className="ml-3 text-sm text-body dark:text-gray-300">
                                                        All registration is enabled
                                                    </span>
                                                </label>
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="access"
                                                        value="buyers"
                                                        checked={formData.access === 'buyers'}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4 text-brand border-gray-300 focus:ring-brand"
                                                    />
                                                    <span className="ml-3 text-sm text-body dark:text-gray-300">
                                                        Only buyers is enabled
                                                    </span>
                                                </label>
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="access"
                                                        value="sellers"
                                                        checked={formData.access === 'sellers'}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4 text-brand border-gray-300 focus:ring-brand"
                                                    />
                                                    <span className="ml-3 text-sm text-body dark:text-gray-300">
                                                        Only sellers is enabled
                                                    </span>
                                                </label>
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="access"
                                                        value="stop"
                                                        checked={formData.access === 'stop'}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4 text-brand border-gray-300 focus:ring-brand"
                                                    />
                                                    <span className="ml-3 text-sm text-body dark:text-gray-300">
                                                        Stop new shop registration
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notification section */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
                                        <div className="md:col-span-5">
                                            <h5 className="text-lg font-quicksand font-bold text-heading dark:text-white mb-2">
                                                Notification
                                            </h5>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Lorem ipsum dolor sit amet, consectetur adipisicing something about this
                                            </p>
                                        </div>
                                        <div className="md:col-span-7">
                                            <div className="mb-4">
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="notificationEnabled"
                                                        checked={formData.notificationEnabled}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4 text-brand rounded border-gray-300 focus:ring-brand"
                                                    />
                                                    <span className="ml-3 text-sm text-body dark:text-gray-300">
                                                        Send notification on each user registration
                                                    </span>
                                                </label>
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    name="notificationText"
                                                    value={formData.notificationText}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-bg-input dark:bg-gray-700 border-0 rounded-lg outline-none focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                    placeholder="Text"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Currency section */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
                                        <div className="md:col-span-5">
                                            <h5 className="text-lg font-quicksand font-bold text-heading dark:text-white mb-2">
                                                Currency
                                            </h5>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Lorem ipsum dolor sit amet, consectetur adipisicing something about this
                                            </p>
                                        </div>
                                        <div className="md:col-span-7">
                                            <div className="mb-4 max-w-xs">
                                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                    Main currency
                                                </label>
                                                <select
                                                    name="mainCurrency"
                                                    value={formData.mainCurrency}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-bg-input dark:bg-gray-700 border-0 rounded-lg outline-none focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                >
                                                    <option>US Dollar</option>
                                                    <option>EU Euro</option>
                                                    <option>RU Ruble</option>
                                                    <option>UZ Som</option>
                                                </select>
                                            </div>
                                            <div className="mb-4 max-w-xs">
                                                <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                    Supported currencies
                                                </label>
                                                <select
                                                    name="supportedCurrencies"
                                                    value={formData.supportedCurrencies}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-bg-input dark:bg-gray-700 border-0 rounded-lg outline-none focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                >
                                                    <option>US dollar</option>
                                                    <option>RUBG russia</option>
                                                    <option>INR india</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            type="submit"
                                            className="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors"
                                        >
                                            Save all changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-heading dark:text-white rounded-lg font-medium text-sm transition-colors"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}
