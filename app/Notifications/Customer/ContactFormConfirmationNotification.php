<?php

namespace App\Notifications\Customer;

use App\Notifications\Concerns\ChecksNotificationSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContactFormConfirmationNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationSettings;
    use Queueable;

    public function __construct(
        public string $name,
        public string $subject,
        public string $message
    ) {
        $this->configureQueueConnection();
    }

    public function getEmailType(): string
    {
        return 'customer.contact_form_confirmation';
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('We Received Your Message')
            ->greeting('Thank you for contacting us, '.$this->name.'!')
            ->line('We\'ve received your message and will get back to you as soon as possible.')
            ->line('**Your Message:**')
            ->line('Subject: '.$this->subject)
            ->line('"'.substr($this->message, 0, 200).(strlen($this->message) > 200 ? '...' : '').'"')
            ->line('Our team typically responds within 24-48 hours.')
            ->action('Visit Our Store', url('/'))
            ->line('Thank you for reaching out!');
    }

    public function toSms($notifiable): string
    {
        return 'Thank you for contacting '.config('app.name').'. We\'ve received your message and will respond within 24-48 hours.';
    }
}
