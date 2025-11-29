import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function ResetPassword() {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <FrontendLayout>
            <Head title="Reset Password" />

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
                        <span className="text-brand">Reset Password</span>
                    </nav>
                </div>
            </section>

            {/* Reset Password Content */}
            <section className="py-12 lg:py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
                            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                                {/* Left Side - Form */}
                                <div className="flex-1">
                                    {/* Header */}
                                    <div className="text-center lg:text-left mb-8">
                                        <img src="/images/frontend/page/reset_password.svg" alt="Reset Password" className="w-full max-w-[200px] mx-auto lg:mx-0 mb-6 rounded-xl" />
                                        <h2 className="font-quicksand font-bold text-2xl lg:text-3xl text-heading mb-4">Set new password</h2>
                                        <p className="text-gray-500">Please create a new password that you don't use on any other site.</p>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {/* Password Input */}
                                        <div>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Password *"
                                                required
                                                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-brand focus:outline-none transition-colors"
                                            />
                                        </div>

                                        {/* Confirm Password Input */}
                                        <div>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Confirm password *"
                                                required
                                                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-brand focus:outline-none transition-colors"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            className="w-full bg-heading hover:bg-brand text-white font-bold py-4 rounded-lg transition-colors hover:-translate-y-0.5 transform duration-300"
                                        >
                                            Reset password
                                        </button>
                                    </form>
                                </div>

                                {/* Right Side - Password Requirements */}
                                <div className="lg:w-64 flex-shrink-0">
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h4 className="font-quicksand font-bold text-heading text-lg mb-4">Password must:</h4>
                                        <ul className="space-y-3 text-sm text-gray-500">
                                            <li className="flex items-start gap-2">
                                                <i className="fi fi-rs-check text-brand mt-0.5"></i>
                                                <span>Be between 9 and 64 characters</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <i className="fi fi-rs-check text-brand mt-0.5"></i>
                                                <span>Include at least two of the following:</span>
                                            </li>
                                        </ul>
                                        <ul className="mt-3 ml-6 space-y-2 text-sm text-gray-500">
                                            <li className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-brand rounded-full"></span>
                                                <span>An uppercase character</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-brand rounded-full"></span>
                                                <span>A lowercase character</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-brand rounded-full"></span>
                                                <span>A number</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-brand rounded-full"></span>
                                                <span>A special character</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
