<?php

namespace App\Notifications\Customer;

use App\Models\Order;
use App\Notifications\Concerns\ChecksNotificationSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderProcessingNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationSettings;
    use Queueable;

    public function __construct(public Order $order)
    {
        $this->configureQueueConnection();
    }

    public function getEmailType(): string
    {
        return 'customer.order_processing';
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Order Being Prepared - #'.$this->order->order_number)
            ->greeting('Your Order is Being Prepared!')
            ->line('Great news! Your order #'.$this->order->order_number.' is now being prepared for shipping.')
            ->line('Our sellers are packing your items with care.')
            ->action('Track Order', url('/customer/orders/'.$this->order->id))
            ->line('We\'ll notify you as soon as your order ships.');
    }

    public function toSms($notifiable): string
    {
        return 'Order #'.$this->order->order_number.' is being prepared for shipping. Track at '.config('app.url').'/customer/orders/'.$this->order->id;
    }
}
