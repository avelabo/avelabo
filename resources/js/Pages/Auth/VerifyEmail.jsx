import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const handleResend = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verify Email" />

            <div className="text-center">
                {/* Icon */}
                <div className="w-14 h-14 rounded-full bg-brand-2/10 flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons text-2xl text-brand-2">mark_email_unread</span>
                </div>

                {/* Header */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Check your email
                </h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    We've sent a verification link to your email. Click the link to verify your account.
                </p>

                {/* Success Message */}
                {status === 'verification-link-sent' && (
                    <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-center gap-2">
                            <span className="material-icons text-green-500 text-lg">check_circle</span>
                            <p className="text-sm text-green-700 dark:text-green-300">
                                A new verification link has been sent!
                            </p>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="mt-8 space-y-3">
                    <form onSubmit={handleResend}>
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
                                <>
                                    <span className="material-icons text-lg">refresh</span>
                                    <span>Resend verification email</span>
                                </>
                            )}
                        </button>
                    </form>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full py-3.5 rounded-lg font-semibold text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-icons text-lg">logout</span>
                        Sign out
                    </Link>
                </div>

                {/* Help */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        Didn't receive the email? Check your spam folder or try resending.
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}
