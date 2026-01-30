<?php

namespace App\Notifications\Customer;

use App\Notifications\Concerns\ChecksNotificationSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Password;

class WelcomeNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationSettings;
    use Queueable;

    public function __construct(public bool $isQuickCheckout = false)
    {
        $this->configureQueueConnection();
    }

    public function getEmailType(): string
    {
        return 'customer.welcome';
    }

    public function toMail($notifiable): MailMessage
    {
        $token = Password::createToken($notifiable);
        $resetUrl = url(route('password.reset', [
            'token' => $token,
            'email' => $notifiable->email,
        ], false));

        $message = (new MailMessage)
            ->subject('Welcome to '.config('app.name'))
            ->greeting('Welcome, '.$notifiable->name.'!')
            ->line('Thank you for joining '.config('app.name').', your trusted marketplace for quality products.');

        if ($this->isQuickCheckout) {
            $message->line('Your account has been created as part of your checkout. To access your order history and manage your account, please set up your password.')
                ->action('Set Your Password', $resetUrl);
        } else {
            $message->line('We\'re excited to have you on board. Start exploring our wide selection of products from trusted sellers.')
                ->action('Start Shopping', url('/shop'));
        }

        return $message->line('If you have any questions, our support team is here to help.');
    }

    public function toSms($notifiable): string
    {
        return 'Welcome to '.config('app.name').'! Your account is ready. Visit '.config('app.url').' to start shopping.';
    }
}
