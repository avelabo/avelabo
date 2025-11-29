<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     */
    public function __invoke(Request $request): Response
    {
        return $request->user()->hasVerifiedEmail()
            ? redirect()->intended('/')
            : Inertia::render('Auth/VerifyEmail', [
                'status' => session('status'),
            ]);
    }
}
