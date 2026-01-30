<?php

namespace App\Notifications\Customer;

use App\Models\Order;
use App\Notifications\Concerns\ChecksNotificationSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderDeliveredNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationSettings;
    use Queueable;

    public function __construct(public Order $order)
    {
        $this->configureQueueConnection();
    }

    public function getEmailType(): string
    {
        return 'customer.order_delivered';
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Order Delivered - #'.$this->order->order_number)
            ->greeting('Your Order Has Been Delivered!')
            ->line('Your order #'.$this->order->order_number.' has been delivered successfully.')
            ->line('We hope you\'re happy with your purchase!')
            ->line('**Help other shoppers by leaving a review**')
            ->line('Your feedback helps other customers make informed decisions.')
            ->action('Leave a Review', url('/customer/orders/'.$this->order->id.'#review'))
            ->line('If there\'s any issue with your order, please contact us within 7 days.');
    }

    public function toSms($notifiable): string
    {
        return 'Order #'.$this->order->order_number.' delivered! Leave a review at '.config('app.url').'/customer/orders/'.$this->order->id;
    }
}
