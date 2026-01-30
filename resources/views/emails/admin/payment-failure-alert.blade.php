<x-mail::message>
# Payment Failed Alert

A payment has failed for an order.

**Order Details:**
- **Order Number:** #{{ $order->order_number }}
- **Customer:** {{ $order->customer_name }}
- **Email:** {{ $order->customer_email }}
- **Amount:** {{ number_format($order->total_amount, 2) }} {{ $order->currency }}

@if($reason)
**Failure Reason:** {{ $reason }}
@endif

<x-mail::button :url="$url">
View Order
</x-mail::button>

The customer has been notified and may retry payment.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
