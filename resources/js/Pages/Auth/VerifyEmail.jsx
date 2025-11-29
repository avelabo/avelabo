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

            <div className="w-full max-w-md mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
                    <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-icons text-3xl text-brand">mark_email_unread</span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify Your Email</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Thanks for signing up! Before getting started, please verify your email address by clicking on the link we just sent to you.
                    </p>

                    {status === 'verification-link-sent' && (
                        <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg">
                            A new verification link has been sent to your email address.
                        </div>
                    )}

                    <form onSubmit={handleResend}>
                        <button
                            type="submit"
                            className="w-full py-3 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 mb-4"
                            disabled={processing}
                        >
                            {processing ? 'Sending...' : 'Resend Verification Email'}
                        </button>
                    </form>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline"
                    >
                        Sign out
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
