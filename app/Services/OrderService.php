<?php

namespace App\Services;

use App\Mail\Admin\NewOrderAlertMail;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Seller;
use App\Models\User;
use App\Notifications\Customer\OrderCancelledNotification;
use App\Notifications\Customer\OrderConfirmationNotification;
use App\Notifications\Customer\OrderDeliveredNotification;
use App\Notifications\Customer\OrderProcessingNotification;
use App\Notifications\Customer\OrderShippedNotification;
use App\Notifications\Customer\PaymentSuccessfulNotification;
use App\Notifications\Seller\NewOrderNotification;
use App\Notifications\Seller\OrderPaidNotification;
use Illuminate\Support\Facades\DB;

class OrderService
{
    /**
     * Generate unique order number
     */
    public function generateOrderNumber(): string
    {
        $prefix = 'AVL';
        $date = now()->format('ymd');
        $random = strtoupper(substr(uniqid(), -4));

        $orderNumber = "{$prefix}-{$date}-{$random}";

        // Ensure uniqueness
        while (Order::where('order_number', $orderNumber)->exists()) {
            $random = strtoupper(substr(uniqid(), -4));
            $orderNumber = "{$prefix}-{$date}-{$random}";
        }

        return $orderNumber;
    }

    /**
     * Update order status with history tracking
     */
    public function updateOrderStatus(Order $order, string $status, ?string $note = null, ?User $updatedBy = null): Order
    {
        $oldStatus = $order->status;

        DB::transaction(function () use ($order, $status, $note, $updatedBy, $oldStatus) {
            // Update the order
            $updateData = ['status' => $status];

            // Update timestamps based on status
            switch ($status) {
                case 'processing':
                    if (! $order->paid_at) {
                        $updateData['paid_at'] = now();
                    }
                    break;
                case 'shipped':
                    $updateData['shipped_at'] = now();
                    break;
                case 'delivered':
                    $updateData['delivered_at'] = now();
                    break;
                case 'cancelled':
                    $updateData['cancelled_at'] = now();
                    if ($note) {
                        $updateData['cancellation_reason'] = $note;
                    }
                    break;
            }

            $order->update($updateData);

            // Create status history record
            OrderStatusHistory::create([
                'order_id' => $order->id,
                'status' => $status,
                'previous_status' => $oldStatus,
                'note' => $note,
                'created_by' => $updatedBy?->id,
            ]);
        });

        $order = $order->fresh();

        // Send status-based notifications
        $this->sendStatusNotification($order, $oldStatus, $status, $note);

        return $order;
    }

    /**
     * Send notifications based on order status change
     */
    protected function sendStatusNotification(Order $order, string $oldStatus, string $newStatus, ?string $note = null): void
    {
        if (! $order->user) {
            return;
        }

        $notificationService = app(NotificationService::class);

        switch ($newStatus) {
            case 'processing':
                // Send order processing notification to customer
                $notificationService->sendToUser(
                    $order->user,
                    new OrderProcessingNotification($order),
                    'customer'
                );

                // Send payment confirmation if this is a paid transition
                if ($order->latestPayment && $order->latestPayment->status === 'paid') {
                    $notificationService->sendToUser(
                        $order->user,
                        new PaymentSuccessfulNotification($order, $order->latestPayment),
                        'customer'
                    );

                    // Notify sellers that payment is confirmed
                    $this->notifySellersOrderPaid($order);
                }
                break;

            case 'shipped':
                $notificationService->sendToUser(
                    $order->user,
                    new OrderShippedNotification($order),
                    'customer'
                );
                break;

            case 'delivered':
                $notificationService->sendToUser(
                    $order->user,
                    new OrderDeliveredNotification($order),
                    'customer'
                );
                break;

            case 'cancelled':
                $notificationService->sendToUser(
                    $order->user,
                    new OrderCancelledNotification($order, $note),
                    'customer'
                );
                break;
        }
    }

    /**
     * Notify sellers when order payment is confirmed
     */
    protected function notifySellersOrderPaid(Order $order): void
    {
        $order->load('items.seller.user');
        $notificationService = app(NotificationService::class);

        // Group items by seller
        $sellerItems = $order->items->groupBy('seller_id');

        foreach ($sellerItems as $sellerId => $items) {
            $seller = Seller::with('user')->find($sellerId);
            if ($seller && $seller->user) {
                $notificationService->sendToUser(
                    $seller->user,
                    new OrderPaidNotification($order, $items),
                    'seller'
                );
            }
        }
    }

    /**
     * Update individual order item status
     */
    public function updateItemStatus(int $itemId, string $status, ?array $trackingData = null): void
    {
        $item = \App\Models\OrderItem::findOrFail($itemId);

        $updateData = ['status' => $status];

        if ($trackingData) {
            if (isset($trackingData['tracking_number'])) {
                $updateData['tracking_number'] = $trackingData['tracking_number'];
            }
            if (isset($trackingData['tracking_carrier'])) {
                $updateData['tracking_carrier'] = $trackingData['tracking_carrier'];
            }
        }

        if ($status === 'shipped') {
            $updateData['shipped_at'] = now();
        } elseif ($status === 'delivered') {
            $updateData['delivered_at'] = now();
        }

        $item->update($updateData);

        // Check if all items are in same status and update order
        $this->syncOrderStatus($item->order);
    }

    /**
     * Sync order status based on item statuses
     */
    protected function syncOrderStatus(Order $order): void
    {
        $order->load('items');

        $itemStatuses = $order->items->pluck('status')->unique();

        // If all items delivered, mark order as delivered
        if ($itemStatuses->count() === 1 && $itemStatuses->first() === 'delivered') {
            if ($order->status !== 'delivered') {
                $this->updateOrderStatus($order, 'delivered', 'All items delivered');
            }
        }
        // If all items shipped (or delivered), mark order as shipped
        elseif ($itemStatuses->every(fn ($s) => in_array($s, ['shipped', 'delivered']))) {
            if (! in_array($order->status, ['shipped', 'delivered'])) {
                $this->updateOrderStatus($order, 'shipped', 'All items shipped');
            }
        }
        // If all items cancelled, cancel order
        elseif ($itemStatuses->count() === 1 && $itemStatuses->first() === 'cancelled') {
            if ($order->status !== 'cancelled') {
                $this->updateOrderStatus($order, 'cancelled', 'All items cancelled');
            }
        }
    }

    /**
     * Get order with customer-safe data (no base prices or markup)
     */
    public function getOrderForCustomer(Order $order): array
    {
        $order->load([
            'items.product',
            'items.seller',
            'shippingAddress',
            'billingAddress',
            'payments.gateway',
            'statusHistory',
        ]);

        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status,
            'subtotal' => $order->subtotal,
            'shipping_amount' => $order->shipping_amount,
            'tax_amount' => $order->tax_amount,
            'discount_amount' => $order->discount_amount,
            'total' => $order->total,
            'notes' => $order->notes,
            'paid_at' => $order->paid_at?->toISOString(),
            'shipped_at' => $order->shipped_at?->toISOString(),
            'delivered_at' => $order->delivered_at?->toISOString(),
            'cancelled_at' => $order->cancelled_at?->toISOString(),
            'created_at' => $order->created_at->toISOString(),
            'items' => $order->items->map(fn ($item) => [
                'id' => $item->id,
                'product_name' => $item->product_name,
                'variant_name' => $item->variant_name,
                'product_image' => $item->product_image,
                'quantity' => $item->quantity,
                'price' => $item->display_price, // ONLY show display price
                'line_total' => $item->line_total,
                'status' => $item->status,
                'tracking_number' => $item->tracking_number,
                'tracking_carrier' => $item->tracking_carrier,
                'seller_name' => $item->seller?->business_name,
            ]),
            'shipping_address' => $order->shippingAddress ? [
                'name' => $order->shippingAddress->full_name,
                'address' => $order->shippingAddress->full_address,
                'phone' => $order->shippingAddress->phone,
            ] : null,
            'billing_address' => $order->billingAddress ? [
                'name' => $order->billingAddress->full_name,
                'address' => $order->billingAddress->full_address,
                'phone' => $order->billingAddress->phone,
            ] : null,
            'payment' => $order->latestPayment ? [
                'status' => $order->latestPayment->status,
                'method' => $order->latestPayment->payment_method,
                'gateway' => $order->latestPayment->gateway?->display_name,
            ] : null,
            'timeline' => $order->statusHistory->map(fn ($history) => [
                'status' => $history->status,
                'note' => $history->note,
                'created_at' => $history->created_at->toISOString(),
            ]),
        ];
    }

    /**
     * Get order with admin/seller data (includes pricing breakdown)
     */
    public function getOrderForAdmin(Order $order): array
    {
        $order->load([
            'user',
            'items.product',
            'items.seller',
            'shippingAddress',
            'billingAddress',
            'payments.gateway',
            'statusHistory.creator',
        ]);

        $customerData = $this->getOrderForCustomer($order);

        // Add admin-only data
        $customerData['user'] = [
            'id' => $order->user?->id,
            'name' => $order->user?->name,
            'email' => $order->user?->email,
            'phone' => $order->user?->phone,
        ];

        // Add pricing breakdown to items
        $customerData['items'] = $order->items->map(fn ($item) => [
            'id' => $item->id,
            'product_id' => $item->product_id,
            'product_name' => $item->product_name,
            'variant_name' => $item->variant_name,
            'product_image' => $item->product_image,
            'quantity' => $item->quantity,
            'base_price' => $item->base_price,
            'markup_amount' => $item->markup_amount,
            'display_price' => $item->display_price,
            'line_total' => $item->line_total,
            'status' => $item->status,
            'tracking_number' => $item->tracking_number,
            'tracking_carrier' => $item->tracking_carrier,
            'seller_id' => $item->seller_id,
            'seller_name' => $item->seller?->business_name,
        ]);

        // Calculate revenue breakdown
        $totalBasePrice = $order->items->sum(fn ($item) => $item->base_price * $item->quantity);
        $totalMarkup = $order->items->sum(fn ($item) => $item->markup_amount * $item->quantity);

        $customerData['revenue'] = [
            'seller_payout' => $totalBasePrice,
            'platform_revenue' => $totalMarkup,
            'total' => $order->total,
        ];

        return $customerData;
    }

    /**
     * Get seller's view of an order (only their items)
     */
    public function getOrderForSeller(Order $order, int $sellerId): array
    {
        $order->load([
            'items' => fn ($q) => $q->where('seller_id', $sellerId),
            'items.product',
            'shippingAddress',
            'user',
        ]);

        $sellerItems = $order->items->filter(fn ($item) => $item->seller_id === $sellerId);

        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'customer_name' => $order->user?->name,
            'status' => $order->status,
            'created_at' => $order->created_at->toISOString(),
            'items' => $sellerItems->map(fn ($item) => [
                'id' => $item->id,
                'product_name' => $item->product_name,
                'variant_name' => $item->variant_name,
                'product_image' => $item->product_image,
                'quantity' => $item->quantity,
                'price' => $item->base_price, // Seller sees their price
                'line_total' => $item->base_price * $item->quantity,
                'status' => $item->status,
                'tracking_number' => $item->tracking_number,
                'tracking_carrier' => $item->tracking_carrier,
            ]),
            'shipping_address' => $order->shippingAddress ? [
                'name' => $order->shippingAddress->full_name,
                'address' => $order->shippingAddress->full_address,
                'phone' => $order->shippingAddress->phone,
            ] : null,
            'seller_total' => $sellerItems->sum(fn ($item) => $item->base_price * $item->quantity),
        ];
    }

    /**
     * Send order confirmation notifications
     */
    public function sendOrderConfirmation(Order $order): void
    {
        if (! $order->user) {
            return;
        }

        $notificationService = app(NotificationService::class);

        // Send order confirmation to customer
        $notificationService->sendToUser(
            $order->user,
            new OrderConfirmationNotification($order),
            'customer'
        );

        // Send new order alerts to admins
        $notificationService->sendToAdmins(
            new NewOrderAlertMail($order),
            'admin.new_order'
        );

        // Notify sellers of new order
        $this->notifySellersNewOrder($order);
    }

    /**
     * Notify sellers when a new order is placed
     */
    protected function notifySellersNewOrder(Order $order): void
    {
        $order->load('items.seller.user');
        $notificationService = app(NotificationService::class);

        // Group items by seller
        $sellerItems = $order->items->groupBy('seller_id');

        foreach ($sellerItems as $sellerId => $items) {
            $seller = Seller::with('user')->find($sellerId);
            if ($seller && $seller->user) {
                $notificationService->sendToUser(
                    $seller->user,
                    new NewOrderNotification($order, $items),
                    'seller'
                );
            }
        }
    }

    /**
     * Cancel an order
     */
    public function cancelOrder(Order $order, string $reason, ?User $cancelledBy = null): Order
    {
        if (! $order->canBeCancelled()) {
            throw new \Exception('This order cannot be cancelled');
        }

        // Cancel all items
        $order->items()->update([
            'status' => 'cancelled',
        ]);

        // Update order status
        return $this->updateOrderStatus($order, 'cancelled', $reason, $cancelledBy);
    }
}
