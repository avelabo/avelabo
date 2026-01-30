<?php

namespace App\Notifications\Customer;

use App\Models\Order;
use App\Notifications\Concerns\ChecksNotificationSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderShippedNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationSettings;
    use Queueable;

    public function __construct(
        public Order $order,
        public ?string $trackingNumber = null,
        public ?string $carrier = null
    ) {
        $this->configureQueueConnection();
    }

    public function getEmailType(): string
    {
        return 'customer.order_shipped';
    }

    public function toMail($notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('Order Shipped - #'.$this->order->order_number)
            ->greeting('Your Order is On Its Way!')
            ->line('Your order #'.$this->order->order_number.' has been shipped.');

        if ($this->carrier) {
            $message->line('**Carrier:** '.$this->carrier);
        }

        if ($this->trackingNumber) {
            $message->line('**Tracking Number:** '.$this->trackingNumber);
        }

        $message->line('**Delivery Address:**')
            ->line($this->order->shipping_address);

        return $message
            ->action('Track Order', url('/customer/orders/'.$this->order->id))
            ->line('You\'ll receive another notification once your order is delivered.');
    }

    public function toSms($notifiable): string
    {
        $sms = 'Order #'.$this->order->order_number.' shipped!';
        if ($this->trackingNumber) {
            $sms .= ' Tracking: '.$this->trackingNumber.'.';
        }
        $sms .= ' Track at '.config('app.url').'/customer/orders/'.$this->order->id;

        return $sms;
    }
}
