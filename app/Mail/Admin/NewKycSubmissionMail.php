<?php

namespace App\Mail\Admin;

use App\Mail\Concerns\ChecksMailableSettings;
use App\Models\Kyc;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewKycSubmissionMail extends Mailable implements ShouldQueue
{
    use ChecksMailableSettings;
    use Queueable;
    use SerializesModels;

    public function __construct(public Kyc $kyc)
    {
        $this->configureQueueConnection();
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New KYC Submission - '.$this->kyc->seller->business_name,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.admin.new-kyc-submission',
            with: [
                'kyc' => $this->kyc,
                'seller' => $this->kyc->seller,
                'url' => url('/admin/kyc/'.$this->kyc->id),
            ],
        );
    }
}
