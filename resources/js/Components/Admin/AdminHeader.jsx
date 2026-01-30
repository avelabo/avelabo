import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminHeader({ onMenuToggle, onDarkModeToggle, darkMode }) {
    const { adminCounts, auth } = usePage().props;
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const unreadMessages = adminCounts?.unread_messages || 0;
    const notifications = adminCounts?.notifications || [];
    const notificationsCount = adminCounts?.notifications_count || 0;
    const user = auth?.user;

    return (
        <header className="sticky top-0 z-30 bg-white dark:bg-dark-sidebar shadow-sm h-16">
            <div className="flex items-center justify-between h-full px-6">
                {/* Left Side */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuToggle}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
                    >
                        <span className="material-icons">menu</span>
                    </button>

                    {/* Search */}
                    <div className="hidden md:flex items-center bg-gray-100 dark:bg-dark-card rounded-lg px-4 py-2">
                        <span className="material-icons text-gray-400 mr-2">search</span>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-none focus:ring-0 text-sm w-64"
                        />
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={onDarkModeToggle}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
                    >
                        <span className="material-icons">
                            {darkMode ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>

                    {/* Fullscreen */}
                    <button
                        onClick={() => {
                            if (!document.fullscreenElement) {
                                document.documentElement.requestFullscreen();
                            } else {
                                document.exitFullscreen();
                            }
                        }}
                        className="hidden md:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
                    >
                        <span className="material-icons">fullscreen</span>
                    </button>

                    {/* Contact Messages */}
                    <Link
                        href="/admin/contact-messages"
                        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
                    >
                        <span className="material-icons">mail</span>
                        {unreadMessages > 0 && (
                            <span className="absolute top-0 right-0 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center">
                                {unreadMessages > 99 ? '99+' : unreadMessages}
                            </span>
                        )}
                    </Link>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 notification-shake"
                        >
                            <span className="material-icons">notifications</span>
                            {notificationsCount > 0 && (
                                <span className="absolute top-0 right-0 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center">
                                    {notificationsCount > 99 ? '99+' : notificationsCount}
                                </span>
                            )}
                        </button>

                        {notificationsOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-card rounded-lg shadow-dropdown z-50">
                                <div className="p-4 border-b dark:border-white/10">
                                    <h6 className="font-semibold text-heading dark:text-white">Notifications</h6>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <Link
                                                key={notification.id}
                                                href={notification.link}
                                                className="block p-4 border-b dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                                                        <span className="material-icons text-brand text-sm">
                                                            {notification.type === 'order' ? 'shopping_bag' : notification.type === 'user' ? 'person' : 'local_shipping'}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm text-heading dark:text-white">{notification.title}</p>
                                                        <p className="text-xs text-body">{notification.description}</p>
                                                        <p className="text-xs text-muted mt-1">{notification.time}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center">
                                            <span className="material-icons text-4xl text-gray-300 mb-2">notifications_none</span>
                                            <p className="text-sm text-muted">No new notifications</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 border-t dark:border-white/10">
                                    <Link href="/admin/orders" className="text-brand text-sm font-medium hover:underline">
                                        View All Orders
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-3"
                        >
                            <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-brand font-semibold">
                                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-heading dark:text-white">{user?.name || 'Admin User'}</p>
                                <p className="text-xs text-body capitalize">{user?.role || 'Administrator'}</p>
                            </div>
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-lg shadow-dropdown z-50">
                                <div className="p-4 border-b dark:border-white/10">
                                    <p className="font-medium text-heading dark:text-white">{user?.name || 'Admin User'}</p>
                                    <p className="text-sm text-body">{user?.email || 'admin@example.com'}</p>
                                </div>
                                <div className="py-2">
                                    <Link href="/admin/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5">
                                        <span className="material-icons text-sm">person</span>
                                        <span className="text-sm">My Profile</span>
                                    </Link>
                                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5">
                                        <span className="material-icons text-sm">settings</span>
                                        <span className="text-sm">Settings</span>
                                    </Link>
                                    <Link href="/admin/inbox" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5">
                                        <span className="material-icons text-sm">inbox</span>
                                        <span className="text-sm">Inbox</span>
                                    </Link>
                                </div>
                                <div className="border-t dark:border-white/10 py-2">
                                    <Link href="/logout" method="post" as="button" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 w-full text-left text-danger">
                                        <span className="material-icons text-sm">logout</span>
                                        <span className="text-sm">Logout</span>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
