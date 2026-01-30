<?php

namespace App\Notifications\Seller;

use App\Notifications\Concerns\ChecksNotificationSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class KycRejectedNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationSettings;
    use Queueable;

    public function __construct(public ?string $reason = null)
    {
        $this->configureQueueConnection();
    }

    public function getEmailType(): string
    {
        return 'seller.kyc_rejected';
    }

    protected function getRecipientType(): string
    {
        return 'seller';
    }

    public function toMail($notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('KYC Verification Update')
            ->greeting('KYC Review Complete')
            ->line('Unfortunately, we were unable to approve your KYC verification at this time.');

        if ($this->reason) {
            $message->line('**Reason:** '.$this->reason);
        }

        return $message
            ->line('**What you can do:**')
            ->line('1. Review the reason above')
            ->line('2. Ensure your documents are clear and valid')
            ->line('3. Resubmit your KYC documents')
            ->action('Resubmit KYC', url('/seller/kyc'))
            ->line('If you have questions, please contact our support team.');
    }

    public function toSms($notifiable): string
    {
        return 'Your '.config('app.name').' KYC was not approved.'.($this->reason ? ' Reason: '.$this->reason : '').' Resubmit at '.config('app.url').'/seller/kyc';
    }
}
