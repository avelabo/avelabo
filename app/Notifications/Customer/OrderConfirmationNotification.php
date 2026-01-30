<?php

namespace App\Notifications\Customer;

use App\Models\Order;
use App\Notifications\Concerns\ChecksNotificationSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderConfirmationNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationSettings;
    use Queueable;

    public function __construct(public Order $order)
    {
        $this->configureQueueConnection();
    }

    public function getEmailType(): string
    {
        return 'customer.order_confirmation';
    }

    public function toMail($notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('Order Confirmed - #'.$this->order->order_number)
            ->greeting('Thank you for your order!')
            ->line('Your order #'.$this->order->order_number.' has been received and is being processed.')
            ->line('**Order Summary:**');

        foreach ($this->order->items as $item) {
            $message->line('- '.$item->product_name.' x '.$item->quantity.' - '.number_format($item->display_price, 2).' '.$this->order->currency);
        }

        $message->line('**Total:** '.number_format($this->order->total_amount, 2).' '.$this->order->currency)
            ->action('View Order', url('/customer/orders/'.$this->order->id))
            ->line('We\'ll notify you when your order ships.');

        return $message;
    }

    public function toSms($notifiable): string
    {
        return 'Order #'.$this->order->order_number.' confirmed! Total: '.number_format($this->order->total_amount, 2).' '.$this->order->currency.'. Track at '.config('app.url').'/customer/orders/'.$this->order->id;
    }
}
