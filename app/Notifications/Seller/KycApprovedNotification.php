<?php

namespace App\Notifications\Seller;

use App\Notifications\Concerns\ChecksNotificationSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class KycApprovedNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationSettings;
    use Queueable;

    public function __construct()
    {
        $this->configureQueueConnection();
    }

    public function getEmailType(): string
    {
        return 'seller.kyc_approved';
    }

    protected function getRecipientType(): string
    {
        return 'seller';
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('KYC Approved - Welcome to '.config('app.name'))
            ->greeting('Congratulations!')
            ->line('Your KYC verification has been approved. Your seller account is now active!')
            ->line('**What\'s next?**')
            ->line('1. Set up your seller profile')
            ->line('2. Add your products')
            ->line('3. Start selling!')
            ->action('Go to Seller Dashboard', url('/seller'))
            ->line('Welcome to the '.config('app.name').' marketplace!');
    }

    public function toSms($notifiable): string
    {
        return 'Congratulations! Your '.config('app.name').' seller KYC is approved. Start selling at '.config('app.url').'/seller';
    }
}
