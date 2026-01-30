<?php

namespace App\Notifications\Seller;

use App\Models\Order;
use App\Notifications\Concerns\ChecksNotificationSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Collection;

class OrderPaidNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationSettings;
    use Queueable;

    public function __construct(
        public Order $order,
        public Collection $sellerItems
    ) {
        $this->configureQueueConnection();
    }

    public function getEmailType(): string
    {
        return 'seller.order_paid';
    }

    protected function getRecipientType(): string
    {
        return 'seller';
    }

    public function toMail($notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('Order Paid - Ready to Fulfill #'.$this->order->order_number)
            ->greeting('Payment Confirmed!')
            ->line('Payment has been received for order #'.$this->order->order_number.'. It\'s now ready for fulfillment.')
            ->line('**Items to Prepare:**');

        foreach ($this->sellerItems as $item) {
            $message->line('- '.$item->product_name.' x '.$item->quantity);
        }

        $message->line('**Shipping Address:**')
            ->line($this->order->shipping_address);

        return $message
            ->action('Process Order', url('/seller/orders/'.$this->order->id))
            ->line('Please ship this order within 2 business days.');
    }

    public function toSms($notifiable): string
    {
        return 'Order #'.$this->order->order_number.' paid! Ready to ship. Process at '.config('app.url').'/seller/orders/'.$this->order->id;
    }
}
