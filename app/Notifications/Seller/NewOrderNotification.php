<?php

namespace App\Notifications\Seller;

use App\Models\Order;
use App\Notifications\Concerns\ChecksNotificationSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Collection;

class NewOrderNotification extends Notification implements ShouldQueue
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
        return 'seller.new_order';
    }

    protected function getRecipientType(): string
    {
        return 'seller';
    }

    public function toMail($notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('New Order - #'.$this->order->order_number)
            ->greeting('New Order Received!')
            ->line('A customer has placed an order containing your products.')
            ->line('**Order Details:**')
            ->line('Order Number: #'.$this->order->order_number)
            ->line('Customer: '.$this->order->customer_name);

        $message->line('**Your Items:**');
        $total = 0;
        foreach ($this->sellerItems as $item) {
            $message->line('- '.$item->product_name.' x '.$item->quantity);
            $total += $item->base_price * $item->quantity;
        }

        $message->line('**Your Earnings (before commission):** '.number_format($total, 2).' '.$this->order->currency);

        return $message
            ->action('View Order', url('/seller/orders/'.$this->order->id))
            ->line('Please prepare these items for fulfillment.');
    }

    public function toSms($notifiable): string
    {
        return 'New order #'.$this->order->order_number.' received! '.$this->sellerItems->count().' item(s). View at '.config('app.url').'/seller/orders/'.$this->order->id;
    }
}
