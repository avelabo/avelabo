<?php

namespace App\Notifications\Customer;

use App\Models\Order;
use App\Notifications\Concerns\ChecksNotificationSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RefundInitiatedNotification extends Notification implements ShouldQueue
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
        return 'customer.refund_initiated';
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Refund Initiated - Order #'.$this->order->order_number)
            ->greeting('Refund Processing')
            ->line('A refund has been initiated for your order #'.$this->order->order_number.'.')
            ->line('**Refund Amount:** '.number_format($this->amount, 2).' '.$this->currency)
            ->line('**Expected Timeline:** 5-7 business days')
            ->line('The refund will be credited to your original payment method.')
            ->action('View Order', url('/customer/orders/'.$this->order->id))
            ->line('We\'ll notify you once the refund is complete.');
    }

    public function toSms($notifiable): string
    {
        return 'Refund of '.number_format($this->amount, 2).' '.$this->currency.' initiated for order #'.$this->order->order_number.'. Expected in 5-7 business days.';
    }
}
