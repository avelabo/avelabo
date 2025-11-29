<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of seller's orders
     */
    public function index(Request $request)
    {
        $seller = Auth::user()->seller;

        $orders = Order::where('seller_id', $seller->id)
            ->with(['user:id,name,email', 'currency:id,code,symbol'])
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('order_number', 'like', "%{$search}%")
                        ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($request->date_from, fn($q, $date) => $q->whereDate('created_at', '>=', $date))
            ->when($request->date_to, fn($q, $date) => $q->whereDate('created_at', '<=', $date))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'pending' => Order::where('seller_id', $seller->id)->where('status', 'pending')->count(),
            'processing' => Order::where('seller_id', $seller->id)->where('status', 'processing')->count(),
            'shipped' => Order::where('seller_id', $seller->id)->where('status', 'shipped')->count(),
            'delivered' => Order::where('seller_id', $seller->id)->where('status', 'delivered')->count(),
        ];

        return Inertia::render('Seller/Orders/Index', [
            'orders' => $orders,
            'stats' => $stats,
            'filters' => $request->only(['status', 'search', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Display the specified order
     */
    public function show(Order $order)
    {
        $seller = Auth::user()->seller;

        if ($order->seller_id !== $seller->id) {
            abort(403);
        }

        $order->load([
            'user:id,name,email,phone',
            'items.product:id,name,slug',
            'items.variant',
            'shippingAddress',
            'billingAddress',
            'payments',
            'statusHistory.changedBy:id,name',
            'currency',
        ]);

        return Inertia::render('Seller/Orders/Show', [
            'order' => $order,
            'availableStatuses' => $this->getAvailableStatuses($order->status),
        ]);
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, Order $order)
    {
        $seller = Auth::user()->seller;

        if ($order->seller_id !== $seller->id) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => ['required', 'in:processing,shipped,delivered,cancelled'],
            'comment' => ['nullable', 'string', 'max:500'],
            'tracking_number' => ['nullable', 'string', 'max:100'],
        ]);

        // Validate status transition
        $availableStatuses = $this->getAvailableStatuses($order->status);
        if (!in_array($validated['status'], $availableStatuses)) {
            return back()->with('error', 'Invalid status transition.');
        }

        // Update order
        $updateData = ['status' => $validated['status']];

        if ($validated['status'] === 'shipped') {
            $updateData['shipped_at'] = now();
            if (!empty($validated['tracking_number'])) {
                $updateData['tracking_number'] = $validated['tracking_number'];
            }
        } elseif ($validated['status'] === 'delivered') {
            $updateData['delivered_at'] = now();
        } elseif ($validated['status'] === 'cancelled') {
            $updateData['cancelled_at'] = now();
            $updateData['cancellation_reason'] = $validated['comment'];
        }

        $order->update($updateData);

        // Create status history
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => $validated['status'],
            'comment' => $validated['comment'],
            'changed_by' => Auth::id(),
        ]);

        return back()->with('success', 'Order status updated successfully.');
    }

    /**
     * Get available status transitions
     */
    protected function getAvailableStatuses(string $currentStatus): array
    {
        return match ($currentStatus) {
            'pending' => ['processing', 'cancelled'],
            'processing' => ['shipped', 'cancelled'],
            'shipped' => ['delivered'],
            'delivered' => [],
            'cancelled' => [],
            default => [],
        };
    }
}
