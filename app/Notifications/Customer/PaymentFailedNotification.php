<?php

namespace App\Notifications\Customer;

use App\Models\Order;
use App\Notifications\Concerns\ChecksNotificationSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentFailedNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationSettings;
    use Queueable;

    public function __construct(
        public Order $order,
        public ?string $reason = null
    ) {
        $this->configureQueueConnection();
    }

    public function getEmailType(): string
    {
        return 'customer.payment_failed';
    }

    public function toMail($notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('Payment Failed - Order #'.$this->order->order_number)
            ->greeting('Payment Issue')
            ->line('Unfortunately, we couldn\'t process your payment for order #'.$this->order->order_number.'.');

        if ($this->reason) {
            $message->line('Reason: '.$this->reason);
        }

        return $message
            ->line('Don\'t worry - your order has been saved. Please try again with a different payment method.')
            ->action('Retry Payment', url('/payment/initiate/'.$this->order->id))
            ->line('If you continue to experience issues, please contact our support team.');
    }

    public function toSms($notifiable): string
    {
        return 'Payment failed for order #'.$this->order->order_number.'. Please retry at '.config('app.url').'/payment/initiate/'.$this->order->id;
    }
}
