<?php

namespace App\Mail\Admin;

use App\Mail\Concerns\ChecksMailableSettings;
use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RefundAlertMail extends Mailable implements ShouldQueue
{
    use ChecksMailableSettings;
    use Queueable;
    use SerializesModels;

    public function __construct(
        public Order $order,
        public float $amount,
        public string $currency
    ) {
        $this->configureQueueConnection();
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Refund Initiated - Order #'.$this->order->order_number.' - '.number_format($this->amount, 2).' '.$this->currency,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.admin.refund-alert',
            with: [
                'order' => $this->order,
                'amount' => $this->amount,
                'currency' => $this->currency,
                'url' => url('/admin/orders/'.$this->order->id),
            ],
        );
    }
}
