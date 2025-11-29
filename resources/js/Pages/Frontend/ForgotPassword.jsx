import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function ForgotPassword() {
    const [formData, setFormData] = useState({
        email: '',
        securityCode: '',
        agreeTerms: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <FrontendLayout>
            <Head title="Forgot Password" />

            {/* Breadcrumb */}
            <section className="bg-gray-50 py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-400 hover:text-brand transition-colors flex items-center gap-1">
                            <i className="fi fi-rs-home text-xs"></i> Home
                        </Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-400">Pages</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-brand">Forgot Password</span>
                    </nav>
                </div>
            </section>

            {/* Forgot Password Content */}
            <section className="py-12 lg:py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="max-w-md mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <img src="/images/frontend/page/forgot_password.svg" alt="Forgot Password" className="w-full max-w-[200px] mx-auto mb-6 rounded-xl" />
                                <h2 className="font-quicksand font-bold text-2xl lg:text-3xl text-heading mb-4">Forgot your password?</h2>
                                <p className="text-gray-500">Not to worry, we got you! Let's get you a new password. Please enter your email address or your Username.</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email/Username Input */}
                                <div>
                                    <input
                                        type="text"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Username or Email *"
                                        required
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-brand focus:outline-none transition-colors"
                                    />
                                </div>

                                {/* Security Code Row */}
                                <div className="flex items-center gap-4">
                                    <input
                                        type="text"
                                        name="securityCode"
                                        value={formData.securityCode}
                                        onChange={handleChange}
                                        placeholder="Security code *"
                                        required
                                        className="flex-1 border border-gray-200 rounded-lg px-4 py-3 focus:border-brand focus:outline-none transition-colors"
                                    />
                                    <div className="flex items-center gap-1 bg-gray-50 px-4 py-3 rounded-lg">
                                        <span className="text-xl font-bold text-brand">8</span>
                                        <span className="text-xl font-bold text-pink-500">6</span>
                                        <span className="text-xl font-bold text-blue-400">7</span>
                                        <span className="text-xl font-bold text-orange-400">5</span>
                                    </div>
                                </div>

                                {/* Terms Checkbox */}
                                <div className="flex items-center justify-between gap-4">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="agreeTerms"
                                            checked={formData.agreeTerms}
                                            onChange={handleChange}
                                            className="w-5 h-5 rounded border-gray-200 text-brand focus:ring-brand"
                                        />
                                        <span className="text-sm text-gray-500">I agree to terms & Policy.</span>
                                    </label>
                                    <a href="#" className="text-sm text-gray-400 hover:text-brand transition-colors">Learn more</a>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-heading hover:bg-brand text-white font-bold py-4 rounded-lg transition-colors hover:-translate-y-0.5 transform duration-300"
                                >
                                    Reset password
                                </button>
                            </form>

                            {/* Back to Login Link */}
                            <div className="text-center mt-6">
                                <p className="text-gray-500">
                                    Remember your password?{' '}
                                    <Link href="/login" className="text-brand hover:text-brand-dark font-semibold">Login</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
