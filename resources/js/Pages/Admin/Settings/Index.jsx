import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';

export default function Settings({ settings = {} }) {
    const [activeSection, setActiveSection] = useState('general');

    const { data, setData, post, processing } = useForm({
        settings: [],
    });

    useEffect(() => {
        // Initialize form data from settings
        const settingsArray = Object.entries(settings).map(([key, { value }]) => ({
            key,
            value: value || '',
        }));
        setData('settings', settingsArray);
    }, [settings]);

    const getValue = (key) => {
        const setting = data.settings.find(s => s.key === key);
        return setting ? setting.value : (settings[key]?.value || '');
    };

    const setValue = (key, value) => {
        const current = data.settings;
        const existing = current.find(s => s.key === key);
        if (existing) {
            setData('settings', current.map(s => s.key === key ? { ...s, value } : s));
        } else {
            setData('settings', [...current, { key, value }]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'));
    };

    const navigationItems = [
        { id: 'general', label: 'General', icon: 'settings' },
        { id: 'contact', label: 'Contact Info', icon: 'contact_phone' },
        { id: 'social', label: 'Social Media', icon: 'share' },
        { id: 'footer', label: 'Footer', icon: 'web' },
    ];

    return (
        <AdminLayout>
            <Head title="Site Settings" />

            <section className="content-main p-4 lg:p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-quicksand font-bold text-heading dark:text-white">
                        Site Settings
                    </h2>
                    <p className="text-body mt-1">Manage your site configuration</p>
                </div>

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
                                            className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                                                activeSection === item.id
                                                    ? 'bg-brand text-white'
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-body dark:text-gray-300'
                                            }`}
                                        >
                                            <span className="material-icons text-lg">{item.icon}</span>
                                            {item.label}
                                        </button>
                                    ))}
                                </nav>
                            </aside>

                            {/* Right content area */}
                            <div className="lg:col-span-9">
                                <form onSubmit={handleSubmit} className="xl:px-8">
                                    {/* General Settings */}
                                    {activeSection === 'general' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                                                <div className="md:col-span-5">
                                                    <h5 className="text-lg font-quicksand font-bold text-heading dark:text-white mb-2">
                                                        Site Identity
                                                    </h5>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Basic site information displayed across the platform
                                                    </p>
                                                </div>
                                                <div className="md:col-span-7 space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                            Site Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={getValue('site_name')}
                                                            onChange={(e) => setValue('site_name', e.target.value)}
                                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                            placeholder="Avelabo"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                            Tagline
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={getValue('site_tagline')}
                                                            onChange={(e) => setValue('site_tagline', e.target.value)}
                                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                            placeholder="Your One-Stop Marketplace"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                            Site Description
                                                        </label>
                                                        <textarea
                                                            value={getValue('site_description')}
                                                            onChange={(e) => setValue('site_description', e.target.value)}
                                                            rows="3"
                                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                            placeholder="Brief description of your marketplace..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Contact Info Settings */}
                                    {activeSection === 'contact' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                                                <div className="md:col-span-5">
                                                    <h5 className="text-lg font-quicksand font-bold text-heading dark:text-white mb-2">
                                                        Contact Details
                                                    </h5>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Your business contact information displayed on the site
                                                    </p>
                                                </div>
                                                <div className="md:col-span-7 space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                            Address
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={getValue('site_address')}
                                                            onChange={(e) => setValue('site_address', e.target.value)}
                                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                            placeholder="Area 47, Sector 3, Lilongwe, Malawi"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                                Phone Number
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={getValue('site_phone')}
                                                                onChange={(e) => setValue('site_phone', e.target.value)}
                                                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                                placeholder="+265 999 123 456"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                                Secondary Phone
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={getValue('site_phone_2')}
                                                                onChange={(e) => setValue('site_phone_2', e.target.value)}
                                                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                                placeholder="+265 888 123 456"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                                Email Address
                                                            </label>
                                                            <input
                                                                type="email"
                                                                value={getValue('site_email')}
                                                                onChange={(e) => setValue('site_email', e.target.value)}
                                                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                                placeholder="info@avelabo.mw"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                                Support Email
                                                            </label>
                                                            <input
                                                                type="email"
                                                                value={getValue('site_support_email')}
                                                                onChange={(e) => setValue('site_support_email', e.target.value)}
                                                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                                placeholder="support@avelabo.mw"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                            Business Hours
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={getValue('site_hours')}
                                                            onChange={(e) => setValue('site_hours', e.target.value)}
                                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                            placeholder="Mon-Fri: 8:00 AM - 5:00 PM"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Social Media Settings */}
                                    {activeSection === 'social' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                                                <div className="md:col-span-5">
                                                    <h5 className="text-lg font-quicksand font-bold text-heading dark:text-white mb-2">
                                                        Social Media Links
                                                    </h5>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Connect your social media profiles
                                                    </p>
                                                </div>
                                                <div className="md:col-span-7 space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                            Facebook URL
                                                        </label>
                                                        <input
                                                            type="url"
                                                            value={getValue('social_facebook')}
                                                            onChange={(e) => setValue('social_facebook', e.target.value)}
                                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                            placeholder="https://facebook.com/yourpage"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                            Twitter/X URL
                                                        </label>
                                                        <input
                                                            type="url"
                                                            value={getValue('social_twitter')}
                                                            onChange={(e) => setValue('social_twitter', e.target.value)}
                                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                            placeholder="https://twitter.com/yourhandle"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                            Instagram URL
                                                        </label>
                                                        <input
                                                            type="url"
                                                            value={getValue('social_instagram')}
                                                            onChange={(e) => setValue('social_instagram', e.target.value)}
                                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                            placeholder="https://instagram.com/yourpage"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                            YouTube URL
                                                        </label>
                                                        <input
                                                            type="url"
                                                            value={getValue('social_youtube')}
                                                            onChange={(e) => setValue('social_youtube', e.target.value)}
                                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                            placeholder="https://youtube.com/yourchannel"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                            WhatsApp Number
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={getValue('social_whatsapp')}
                                                            onChange={(e) => setValue('social_whatsapp', e.target.value)}
                                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                            placeholder="+265999123456"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer Settings */}
                                    {activeSection === 'footer' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                                                <div className="md:col-span-5">
                                                    <h5 className="text-lg font-quicksand font-bold text-heading dark:text-white mb-2">
                                                        Footer Content
                                                    </h5>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Customize your site footer
                                                    </p>
                                                </div>
                                                <div className="md:col-span-7 space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                            Footer About Text
                                                        </label>
                                                        <textarea
                                                            value={getValue('footer_about')}
                                                            onChange={(e) => setValue('footer_about', e.target.value)}
                                                            rows="3"
                                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                            placeholder="Brief description for the footer..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                            Copyright Text
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={getValue('copyright_text')}
                                                            onChange={(e) => setValue('copyright_text', e.target.value)}
                                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                            placeholder="© 2024 Avelabo. All Rights Reserved."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                            Newsletter Title
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={getValue('newsletter_title')}
                                                            onChange={(e) => setValue('newsletter_title', e.target.value)}
                                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                            placeholder="Subscribe to our Newsletter"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-heading dark:text-white mb-2">
                                                            Newsletter Subtitle
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={getValue('newsletter_subtitle')}
                                                            onChange={(e) => setValue('newsletter_subtitle', e.target.value)}
                                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-brand text-sm dark:text-white"
                                                            placeholder="Get updates on deals and promotions"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Save Button */}
                                    <div className="flex flex-wrap gap-3 pt-6">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {processing ? (
                                                <>
                                                    <span className="material-icons animate-spin text-lg">refresh</span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-icons text-lg">save</span>
                                                    Save Changes
                                                </>
                                            )}
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
