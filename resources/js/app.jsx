import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { route } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Avelabo';

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

        root.render(<App {...props} />);
    },
    progress: {
        color: '#3BB77E',
    },
});
