<x-mail::message>
# Refund Initiated

A refund has been initiated for an order.

**Order Details:**
- **Order Number:** #{{ $order->order_number }}
- **Customer:** {{ $order->customer_name }}
- **Email:** {{ $order->customer_email }}

**Refund Details:**
- **Amount:** {{ number_format($amount, 2) }} {{ $currency }}
- **Original Order Total:** {{ number_format($order->total_amount, 2) }} {{ $order->currency }}

<x-mail::button :url="$url">
View Order
</x-mail::button>

Please ensure the refund is processed within the standard timeline.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
