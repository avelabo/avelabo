<?php

namespace App\Notifications\Seller;

use App\Notifications\Concerns\ChecksNotificationSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StatusChangedNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationSettings;
    use Queueable;

    public function __construct(
        public string $newStatus,
        public ?string $reason = null
    ) {
        $this->configureQueueConnection();
    }

    public function getEmailType(): string
    {
        return 'seller.status_changed';
    }

    protected function getRecipientType(): string
    {
        return 'seller';
    }

    public function toMail($notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('Seller Account Status Update')
            ->greeting('Account Status Changed')
            ->line('Your seller account status has been updated to: **'.ucfirst($this->newStatus).'**');

        if ($this->reason) {
            $message->line('**Reason:** '.$this->reason);
        }

        if ($this->newStatus === 'active') {
            $message->line('Your seller account is now active. You can continue selling on our platform.');
        } elseif ($this->newStatus === 'suspended') {
            $message->line('Your seller account has been suspended. Your products are temporarily hidden from the marketplace.');
        } elseif ($this->newStatus === 'inactive') {
            $message->line('Your seller account is currently inactive.');
        }

        return $message
            ->action('Go to Seller Dashboard', url('/seller'))
            ->line('If you have questions about this change, please contact our support team.');
    }

    public function toSms($notifiable): string
    {
        return 'Your '.config('app.name').' seller status changed to '.ucfirst($this->newStatus).'.'.($this->reason ? ' Reason: '.$this->reason : '');
    }
}
