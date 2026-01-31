import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import FormAlert from '@/Components/Frontend/FormAlert';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div>
                {/* Back Link */}
                <Link
                    href={route('login')}
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6"
                >
                    <span className="material-icons text-lg">arrow_back</span>
                    Back to sign in
                </Link>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-full bg-brand-2/10 flex items-center justify-center mx-auto mb-4">
                        <span className="material-icons text-2xl text-brand-2">lock_reset</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Forgot password?
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Enter your email and we'll send you a reset link
                    </p>
                </div>

                {/* Status Messages */}
                {status && (
                    <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2">
                            <span className="material-icons text-green-500 text-lg">check_circle</span>
                            <p className="text-sm text-green-700 dark:text-green-300">{status}</p>
                        </div>
                    </div>
                )}

                {Object.keys(errors).length > 0 && (
                    <FormAlert
                        type="error"
                        title="Unable to send reset link"
                        errors={errors}
                        className="mb-6"
                    />
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
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
                                <span>Sending...</span>
                            </>
                        ) : (
                            <span>Send reset link</span>
                        )}
                    </button>
                </form>
            </div>
        </GuestLayout>
    );
}
