import { useState, useEffect, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { formatCurrency, getDefaultCurrency } from '@/utils/currency';
import { usePage } from '@inertiajs/react';

export default function PaymentPending({ order, payment, isTestMode, simulateUrl, verifyUrl, successUrl, cancelUrl }) {
    const pageProps = usePage().props;
    const currency = getDefaultCurrency(pageProps);
    const format = (amount) => formatCurrency(amount, currency);

    const [timeLeft, setTimeLeft] = useState(null);
    const [expired, setExpired] = useState(false);
    const [checking, setChecking] = useState(false);
    const [copied, setCopied] = useState(false);
    const [simulating, setSimulating] = useState(false);
    const [simulateMessage, setSimulateMessage] = useState(null);

    // Calculate time remaining from expiry date
    useEffect(() => {
        if (!payment.expiry_date) {
            setTimeLeft(payment.expiry_in_minutes * 60);
            return;
        }

        const expiryTime = new Date(payment.expiry_date).getTime();

        const updateTimer = () => {
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));

            if (remaining <= 0) {
                setExpired(true);
                setTimeLeft(0);
            } else {
                setTimeLeft(remaining);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [payment.expiry_date, payment.expiry_in_minutes]);

    // Poll for payment status
    const checkPaymentStatus = useCallback(async () => {
        if (checking || expired) return;
        setChecking(true);

        try {
            const { data } = await axios.get(verifyUrl);

            if (data.success && data.payment_status === 'paid') {
                window.location.href = successUrl;
                return;
            }
        } catch {
            // Silently ignore polling errors
        } finally {
            setChecking(false);
        }
    }, [verifyUrl, successUrl, checking, expired]);

    // Auto-poll every 10 seconds
    useEffect(() => {
        if (expired) return;

        const pollInterval = setInterval(checkPaymentStatus, 60000);
        return () => clearInterval(pollInterval);
    }, [checkPaymentStatus, expired]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(payment.timed_account_number);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const simulatePayment = async () => {
        if (simulating || !simulateUrl) return;
        setSimulating(true);
        setSimulateMessage(null);

        try {
            const { data } = await axios.post(simulateUrl);
            setSimulateMessage({ success: data.success, text: data.message });

            if (data.success) {
                setTimeout(() => checkPaymentStatus(), 2000);
            }
        } catch {
            setSimulateMessage({ success: false, text: 'Simulation request failed.' });
        } finally {
            setSimulating(false);
        }
    };

    const formatTime = (seconds) => {
        if (seconds === null) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <FrontendLayout>
            <Head title="Complete Payment" />

            <div className="min-h-[60vh] flex items-center justify-center py-12">
                <div className="w-full max-w-lg mx-auto px-4">
                    <div className="bg-surface rounded-2xl border border-border-light shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-brand px-6 py-5 text-center">
                            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-white">Complete Your Payment</h1>
                            <p className="text-white/80 text-sm mt-1">
                                Order #{order.order_number}
                            </p>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Amount */}
                            <div className="text-center">
                                <p className="text-sm text-muted mb-1">Amount to Pay</p>
                                <p className="text-3xl font-bold text-heading">{format(order.total)}</p>
                            </div>

                            {/* TAN Display */}
                            {!expired ? (
                                <div className="bg-surface-raised rounded-xl p-5 text-center border-2 border-brand/20">
                                    <p className="text-sm text-muted mb-2">Pay to this Account Number</p>
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="text-2xl font-mono font-bold text-heading tracking-wider">
                                            {payment.timed_account_number}
                                        </span>
                                        <button
                                            onClick={copyToClipboard}
                                            className="p-2 rounded-lg hover:bg-surface transition-colors text-muted hover:text-brand"
                                            title="Copy account number"
                                        >
                                            {copied ? (
                                                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {copied && (
                                        <p className="text-xs text-success mt-1">Copied!</p>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-red-50 rounded-xl p-5 text-center border-2 border-red-200">
                                    <svg className="w-10 h-10 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-red-700 font-semibold">Payment Session Expired</p>
                                    <p className="text-red-500 text-sm mt-1">The account number has expired. Please try again.</p>
                                </div>
                            )}

                            {/* Countdown Timer */}
                            {!expired && (
                                <div className="text-center">
                                    <p className="text-sm text-muted mb-2">Time Remaining</p>
                                    <div className={`text-3xl font-mono font-bold ${
                                        timeLeft !== null && timeLeft < 120 ? 'text-danger' : 'text-heading'
                                    }`}>
                                        {formatTime(timeLeft)}
                                    </div>
                                </div>
                            )}

                            {/* Instructions */}
                            {!expired && (
                                <div className="bg-surface-raised rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-heading mb-2">How to Pay</h3>
                                    <ol className="text-sm text-body space-y-1.5 list-decimal list-inside">
                                        <li>Open your mobile money app (Airtel Money / TNM Mpamba)</li>
                                        <li>Select "Send Money" or "Pay Bill"</li>
                                        <li>Enter the account number shown above</li>
                                        <li>Enter the exact amount: <strong>{format(order.total)}</strong></li>
                                        <li>Confirm the payment</li>
                                    </ol>
                                </div>
                            )}

                            {/* Reference */}
                            {payment.reference_number && (
                                <div className="flex items-center justify-between text-sm py-3 border-t border-border-light">
                                    <span className="text-muted">Reference</span>
                                    <span className="font-mono text-heading">{payment.reference_number}</span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col gap-3">
                                {!expired ? (
                                    <button
                                        onClick={checkPaymentStatus}
                                        disabled={checking}
                                        className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {checking ? (
                                            <>
                                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Checking Payment...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                I've Made the Payment
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <Link
                                        href={route('checkout')}
                                        className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-lg font-semibold transition-colors text-center"
                                    >
                                        Try Again
                                    </Link>
                                )}

                                {isTestMode && simulateUrl && !expired && (
                                    <div className="border border-amber-300 bg-amber-50 rounded-lg p-3">
                                        <p className="text-xs text-amber-700 font-semibold mb-2 text-center">TEST MODE</p>
                                        <button
                                            onClick={simulatePayment}
                                            disabled={simulating}
                                            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg font-semibold transition-colors text-sm disabled:opacity-50"
                                        >
                                            {simulating ? 'Simulating...' : 'Simulate Payment'}
                                        </button>
                                        {simulateMessage && (
                                            <p className={`text-xs mt-2 text-center ${simulateMessage.success ? 'text-green-600' : 'text-red-600'}`}>
                                                {simulateMessage.text}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <Link
                                    href={cancelUrl}
                                    className="w-full text-center text-sm text-muted hover:text-body transition-colors py-2"
                                >
                                    Cancel Payment
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
