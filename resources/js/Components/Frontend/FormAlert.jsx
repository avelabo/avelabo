export default function FormAlert({ type = 'error', title, message, errors, className = '' }) {
    const hasErrors = errors && Object.keys(errors).length > 0;
    const hasMessage = message || title;

    if (!hasErrors && !hasMessage) return null;

    const styles = {
        error: {
            container: 'bg-red-50 border-red-200 text-red-800',
            icon: 'text-red-500',
            title: 'text-red-800',
            list: 'text-red-700',
        },
        success: {
            container: 'bg-green-50 border-green-200 text-green-800',
            icon: 'text-green-500',
            title: 'text-green-800',
            list: 'text-green-700',
        },
        warning: {
            container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            icon: 'text-yellow-500',
            title: 'text-yellow-800',
            list: 'text-yellow-700',
        },
        info: {
            container: 'bg-blue-50 border-blue-200 text-blue-800',
            icon: 'text-blue-500',
            title: 'text-blue-800',
            list: 'text-blue-700',
        },
    };

    const style = styles[type] || styles.error;

    const icons = {
        error: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
        ),
        success: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ),
        warning: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
        ),
    };

    const formatErrorMessage = (value) => {
        if (typeof value === 'string') return value;
        if (Array.isArray(value)) return value.join(', ');
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    };

    return (
        <div className={`border rounded-lg p-4 ${style.container} ${className}`} role="alert">
            <div className="flex items-start gap-3">
                <span className={`flex-shrink-0 ${style.icon}`}>
                    {icons[type] || icons.error}
                </span>
                <div className="flex-1 min-w-0">
                    {title && (
                        <h4 className={`font-semibold mb-1 ${style.title}`}>
                            {title}
                        </h4>
                    )}
                    {message && (
                        <p className="text-sm">{message}</p>
                    )}
                    {hasErrors && (
                        <ul className={`text-sm space-y-1 ${title || message ? 'mt-2' : ''} ${style.list}`}>
                            {Object.entries(errors).map(([key, value]) => (
                                <li key={key} className="flex items-start gap-1">
                                    <span className="mt-1.5 w-1 h-1 bg-current rounded-full flex-shrink-0"></span>
                                    <span>{formatErrorMessage(value)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
