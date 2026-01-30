<x-mail::message>
# New Order Alert

A new order has been placed on the platform.

**Order Details:**
- **Order Number:** #{{ $order->order_number }}
- **Customer:** {{ $order->customer_name }}
- **Email:** {{ $order->customer_email }}
- **Total:** {{ number_format($order->total_amount, 2) }} {{ $order->currency }}
- **Items:** {{ $order->items->count() }}
- **Status:** {{ ucfirst($order->status) }}
- **Placed:** {{ $order->created_at->format('M d, Y H:i') }}

**Shipping Address:**
{{ $order->shipping_address }}

<x-mail::button :url="$url">
View Order
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
