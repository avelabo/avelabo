export default function SessionExpiredModal({ show }) {
    if (!show) return null;

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slide-up">
                {/* Header with icon */}
                <div className="bg-brand-2 px-6 py-8 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="material-icons text-brand-2 text-3xl">schedule</span>
                    </div>
                    <h2 className="text-xl font-bold text-white font-quicksand">Session Expired</h2>
                </div>
                
                {/* Content */}
                <div className="px-6 py-6 text-center">
                    <p className="text-gray-600 mb-2">
                        Your session has expired for security reasons.
                    </p>
                    <p className="text-gray-500 text-sm mb-6">
                        Please refresh the page to continue where you left off.
                    </p>
                    
                    <button
                        onClick={handleRefresh}
                        className="w-full py-3 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:transform hover:-translate-y-0.5"
                    >
                        <span className="material-icons text-lg">refresh</span>
                        Refresh Page
                    </button>
                </div>
            </div>
        </div>
    );
}
