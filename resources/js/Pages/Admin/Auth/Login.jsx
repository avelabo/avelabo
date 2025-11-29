import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Sign in" />

            <div className="font-lato text-md text-body bg-bg-grey dark:bg-gray-900 min-h-screen flex flex-col">
                <main className="flex-1 flex flex-col">
                    {/* Header */}
                    <header className="h-18 px-4 lg:px-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        {/* Brand */}
                        <Link href="/" className="flex items-center">
                            <img src="/assets/imgs/theme/logo.svg" className="h-10" alt="Nest Dashboard" />
                        </Link>

                        {/* Right navigation */}
                        <div className="flex items-center gap-2">
                            {/* Notifications */}
                            <div className="relative">
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
                                    <span className="material-icons text-gray-700 dark:text-gray-300">notifications</span>
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xxs px-1.5 py-0.5 rounded-full">3</span>
                                </button>
                            </div>

                            {/* Dark mode toggle */}
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <span className="material-icons text-gray-700 dark:text-gray-300">nights_stay</span>
                            </button>

                            {/* Fullscreen */}
                            <button className="hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <span className="material-icons text-gray-700 dark:text-gray-300">fullscreen</span>
                            </button>
                        </div>
                    </header>

                    {/* Content */}
                    <section className="flex-1 flex items-center justify-center p-4 lg:p-8">
                        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-card border border-gray-100 dark:border-gray-700 p-8">
                            <h4 className="text-2xl font-quicksand font-bold text-heading dark:text-white mb-6">Sign in</h4>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <input
                                        className="w-full px-4 py-3 bg-bg-input dark:bg-gray-700 border-0 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="Username or email"
                                        type="text"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        required
                                    />
                                    {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                                </div>

                                <div className="mb-4">
                                    <input
                                        className="w-full px-4 py-3 bg-bg-input dark:bg-gray-700 border-0 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand dark:text-white"
                                        placeholder="Password"
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        required
                                    />
                                    {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                                </div>

                                <div className="mb-4 flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                                            checked={data.remember}
                                            onChange={e => setData('remember', e.target.checked)}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Remember</span>
                                    </label>
                                    <Link href={route('admin.password.request')} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand">
                                        Forgot password?
                                    </Link>
                                </div>

                                <div className="mb-6">
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Logging in...' : 'Login'}
                                    </button>
                                </div>
                            </form>

                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">or sign in with</p>

                            <div className="space-y-3 mb-6">
                                <a href="#" className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
                                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20">
                                        <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"></path>
                                        <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" fill="#34A853"></path>
                                        <path d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" fill="#FBBC05"></path>
                                        <path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z" fill="#EA4335"></path>
                                    </svg>
                                    Sign in using Google
                                </a>
                                <a href="#" className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
                                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20">
                                        <path d="M3 1a2 2 0 00-2 2v12c0 1.1.9 2 2 2h12a2 2 0 002-2V3a2 2 0 00-2-2H3zm6.55 16v-6.2H7.46V8.4h2.09V6.61c0-2.07 1.26-3.2 3.1-3.2.88 0 1.64.07 1.87.1v2.16h-1.29c-1 0-1.19.48-1.19 1.18V8.4h2.39l-.31 2.42h-2.08V17h-2.5z" fill="#4167B2"></path>
                                    </svg>
                                    Sign in using Facebook
                                </a>
                            </div>

                            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Don't have account? <Link href={route('admin.register')} className="text-brand hover:text-brand-dark font-medium">Sign up</Link>
                            </p>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="px-4 lg:px-8 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date().getFullYear()} &copy; Nest - HTML Ecommerce Template.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">All rights reserved</p>
                    </footer>
                </main>
            </div>
        </>
    );
}
