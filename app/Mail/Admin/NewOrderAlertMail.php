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

class NewOrderAlertMail extends Mailable implements ShouldQueue
{
    use ChecksMailableSettings;
    use Queueable;
    use SerializesModels;

    public function __construct(public Order $order)
    {
        $this->configureQueueConnection();
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Order #'.$this->order->order_number.' - '.number_format($this->order->total_amount, 2).' '.$this->order->currency,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.admin.new-order-alert',
            with: [
                'order' => $this->order,
                'url' => url('/admin/orders/'.$this->order->id),
            ],
        );
    }
}
