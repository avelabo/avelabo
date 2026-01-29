<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\Payment;
use App\Models\PaymentGateway;
use App\Models\Refund;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a listing of transactions (payments)
     */
    public function index(Request $request)
    {
        $query = Payment::with([
            'order:id,order_number,user_id,total,status',
            'order.user:id,name,email',
            'gateway:id,name,slug,display_name,logo',
            'currency:id,code,symbol',
        ]);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('transaction_id', 'like', "%{$search}%")
                    ->orWhereHas('order', fn ($o) => $o->where('order_number', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")));
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Gateway filter
        if ($request->filled('gateway')) {
            $query->where('payment_gateway_id', $request->gateway);
        }

        // Date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $transactions = $query->latest()
            ->paginate(20)
            ->withQueryString();

        // Stats
        $stats = [
            'total' => Payment::count(),
            'paid' => Payment::where('status', 'paid')->count(),
            'pending' => Payment::where('status', 'pending')->count(),
            'failed' => Payment::where('status', 'failed')->count(),
            'total_amount' => Payment::where('status', 'paid')->sum('amount'),
        ];

        // Get payment gateways for filter
        $gateways = PaymentGateway::orderBy('name')->get(['id', 'name', 'display_name', 'logo']);

        // Check if user can clear data (superguy only)
        $canClearData = Auth::user()->email === 'superguy@avelabo.com';

        return Inertia::render('Admin/Transactions/Index', [
            'transactions' => $transactions,
            'stats' => $stats,
            'gateways' => $gateways,
            'filters' => $request->only(['search', 'status', 'gateway', 'date_from', 'date_to']),
            'canClearData' => $canClearData,
        ]);
    }

    /**
     * Display a specific transaction
     */
    public function show(Payment $payment)
    {
        $payment->load([
            'order.user:id,name,email,phone',
            'order.items.product:id,name,slug',
            'order.shippingAddress',
            'gateway:id,name,slug,display_name,logo',
            'currency:id,code,symbol',
            'refunds',
        ]);

        return Inertia::render('Admin/Transactions/Show', [
            'transaction' => $payment,
        ]);
    }

    /**
     * Clear all orders and transactions (superguy only)
     */
    public function clearAll(Request $request)
    {
        // Only allow superguy@avelabo.com
        if (Auth::user()->email !== 'superguy@avelabo.com') {
            return back()->with('error', 'You do not have permission to perform this action.');
        }

        // Require confirmation
        $request->validate([
            'confirmation' => ['required', 'string', 'in:CLEAR ALL DATA'],
        ]);

        DB::beginTransaction();

        try {
            // Delete in order to respect foreign key constraints
            Refund::query()->delete();
            OrderStatusHistory::query()->delete();
            Payment::query()->delete();
            OrderItem::query()->delete();
            Order::query()->delete();

            DB::commit();

            return back()->with('success', 'All orders and transactions have been cleared.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Failed to clear data: '.$e->getMessage());
        }
    }
}
