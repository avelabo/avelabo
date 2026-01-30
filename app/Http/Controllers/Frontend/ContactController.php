<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Mail\Admin\NewContactMessageMail;
use App\Models\ContactMessage;
use App\Notifications\Customer\ContactFormConfirmationNotification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Display the contact page
     */
    public function index()
    {
        return Inertia::render('Frontend/Contact', [
            'contactInfo' => [
                'offices' => [
                    [
                        'name' => 'Main Office',
                        'address' => 'Area 3, Lilongwe',
                        'city' => 'Lilongwe, Malawi',
                        'phone' => '+265 999 123 456',
                        'email' => 'info@avelabo.com',
                    ],
                    [
                        'name' => 'Blantyre Office',
                        'address' => 'Ginnery Corner',
                        'city' => 'Blantyre, Malawi',
                        'phone' => '+265 888 123 456',
                        'email' => 'blantyre@avelabo.com',
                    ],
                    [
                        'name' => 'Mzuzu Office',
                        'address' => 'Katoto',
                        'city' => 'Mzuzu, Malawi',
                        'phone' => '+265 111 123 456',
                        'email' => 'mzuzu@avelabo.com',
                    ],
                ],
                'support_email' => 'support@avelabo.com',
                'support_phone' => '+265 999 123 456',
            ],
        ]);
    }

    /**
     * Store a new contact message
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $contactMessage = ContactMessage::create($validated);

        // Send confirmation to customer
        $notificationService = app(NotificationService::class);
        $notificationService->sendToEmail(
            $validated['email'],
            new ContactFormConfirmationNotification($validated['name'], $validated['subject'], $validated['message']),
            'customer.contact_form_confirmation'
        );

        // Send alert to admins
        $notificationService->sendToAdmins(
            new NewContactMessageMail($contactMessage),
            'admin.new_contact_message'
        );

        return back()->with('success', 'Thank you for your message. We will get back to you soon!');
    }
}
