import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import FormAlert from '@/Components/Frontend/FormAlert';

export default function CheckoutAccountPrompt({ billing }) {
    const [showCreateAccount, setShowCreateAccount] = useState(false);

    const createAccountForm = useForm({
        password: '',
        password_confirmation: '',
    });

    const guestForm = useForm({});

    const handleCreateAccount = (e) => {
        e.preventDefault();
        createAccountForm.post(route('checkout.create-account'), {
            preserveScroll: true,
        });
    };

    const handleContinueAsGuest = (e) => {
        e.preventDefault();
        guestForm.post(route('checkout.continue-guest'));
    };

    return (
        <FrontendLayout>
            <Head title="Create Account - Checkout" />

            {/* Breadcrumb */}
            <div className="bg-grey-9 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-brand hover:text-brand-dark flex items-center gap-1">
                            <i className="fi-rs-home"></i> Home
                        </Link>
                        <span className="text-muted">-</span>
                        <Link href={route('cart')} className="text-muted hover:text-brand">Basket</Link>
                        <span className="text-muted">-</span>
                        <Link href={route('checkout')} className="text-muted hover:text-brand">Checkout</Link>
                        <span className="text-muted">-</span>
                        <span className="text-body">Account</span>
                    </div>
                </div>
            </div>

            {/* Account Prompt Section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        {/* Page Header */}
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-heading font-quicksand mb-2">
                                Almost There!
                            </h1>
                            <p className="text-body">
                                Would you like to create an account for a better shopping experience?
                            </p>
                        </div>

                        {/* User Info Summary */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center">
                                    <i className="fi-rs-user text-brand text-xl"></i>
                                </div>
                                <div>
                                    <p className="font-semibold text-heading">
                                        {billing?.first_name} {billing?.last_name}
                                    </p>
                                    <p className="text-sm text-muted">{billing?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-4">
                            {/* Create Account Option */}
                            <div className={`bg-white border-2 rounded-xl transition-all ${showCreateAccount ? 'border-brand shadow-lg' : 'border-border hover:border-brand/50'}`}>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateAccount(true)}
                                    className="w-full p-6 text-left"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${showCreateAccount ? 'border-brand bg-brand' : 'border-gray-300'}`}>
                                            {showCreateAccount && (
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-heading mb-1">
                                                Create an Account
                                            </h3>
                                            <p className="text-sm text-body mb-3">
                                                Save your details for faster checkout next time, track your orders, and manage your account.
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Track orders
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Faster checkout
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Order history
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Cart saved if payment fails
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                {/* Create Account Form */}
                                {showCreateAccount && (
                                    <form onSubmit={handleCreateAccount} className="px-6 pb-6 pt-2 border-t border-border">
                                        <div className="pl-10">
                                            <p className="text-sm text-body mb-4">
                                                Just set a password to create your account. We'll use <strong>{billing?.email}</strong> as your login email.
                                            </p>

                                            {/* Error Display */}
                                            {Object.keys(createAccountForm.errors).length > 0 && (
                                                <FormAlert 
                                                    type="error" 
                                                    errors={createAccountForm.errors}
                                                    className="mb-4" 
                                                />
                                            )}

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-heading mb-1">
                                                        Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={createAccountForm.data.password}
                                                        onChange={(e) => createAccountForm.setData('password', e.target.value)}
                                                        placeholder="Create a password (min. 8 characters)"
                                                        className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none ${createAccountForm.errors.password ? 'border-red-500' : 'border-border'}`}
                                                        required
                                                        minLength={8}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-heading mb-1">
                                                        Confirm Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={createAccountForm.data.password_confirmation}
                                                        onChange={(e) => createAccountForm.setData('password_confirmation', e.target.value)}
                                                        placeholder="Confirm your password"
                                                        className={`w-full border rounded-md px-4 py-3 text-sm focus:border-brand focus:outline-none ${createAccountForm.errors.password_confirmation ? 'border-red-500' : 'border-border'}`}
                                                        required
                                                        minLength={8}
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={createAccountForm.processing}
                                                    className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-md font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {createAccountForm.processing ? (
                                                        <>
                                                            <i className="fi-rs-spinner animate-spin"></i>
                                                            Creating Account...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Create Account & Continue to Payment
                                                            <i className="fi-rs-arrow-right"></i>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>

                            {/* Continue as Guest Option */}
                            <div className={`bg-white border-2 rounded-xl transition-all ${!showCreateAccount ? 'border-brand shadow-lg' : 'border-border hover:border-brand/50'}`}>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateAccount(false)}
                                    className="w-full p-6 text-left"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${!showCreateAccount ? 'border-brand bg-brand' : 'border-gray-300'}`}>
                                            {!showCreateAccount && (
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-heading mb-1">
                                                Continue as Guest
                                            </h3>
                                            <p className="text-sm text-body">
                                                Checkout without creating an account. You can still track your order via email.
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                {/* Guest Continue Button */}
                                {!showCreateAccount && (
                                    <form onSubmit={handleContinueAsGuest} className="px-6 pb-6 pt-2 border-t border-border">
                                        <div className="pl-10">
                                            <p className="text-sm text-muted mb-4">
                                                Note: If your payment fails, you may need to re-enter your cart items.
                                            </p>
                                            <button
                                                type="submit"
                                                disabled={guestForm.processing}
                                                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-md font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {guestForm.processing ? (
                                                    <>
                                                        <i className="fi-rs-spinner animate-spin"></i>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        Continue as Guest
                                                        <i className="fi-rs-arrow-right"></i>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Back Link */}
                        <div className="text-center mt-8">
                            <Link
                                href={route('checkout')}
                                className="text-brand hover:text-brand-dark inline-flex items-center gap-2"
                            >
                                <i className="fi-rs-arrow-left"></i>
                                Back to Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
