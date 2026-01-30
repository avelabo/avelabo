<?php

namespace App\Notifications\Customer;

use App\Models\Order;
use App\Notifications\Concerns\ChecksNotificationSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TanPaymentInstructionsNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationSettings;
    use Queueable;

    public function __construct(
        public Order $order,
        public array $tanData
    ) {
        $this->configureQueueConnection();
    }

    public function getEmailType(): string
    {
        return 'customer.tan_payment_instructions';
    }

    public function toMail($notifiable): MailMessage
    {
        $tan = $this->tanData['timed_account_number'];
        $expiresAt = $this->tanData['expiry_date'] ?? 'in '.$this->tanData['expiry_in_minutes'].' minutes';
        $amount = $this->order->total;

        return (new MailMessage)
            ->subject('Payment Instructions - Order #'.$this->order->order_number)
            ->greeting('Complete Your Payment')
            ->line('Use the following TAN code to complete your payment via mobile money.')
            ->line('**Your TAN Code:** '.$tan)
            ->line('**Amount:** '.number_format($amount, 2).' '.($this->order->currency?->code ?? 'MWK'))
            ->line('**Expires:** '.$expiresAt)
            ->line('**Payment Instructions:**')
            ->line('1. Dial *123# on your mobile phone')
            ->line('2. Select "Make Payment"')
            ->line('3. Enter the TAN code above')
            ->line('4. Confirm the amount and complete payment')
            ->action('View Order', url('/customer/orders/'.$this->order->id))
            ->line('Your order will be processed once payment is confirmed.');
    }

    public function toSms($notifiable): string
    {
        $tan = $this->tanData['timed_account_number'];
        $expiresAt = $this->tanData['expiry_date'] ?? 'in '.$this->tanData['expiry_in_minutes'].' minutes';
        $amount = $this->order->total;

        return 'Order #'.$this->order->order_number.' TAN: '.$tan.'. Pay '.number_format($amount, 2).' '.($this->order->currency?->code ?? 'MWK').'. Expires: '.$expiresAt;
    }
}
