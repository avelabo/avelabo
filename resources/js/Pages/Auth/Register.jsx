import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import FormAlert from '@/Components/Frontend/FormAlert';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const inputClasses = "w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/10 dark:text-white placeholder:text-gray-400";

    return (
        <GuestLayout>
            <Head title="Create Account" />

            <div>
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Create account
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Join Avelabo and start shopping today
                    </p>
                </div>

                {/* Error Messages */}
                {Object.keys(errors).length > 0 && (
                    <FormAlert
                        type="error"
                        title="Please fix the following"
                        errors={errors}
                        className="mb-6"
                    />
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                First name
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="John"
                                value={data.first_name}
                                onChange={e => setData('first_name', e.target.value)}
                                required
                                autoFocus
                                autoComplete="given-name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Last name
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Doe"
                                value={data.last_name}
                                onChange={e => setData('last_name', e.target.value)}
                                required
                                autoComplete="family-name"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            className={inputClasses}
                            placeholder="you@example.com"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone
                            <span className="text-gray-400 font-normal ml-1">(optional)</span>
                        </label>
                        <div className="flex gap-2">
                            <div className="flex items-center px-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-500 dark:text-gray-400">
                                +265
                            </div>
                            <input
                                type="tel"
                                className={`flex-1 ${inputClasses}`}
                                placeholder="999 000 000"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                autoComplete="tel"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`pr-12 ${inputClasses}`}
                                placeholder="Create a password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                required
                                autoComplete="new-password"
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
                        <p className="text-xs text-gray-400 mt-1.5">
                            At least 8 characters with mixed case, numbers, and symbols
                        </p>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className={`pr-12 ${inputClasses}`}
                                placeholder="Repeat your password"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <span className="material-icons text-xl">
                                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Terms */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                        By creating an account, you agree to our{' '}
                        <Link href={route('terms.conditions')} className="text-brand-2 hover:underline">
                            Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link href={route('privacy.policy')} className="text-brand-2 hover:underline">
                            Privacy Policy
                        </Link>
                    </p>

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
                                <span>Creating account...</span>
                            </>
                        ) : (
                            <span>Create account</span>
                        )}
                    </button>
                </form>

                {/* Sign In Link */}
                <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link href={route('login')} className="text-brand font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
