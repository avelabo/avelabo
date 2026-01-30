<?php

namespace App\Mail\Admin;

use App\Mail\Concerns\ChecksMailableSettings;
use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewContactMessageMail extends Mailable implements ShouldQueue
{
    use ChecksMailableSettings;
    use Queueable;
    use SerializesModels;

    public function __construct(public ContactMessage $message)
    {
        $this->configureQueueConnection();
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Contact Message - '.$this->message->subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.admin.new-contact-message',
            with: [
                'contactMessage' => $this->message,
                'url' => url('/admin/contact-messages/'.$this->message->id),
            ],
        );
    }
}
