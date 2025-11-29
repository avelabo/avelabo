import { Head, useForm, Link } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';

export default function SellerSettings({ seller, user }) {
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const notificationForm = useForm({
        email_orders: seller?.notification_settings?.email_orders ?? true,
        email_stock: seller?.notification_settings?.email_stock ?? true,
        email_reviews: seller?.notification_settings?.email_reviews ?? true,
        sms_orders: seller?.notification_settings?.sms_orders ?? false,
    });

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.put(route('password.update'), {
            onSuccess: () => passwordForm.reset(),
        });
    };

    const handleNotificationSubmit = (e) => {
        e.preventDefault();
        notificationForm.patch(route('seller.settings.notifications'));
    };

    return (
        <SellerLayout title="Settings">
            <Head title="Settings" />

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
                <p className="text-gray-500 text-sm">Manage your account and notification preferences</p>
            </div>

            <div className="space-y-6 max-w-3xl">
                {/* Change Password */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>

                    <form onSubmit={handlePasswordSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                />
                                {passwordForm.errors.current_password && (
                                    <p className="text-red-500 text-xs mt-1">{passwordForm.errors.current_password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                />
                                {passwordForm.errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{passwordForm.errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-4 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                            disabled={passwordForm.processing}
                        >
                            {passwordForm.processing ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>

                {/* Notification Preferences */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h3>

                    <form onSubmit={handleNotificationSubmit}>
                        <div className="space-y-4">
                            <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Email Notifications</h4>
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Orders</span>
                                            <p className="text-xs text-gray-500">Get notified when you receive new orders</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notificationForm.data.email_orders}
                                            onChange={(e) => notificationForm.setData('email_orders', e.target.checked)}
                                            className="w-5 h-5 text-brand rounded focus:ring-brand"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Low Stock Alerts</span>
                                            <p className="text-xs text-gray-500">Get notified when products are running low</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notificationForm.data.email_stock}
                                            onChange={(e) => notificationForm.setData('email_stock', e.target.checked)}
                                            className="w-5 h-5 text-brand rounded focus:ring-brand"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Reviews</span>
                                            <p className="text-xs text-gray-500">Get notified when customers leave reviews</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notificationForm.data.email_reviews}
                                            onChange={(e) => notificationForm.setData('email_reviews', e.target.checked)}
                                            className="w-5 h-5 text-brand rounded focus:ring-brand"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3">SMS Notifications</h4>
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Orders (SMS)</span>
                                            <p className="text-xs text-gray-500">Receive SMS alerts for new orders</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notificationForm.data.sms_orders}
                                            onChange={(e) => notificationForm.setData('sms_orders', e.target.checked)}
                                            className="w-5 h-5 text-brand rounded focus:ring-brand"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-4 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                            disabled={notificationForm.processing}
                        >
                            {notificationForm.processing ? 'Saving...' : 'Save Preferences'}
                        </button>
                    </form>
                </div>

                {/* Account Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Actions</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Download Your Data</p>
                                <p className="text-xs text-gray-500">Get a copy of your shop and order data</p>
                            </div>
                            <button className="px-4 py-2 text-sm font-medium text-brand hover:bg-brand/10 rounded-lg transition-colors">
                                Request Download
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div>
                                <p className="font-medium text-red-700 dark:text-red-400">Deactivate Shop</p>
                                <p className="text-xs text-red-600 dark:text-red-500">Temporarily hide your shop from customers</p>
                            </div>
                            <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                Deactivate
                            </button>
                        </div>
                    </div>
                </div>

                {/* Support */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Need Help?</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <a
                            href="#"
                            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <span className="material-icons text-brand">help_center</span>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Help Center</p>
                                <p className="text-xs text-gray-500">Browse FAQs and guides</p>
                            </div>
                        </a>

                        <a
                            href="#"
                            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <span className="material-icons text-brand">support_agent</span>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Contact Support</p>
                                <p className="text-xs text-gray-500">Get help from our team</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
