import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';

export default function EmailConfig({ config = {}, providers = {} }) {
    const { flash } = usePage().props;
    const [testing, setTesting] = useState(false);
    const [testEmail, setTestEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [testMessage, setTestMessage] = useState(null);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        mail_provider: config.mail_provider || 'log',
        mail_from_address: config.mail_from_address || '',
        mail_from_name: config.mail_from_name || '',
        mail_reply_to_address: config.mail_reply_to_address || '',
        // SMTP
        smtp_host: config.smtp_host || '',
        smtp_port: config.smtp_port || 587,
        smtp_username: config.smtp_username || '',
        smtp_password: config.smtp_password || '',
        smtp_encryption: config.smtp_encryption || 'tls',
        // Mailgun
        mailgun_domain: config.mailgun_domain || '',
        mailgun_secret: config.mailgun_secret || '',
        mailgun_endpoint: config.mailgun_endpoint || 'api.mailgun.net',
        // Postmark
        postmark_token: config.postmark_token || '',
        // Resend
        resend_api_key: config.resend_api_key || '',
        // SES
        ses_key: config.ses_key || '',
        ses_secret: config.ses_secret || '',
        ses_region: config.ses_region || 'us-east-1',
    });

    useEffect(() => {
        if (flash?.success) {
            // Check if it's a test email message
            if (flash.success.toLowerCase().includes('test email')) {
                setTestMessage({ type: 'success', text: flash.success });
                setTimeout(() => setTestMessage(null), 5000);
            } else {
                setMessage({ type: 'success', text: flash.success });
                setTimeout(() => setMessage(null), 5000);
            }
        }
        if (flash?.error) {
            // Check if it's a test email error
            if (flash.error.toLowerCase().includes('test email')) {
                setTestMessage({ type: 'error', text: flash.error });
                setTimeout(() => setTestMessage(null), 10000);
            } else {
                setMessage({ type: 'error', text: flash.error });
                setTimeout(() => setMessage(null), 10000);
            }
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.email-config.update'), {
            preserveScroll: true,
        });
    };

    const handleTestEmail = () => {
        if (!testEmail) return;
        setTesting(true);
        router.post(route('admin.email-config.test'), {
            test_email: testEmail,
        }, {
            preserveScroll: true,
            onFinish: () => setTesting(false),
        });
    };

    const providerIcons = {
        log: 'description',
        smtp: 'dns',
        mailgun: 'email',
        postmark: 'mark_email_read',
        resend: 'send',
        ses: 'cloud',
    };

    return (
        <AdminLayout>
            <Head title="Email Configuration" />

            <section className="content-main p-4 lg:p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-quicksand font-bold text-heading dark:text-white">
                        Email Configuration
                    </h2>
                    <p className="text-body mt-1">Configure your email delivery provider settings</p>
                </div>

                {/* Flash Messages */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                        message.type === 'success'
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                    }`}>
                        <span className="material-icons">
                            {message.type === 'success' ? 'check_circle' : 'error'}
                        </span>
                        <span>{message.text}</span>
                        <button
                            type="button"
                            onClick={() => setMessage(null)}
                            className="ml-auto"
                        >
                            <span className="material-icons text-lg">close</span>
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Provider Selection */}
                    <div className="bg-white dark:bg-dark-card rounded-card border border-gray-100 dark:border-gray-700 mb-6">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-quicksand font-bold text-heading dark:text-white flex items-center gap-2">
                                <span className="material-icons text-brand">email</span>
                                Email Provider
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {Object.entries(providers).map(([value, label]) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setData('mail_provider', value)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                                            data.mail_provider === value
                                                ? 'border-brand bg-brand/5 dark:bg-brand/10'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-brand/50'
                                        }`}
                                    >
                                        <span className={`material-icons text-2xl ${
                                            data.mail_provider === value ? 'text-brand' : 'text-gray-400'
                                        }`}>
                                            {providerIcons[value]}
                                        </span>
                                        <span className={`text-sm font-medium ${
                                            data.mail_provider === value ? 'text-brand' : 'text-gray-600 dark:text-gray-400'
                                        }`}>
                                            {label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            {errors.mail_provider && (
                                <p className="text-red-500 text-sm mt-2">{errors.mail_provider}</p>
                            )}
                        </div>
                    </div>

                    {/* From Address Configuration */}
                    <div className="bg-white dark:bg-dark-card rounded-card border border-gray-100 dark:border-gray-700 mb-6">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-quicksand font-bold text-heading dark:text-white flex items-center gap-2">
                                <span className="material-icons text-brand">person</span>
                                Sender Information
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        From Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.mail_from_name}
                                        onChange={(e) => setData('mail_from_name', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-brand focus:ring-brand"
                                        placeholder="Avelabo"
                                    />
                                    {errors.mail_from_name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.mail_from_name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        From Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={data.mail_from_address}
                                        onChange={(e) => setData('mail_from_address', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-brand focus:ring-brand"
                                        placeholder="noreply@avelabo.com"
                                    />
                                    {errors.mail_from_address && (
                                        <p className="text-red-500 text-sm mt-1">{errors.mail_from_address}</p>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Reply-To Email (Optional)
                                    </label>
                                    <input
                                        type="email"
                                        value={data.mail_reply_to_address}
                                        onChange={(e) => setData('mail_reply_to_address', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-brand focus:ring-brand"
                                        placeholder="support@avelabo.com"
                                    />
                                    {errors.mail_reply_to_address && (
                                        <p className="text-red-500 text-sm mt-1">{errors.mail_reply_to_address}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SMTP Settings */}
                    {data.mail_provider === 'smtp' && (
                        <div className="bg-white dark:bg-dark-card rounded-card border border-gray-100 dark:border-gray-700 mb-6">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-quicksand font-bold text-heading dark:text-white flex items-center gap-2">
                                    <span className="material-icons text-brand">dns</span>
                                    SMTP Configuration
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            SMTP Host
                                        </label>
                                        <input
                                            type="text"
                                            value={data.smtp_host}
                                            onChange={(e) => setData('smtp_host', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-brand focus:ring-brand"
                                            placeholder="smtp.example.com"
                                        />
                                        {errors.smtp_host && (
                                            <p className="text-red-500 text-sm mt-1">{errors.smtp_host}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            SMTP Port
                                        </label>
                                        <input
                                            type="number"
                                            value={data.smtp_port}
                                            onChange={(e) => setData('smtp_port', parseInt(e.target.value) || 587)}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-brand focus:ring-brand"
                                            placeholder="587"
                                        />
                                        {errors.smtp_port && (
                                            <p className="text-red-500 text-sm mt-1">{errors.smtp_port}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            value={data.smtp_username}
                                            onChange={(e) => setData('smtp_username', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-brand focus:ring-brand"
                                            placeholder="username"
                                        />
                                        {errors.smtp_username && (
                                            <p className="text-red-500 text-sm mt-1">{errors.smtp_username}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            value={data.smtp_password}
                                            onChange={(e) => setData('smtp_password', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-brand focus:ring-brand"
                                            placeholder="••••••••"
                                        />
                                        {errors.smtp_password && (
                                            <p className="text-red-500 text-sm mt-1">{errors.smtp_password}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Encryption
                                        </label>
                                        <select
                                            value={data.smtp_encryption}
                                            onChange={(e) => setData('smtp_encryption', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-brand focus:ring-brand"
                                        >
                                            <option value="tls">TLS</option>
                                            <option value="ssl">SSL</option>
                                            <option value="none">None</option>
                                        </select>
                                        {errors.smtp_encryption && (
                                            <p className="text-red-500 text-sm mt-1">{errors.smtp_encryption}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mailgun Settings */}
                    {data.mail_provider === 'mailgun' && (
                        <div className="bg-white dark:bg-dark-card rounded-card border border-gray-100 dark:border-gray-700 mb-6">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-quicksand font-bold text-heading dark:text-white flex items-center gap-2">
                                    <span className="material-icons text-brand">email</span>
                                    Mailgun Configuration
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Domain
                                        </label>
                                        <input
                                            type="text"
                                            value={data.mailgun_domain}
                                            onChange={(e) => setData('mailgun_domain', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-brand focus:ring-brand"
                                            placeholder="mg.yourdomain.com"
                                        />
                                        {errors.mailgun_domain && (
                                            <p className="text-red-500 text-sm mt-1">{errors.mailgun_domain}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            API Key
                                        </label>
                                        <input
                                            type="password"
                                            value={data.mailgun_secret}
                                            onChange={(e) => setData('mailgun_secret', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-brand focus:ring-brand"
                                            placeholder="••••••••"
                                        />
                                        {errors.mailgun_secret && (
                                            <p className="text-red-500 text-sm mt-1">{errors.mailgun_secret}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Region
                                        </label>
                                        <select
                                            value={data.mailgun_endpoint}
                                            onChange={(e) => setData('mailgun_endpoint', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-brand focus:ring-brand"
                                        >
                                            <option value="api.mailgun.net">US Region</option>
                                            <option value="api.eu.mailgun.net">EU Region</option>
                                        </select>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Endpoint: {data.mailgun_endpoint}
                                        </p>
                                        {errors.mailgun_endpoint && (
                                            <p className="text-red-500 text-sm mt-1">{errors.mailgun_endpoint}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Postmark Settings */}
                    {data.mail_provider === 'postmark' && (
                        <div className="bg-white dark:bg-dark-card rounded-card border border-gray-100 dark:border-gray-700 mb-6">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-quicksand font-bold text-heading dark:text-white flex items-center gap-2">
                                    <span className="material-icons text-brand">mark_email_read</span>
                                    Postmark Configuration
                                </h3>
                            </div>
                            <div className="p-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Server API Token
                                    </label>
                                    <input
                                        type="password"
                                        value={data.postmark_token}
                                        onChange={(e) => setData('postmark_token', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-brand focus:ring-brand"
                                        placeholder="••••••••"
                                    />
                                    {errors.postmark_token && (
                                        <p className="text-red-500 text-sm mt-1">{errors.postmark_token}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Resend Settings */}
                    {data.mail_provider === 'resend' && (
                        <div className="bg-white dark:bg-dark-card rounded-card border border-gray-100 dark:border-gray-700 mb-6">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-quicksand font-bold text-heading dark:text-white flex items-center gap-2">
                                    <span className="material-icons text-brand">send</span>
                                    Resend Configuration
                                </h3>
                            </div>
                            <div className="p-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        API Key
                                    </label>
                                    <input
                                        type="password"
                                        value={data.resend_api_key}
                                        onChange={(e) => setData('resend_api_key', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-brand focus:ring-brand"
                                        placeholder="re_••••••••"
                                    />
                                    {errors.resend_api_key && (
                                        <p className="text-red-500 text-sm mt-1">{errors.resend_api_key}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SES Settings */}
                    {data.mail_provider === 'ses' && (
                        <div className="bg-white dark:bg-dark-card rounded-card border border-gray-100 dark:border-gray-700 mb-6">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-quicksand font-bold text-heading dark:text-white flex items-center gap-2">
                                    <span className="material-icons text-brand">cloud</span>
                                    Amazon SES Configuration
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            AWS Access Key ID
                                        </label>
                                        <input
                                            type="text"
                                            value={data.ses_key}
                                            onChange={(e) => setData('ses_key', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-brand focus:ring-brand"
                                            placeholder="AKIA..."
                                        />
                                        {errors.ses_key && (
                                            <p className="text-red-500 text-sm mt-1">{errors.ses_key}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            AWS Secret Access Key
                                        </label>
                                        <input
                                            type="password"
                                            value={data.ses_secret}
                                            onChange={(e) => setData('ses_secret', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-brand focus:ring-brand"
                                            placeholder="••••••••"
                                        />
                                        {errors.ses_secret && (
                                            <p className="text-red-500 text-sm mt-1">{errors.ses_secret}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            AWS Region
                                        </label>
                                        <input
                                            type="text"
                                            value={data.ses_region}
                                            onChange={(e) => setData('ses_region', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-brand focus:ring-brand"
                                            placeholder="us-east-1"
                                        />
                                        {errors.ses_region && (
                                            <p className="text-red-500 text-sm mt-1">{errors.ses_region}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <span className="material-icons animate-spin text-lg">refresh</span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <span className="material-icons text-lg">save</span>
                                    Save Configuration
                                </>
                            )}
                        </button>
                        {recentlySuccessful && (
                            <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                                <span className="material-icons text-lg">check_circle</span>
                                Saved successfully
                            </span>
                        )}
                    </div>
                </form>

                {/* Test Email Section */}
                <div className="bg-white dark:bg-dark-card rounded-card border border-gray-100 dark:border-gray-700 mt-8">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-quicksand font-bold text-heading dark:text-white flex items-center gap-2">
                            <span className="material-icons text-brand">send</span>
                            Test Email Configuration
                        </h3>
                    </div>
                    <div className="p-6">
                        {/* Test Email Messages */}
                        {testMessage && (
                            <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
                                testMessage.type === 'success'
                                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                            }`}>
                                <span className="material-icons">
                                    {testMessage.type === 'success' ? 'check_circle' : 'error'}
                                </span>
                                <span className="flex-1">{testMessage.text}</span>
                                <button
                                    type="button"
                                    onClick={() => setTestMessage(null)}
                                    className="shrink-0"
                                >
                                    <span className="material-icons text-lg">close</span>
                                </button>
                            </div>
                        )}

                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Send a test email to verify your configuration is working correctly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                                className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-brand focus:ring-brand"
                                placeholder="Enter email address..."
                            />
                            <button
                                type="button"
                                onClick={handleTestEmail}
                                disabled={testing || !testEmail}
                                className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {testing ? (
                                    <>
                                        <span className="material-icons animate-spin text-lg">refresh</span>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-icons text-lg">send</span>
                                        Send Test Email
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}
