/**
 * FilterWidget - Wrapper component for filter sections with consistent styling
 *
 * @param {string} title - Widget title
 * @param {boolean} collapsible - Whether the widget can be collapsed (default: false)
 * @param {boolean} defaultOpen - Initial open state for collapsible widgets (default: true)
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} children - Widget content
 */
import { useState } from 'react';

export default function FilterWidget({
    title,
    collapsible = false,
    defaultOpen = true,
    className = '',
    children,
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`bg-white border border-border rounded-xl p-6 ${className}`}>
            {/* Widget Header */}
            <div
                className={`flex items-center justify-between pb-4 border-b border-border mb-5 ${
                    collapsible ? 'cursor-pointer' : ''
                }`}
                onClick={() => collapsible && setIsOpen(!isOpen)}
            >
                <h5 className="font-quicksand font-bold text-heading text-lg">
                    {title}
                </h5>
                {collapsible && (
                    <svg
                        className={`w-5 h-5 text-muted transition-transform ${
                            isOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                )}
            </div>

            {/* Widget Content */}
            {(!collapsible || isOpen) && children}
        </div>
    );
}
