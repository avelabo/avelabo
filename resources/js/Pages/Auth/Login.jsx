import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import FormAlert from '@/Components/Frontend/FormAlert';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Sign In" />

            <div>
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome back
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Sign in to continue shopping
                    </p>
                </div>

                {/* Status Messages */}
                {status && (
                    <FormAlert type="success" message={status} className="mb-6" />
                )}

                {(errors.email || errors.password || errors.error) && (
                    <FormAlert
                        type="error"
                        title="Unable to sign in"
                        message={errors.error || (errors.email && !errors.password ? errors.email : null)}
                        errors={!errors.error ? {
                            ...(errors.email && errors.password ? { email: errors.email } : {}),
                            ...(errors.password ? { password: errors.password } : {})
                        } : null}
                        className="mb-6"
                    />
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/10 dark:text-white placeholder:text-gray-400"
                            placeholder="you@example.com"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            required
                            autoFocus
                            autoComplete="email"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs text-brand-2 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/10 dark:text-white placeholder:text-gray-400"
                                placeholder="Enter your password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <span className="material-icons text-xl">
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Remember Me */}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={e => setData('remember', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Keep me signed in
                        </span>
                    </label>

                    {/* Cloudflare Turnstile */}
                    <div className="cf-turnstile" data-sitekey="0x4AAAAAACV9ozEnuPEDz7Ec"></div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 bg-brand hover:bg-brand-dark text-white rounded-lg font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <span>Sign in</span>
                        )}
                    </button>
                </form>

                {/* Create Account */}
                <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link href={route('register')} className="text-brand font-semibold hover:underline">
                        Create account
                    </Link>
                </p>

                {/* Seller CTA */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <Link
                        href={route('vendor.guide')}
                        className="flex items-center gap-3 p-4 rounded-xl bg-[#f1b945]/15 hover:bg-[#f1b945]/25 dark:bg-[#f1b945]/10 dark:hover:bg-[#f1b945]/20 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-[#f1b945] flex items-center justify-center">
                            <span className="material-icons text-white">storefront</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                Want to sell on Avelabo?
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Learn how to become a seller
                            </p>
                        </div>
                        <span className="material-icons text-[#f1b945] group-hover:translate-x-1 transition-transform">
                            arrow_forward
                        </span>
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
