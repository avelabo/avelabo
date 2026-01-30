<?php

namespace App\Notifications\Customer;

use App\Models\Order;
use App\Notifications\Concerns\ChecksNotificationSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RefundCompletedNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationSettings;
    use Queueable;

    public function __construct(
        public Order $order,
        public float $amount,
        public string $currency
    ) {
        $this->configureQueueConnection();
    }

    public function getEmailType(): string
    {
        return 'customer.refund_completed';
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Refund Complete - Order #'.$this->order->order_number)
            ->greeting('Refund Processed Successfully!')
            ->line('Your refund for order #'.$this->order->order_number.' has been processed.')
            ->line('**Refunded Amount:** '.number_format($this->amount, 2).' '.$this->currency)
            ->line('The funds have been credited to your original payment method.')
            ->action('Continue Shopping', url('/shop'))
            ->line('Thank you for your patience.');
    }

    public function toSms($notifiable): string
    {
        return 'Refund of '.number_format($this->amount, 2).' '.$this->currency.' completed for order #'.$this->order->order_number.'.';
    }
}
