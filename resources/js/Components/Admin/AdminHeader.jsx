import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminHeader({ onMenuToggle, onDarkModeToggle, darkMode }) {
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const notifications = [
        { id: 1, title: 'Your order is placed', description: 'Consectetur adipiscing elit', time: '3 min ago', type: 'order' },
        { id: 2, title: 'New user registered', description: 'A new user has registered', time: '15 min ago', type: 'user' },
        { id: 3, title: 'Order shipped', description: 'Order #12345 has been shipped', time: '1 hour ago', type: 'shipping' },
    ];

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
                    {/* Language Selector */}
                    <div className="hidden md:flex items-center gap-2">
                        <img src="/images/admin/theme/flag-us.png" alt="EN" className="w-5 h-5 rounded-full" />
                        <select className="bg-transparent border-none text-sm cursor-pointer focus:ring-0">
                            <option>English</option>
                            <option>French</option>
                        </select>
                    </div>

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

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 notification-shake"
                        >
                            <span className="material-icons">notifications</span>
                            <span className="absolute top-0 right-0 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center">
                                3
                            </span>
                        </button>

                        {notificationsOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-card rounded-lg shadow-dropdown z-50">
                                <div className="p-4 border-b dark:border-white/10">
                                    <h6 className="font-semibold text-heading dark:text-white">Notifications</h6>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div key={notification.id} className="p-4 border-b dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
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
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4">
                                    <Link href="/admin/notifications" className="text-brand text-sm font-medium hover:underline">
                                        View All Notifications
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
                            <img
                                src="/images/admin/people/avatar-1.png"
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-heading dark:text-white">Admin User</p>
                                <p className="text-xs text-body">Administrator</p>
                            </div>
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-lg shadow-dropdown z-50">
                                <div className="p-4 border-b dark:border-white/10">
                                    <p className="font-medium text-heading dark:text-white">Admin User</p>
                                    <p className="text-sm text-body">admin@example.com</p>
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
