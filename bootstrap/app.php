<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\CartCookieMiddleware::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \App\Http\Middleware\ComingSoonMiddleware::class,
        ]);

        $middleware->alias([
            'seller' => \App\Http\Middleware\EnsureUserIsSeller::class,
            'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function ($response, $exception, Request $request) {
            if (! $request->is('api/*') && $exception instanceof HttpExceptionInterface) {
                $status = $exception->getStatusCode();

                $errorPages = [
                    403 => 'Errors/403',
                    404 => 'Errors/404',
                    419 => 'Errors/419',
                    429 => 'Errors/429',
                    500 => 'Errors/500',
                    503 => 'Errors/503',
                ];

                if (array_key_exists($status, $errorPages)) {
                    view()->share('isErrorPage', true);

                    return Inertia::render($errorPages[$status])
                        ->toResponse($request)
                        ->setStatusCode($status);
                }
            }

            return $response;
        });
    })->create();
