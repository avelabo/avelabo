<?php

namespace App\Notifications\Seller;

use App\Notifications\Concerns\ChecksNotificationSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class KycDocumentsRequestedNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationSettings;
    use Queueable;

    public function __construct(
        public array $documents,
        public ?string $notes = null
    ) {
        $this->configureQueueConnection();
    }

    public function getEmailType(): string
    {
        return 'seller.kyc_documents_requested';
    }

    protected function getRecipientType(): string
    {
        return 'seller';
    }

    public function toMail($notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('Additional Documents Required for KYC')
            ->greeting('Additional Documents Needed')
            ->line('To complete your KYC verification, we need the following additional documents:');

        foreach ($this->documents as $doc) {
            $message->line('- '.$doc);
        }

        if ($this->notes) {
            $message->line('**Notes:** '.$this->notes);
        }

        return $message
            ->action('Upload Documents', url('/seller/kyc'))
            ->line('Please submit these documents within 7 days to avoid delays in your verification.');
    }

    public function toSms($notifiable): string
    {
        return 'Additional documents needed for your '.config('app.name').' KYC. Please check your email or visit '.config('app.url').'/seller/kyc';
    }
}
