<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\MailingListSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
        ]);

        $email = strtolower(trim($validated['email']));

        // Check if already subscribed
        $existing = MailingListSubscriber::where('email', $email)->first();

        if ($existing) {
            if ($existing->is_active) {
                return response()->json([
                    'success' => true,
                    'message' => 'You are already subscribed to our newsletter.',
                ]);
            }

            // Reactivate inactive subscription
            $existing->resubscribe();
            if (isset($validated['name'])) {
                $existing->update(['name' => $validated['name']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Welcome back! Your subscription has been reactivated.',
            ]);
        }

        // Link to authenticated user if logged in
        $userId = auth()->id();

        MailingListSubscriber::create([
            'email' => $email,
            'name' => $validated['name'] ?? null,
            'user_id' => $userId,
            'source' => 'website',
            'is_active' => true,
            'subscribed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you for subscribing! You\'ll receive our latest updates.',
        ]);
    }

    public function unsubscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'token' => ['nullable', 'string'], // For secure unsubscribe links
        ]);

        $email = strtolower(trim($validated['email']));
        $subscriber = MailingListSubscriber::where('email', $email)->first();

        if (! $subscriber) {
            return response()->json([
                'success' => false,
                'message' => 'Email address not found in our mailing list.',
            ], 404);
        }

        if (! $subscriber->is_active) {
            return response()->json([
                'success' => true,
                'message' => 'You have already unsubscribed.',
            ]);
        }

        $subscriber->unsubscribe();

        return response()->json([
            'success' => true,
            'message' => 'You have been successfully unsubscribed.',
        ]);
    }
}
