import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import FormAlert from '@/Components/Frontend/FormAlert';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Create Account" />

            <div className="w-full max-w-md mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Join Avelabo to start shopping</p>

                    {Object.keys(errors).length > 0 && (
                        <FormAlert 
                            type="error" 
                            title="Registration Failed"
                            errors={errors}
                            className="mb-4" 
                        />
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand focus:border-transparent dark:text-white"
                                placeholder="Enter your full name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                                autoFocus
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand focus:border-transparent dark:text-white"
                                placeholder="Enter your email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Phone Number (Optional)
                            </label>
                            <div className="flex gap-2">
                                <span className="flex items-center px-3 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                                    +265
                                </span>
                                <input
                                    type="tel"
                                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand focus:border-transparent dark:text-white"
                                    placeholder="999 000 000"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand focus:border-transparent dark:text-white"
                                placeholder="Create a password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                required
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters with mixed case, numbers, and symbols</p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm focus:ring-2 focus:ring-brand focus:border-transparent dark:text-white"
                                placeholder="Confirm your password"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                required
                            />
                            {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4">
                            By creating an account, you agree to our{' '}
                            <Link href={route('privacy.policy')} className="text-brand hover:underline">Terms of Service</Link>
                            {' '}and{' '}
                            <Link href={route('privacy.policy')} className="text-brand hover:underline">Privacy Policy</Link>
                        </p>

                        <button
                            type="submit"
                            className="w-full py-3 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                            disabled={processing}
                        >
                            {processing ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link href={route('login')} className="text-brand hover:text-brand-dark font-medium">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
