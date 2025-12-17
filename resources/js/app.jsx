import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { route } from 'ziggy-js';
import SessionExpiredModal from '@/Components/SessionExpiredModal';
import { useState, useEffect } from 'react';

const appName = import.meta.env.VITE_APP_NAME || 'Avelabo';

// Session expired state management
let setSessionExpiredGlobal = null;

function SessionExpiredWrapper({ children }) {
    const [sessionExpired, setSessionExpired] = useState(false);
    
    useEffect(() => {
        setSessionExpiredGlobal = setSessionExpired;
        
        return () => {
            setSessionExpiredGlobal = null;
        };
    }, []);
    
    return (
        <>
            {children}
            <SessionExpiredModal show={sessionExpired} />
        </>
    );
}

// Listen for 419 errors globally
router.on('invalid', (event) => {
    if (event.detail.response.status === 419) {
        event.preventDefault();
        if (setSessionExpiredGlobal) {
            setSessionExpiredGlobal(true);
        }
    }
});

// Make route helper globally available
window.route = route;

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Set up Ziggy with the routes from props
        if (props.initialPage.props.ziggy) {
            window.Ziggy = props.initialPage.props.ziggy;
        }

        root.render(
            <SessionExpiredWrapper>
                <App {...props} />
            </SessionExpiredWrapper>
        );
    },
    progress: {
        color: '#3BB77E',
    },
});
