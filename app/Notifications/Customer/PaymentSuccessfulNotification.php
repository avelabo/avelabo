<?php

namespace App\Notifications\Customer;

use App\Models\Order;
use App\Models\Payment;
use App\Notifications\Concerns\ChecksNotificationSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentSuccessfulNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationSettings;
    use Queueable;

    public function __construct(
        public Order $order,
        public Payment $payment
    ) {
        $this->configureQueueConnection();
    }

    public function getEmailType(): string
    {
        return 'customer.payment_successful';
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Payment Received - Order #'.$this->order->order_number)
            ->greeting('Payment Confirmed!')
            ->line('We\'ve received your payment for order #'.$this->order->order_number.'.')
            ->line('**Payment Details:**')
            ->line('Amount: '.number_format($this->payment->amount, 2).' '.$this->payment->currency)
            ->line('Method: '.ucfirst($this->payment->payment_method))
            ->line('Reference: '.$this->payment->transaction_id)
            ->action('View Order', url('/customer/orders/'.$this->order->id))
            ->line('Your order is now being prepared for shipping.');
    }

    public function toSms($notifiable): string
    {
        return 'Payment of '.number_format($this->payment->amount, 2).' '.$this->payment->currency.' received for order #'.$this->order->order_number.'. Thank you!';
    }
}
