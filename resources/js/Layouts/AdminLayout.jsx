import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Admin/Sidebar';
import AdminHeader from '@/Components/Admin/AdminHeader';

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark');
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'dark bg-dark-body' : 'bg-admin-body'}`}>
            {/* Mobile Overlay */}
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                isMobileOpen={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
                {/* Header */}
                <AdminHeader
                    onMenuToggle={() => {
                        if (window.innerWidth < 1024) {
                            setMobileSidebarOpen(!mobileSidebarOpen);
                        } else {
                            setSidebarOpen(!sidebarOpen);
                        }
                    }}
                    onDarkModeToggle={toggleDarkMode}
                    darkMode={darkMode}
                />

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
