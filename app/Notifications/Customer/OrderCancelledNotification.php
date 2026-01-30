<?php

namespace App\Notifications\Customer;

use App\Models\Order;
use App\Notifications\Concerns\ChecksNotificationSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderCancelledNotification extends Notification implements ShouldQueue
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
        return 'customer.order_cancelled';
    }

    public function toMail($notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('Order Cancelled - #'.$this->order->order_number)
            ->greeting('Order Cancellation Notice')
            ->line('Your order #'.$this->order->order_number.' has been cancelled.');

        if ($this->reason) {
            $message->line('**Reason:** '.$this->reason);
        }

        $message->line('If you paid for this order, a refund will be processed within 5-7 business days.')
            ->action('Continue Shopping', url('/shop'))
            ->line('If you have any questions about this cancellation, please contact our support team.');

        return $message;
    }

    public function toSms($notifiable): string
    {
        return 'Order #'.$this->order->order_number.' cancelled.'.($this->reason ? ' Reason: '.$this->reason.'.' : '').' Refund processing if paid.';
    }
}
