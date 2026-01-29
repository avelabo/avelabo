<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ComingSoonMiddleware
{
    /**
     * Routes that should be accessible even in maintenance/coming soon mode
     */
    protected array $exceptRoutes = [
        'coming-soon',
        'maintenance',
        'admin',
        'admin/*',
        'login',
        'logout',
        'register',
        'password/*',
        'email/*',
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($this->shouldPassThrough($request)) {
            return $next($request);
        }

        // Check maintenance mode first (higher priority)
        if ($this->isMaintenanceEnabled()) {
            return redirect()->route('maintenance');
        }

        // Check coming soon mode
        if ($this->isComingSoonEnabled()) {
            return redirect()->route('coming-soon');
        }

        return $next($request);
    }

    /**
     * Check if maintenance mode is enabled
     */
    protected function isMaintenanceEnabled(): bool
    {
        return Setting::get('maintenance_mode_enabled', false);
    }

    /**
     * Check if coming soon mode is enabled
     */
    protected function isComingSoonEnabled(): bool
    {
        return Setting::get('coming_soon_enabled', false);
    }

    /**
     * Check if the current request should bypass these modes
     */
    protected function shouldPassThrough(Request $request): bool
    {
        // Allow admin users to browse the site
        if ($request->user()?->is_admin) {
            return true;
        }

        // Check if route matches any exception pattern
        foreach ($this->exceptRoutes as $pattern) {
            if ($request->is($pattern)) {
                return true;
            }
        }

        return false;
    }
}
