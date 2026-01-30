<?php

namespace App\Mail\Admin;

use App\Mail\Concerns\ChecksMailableSettings;
use App\Models\Seller;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewSellerRegistrationMail extends Mailable implements ShouldQueue
{
    use ChecksMailableSettings;
    use Queueable;
    use SerializesModels;

    public function __construct(public Seller $seller)
    {
        $this->configureQueueConnection();
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Seller Registration - '.$this->seller->business_name,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.admin.new-seller-registration',
            with: [
                'seller' => $this->seller,
                'url' => url('/admin/sellers/'.$this->seller->id),
            ],
        );
    }
}
