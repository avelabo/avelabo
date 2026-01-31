<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NotificationLog;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationLogController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService
    ) {}

    public function index(Request $request): Response
    {
        $query = NotificationLog::with('user:id,first_name,last_name,email')
            ->latest();

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by email type
        if ($request->filled('email_type')) {
            $query->where('email_type', $request->email_type);
        }

        // Filter by recipient type
        if ($request->filled('recipient_type')) {
            $query->where('recipient_type', $request->recipient_type);
        }

        // Filter by channel
        if ($request->filled('channel')) {
            $query->where('channel', $request->channel);
        }

        // Search by email
        if ($request->filled('search')) {
            $query->where('recipient_email', 'like', '%'.$request->search.'%');
        }

        // Date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->paginate(25)->withQueryString();

        // Stats
        $stats = [
            'total' => NotificationLog::count(),
            'sent' => NotificationLog::sent()->count(),
            'failed' => NotificationLog::failed()->count(),
            'pending' => NotificationLog::pending()->count(),
            'retryable' => NotificationLog::retryable()->count(),
        ];

        // Get unique email types for filter
        $emailTypes = NotificationLog::select('email_type')
            ->distinct()
            ->pluck('email_type');

        return Inertia::render('Admin/NotificationLogs/Index', [
            'logs' => $logs,
            'stats' => $stats,
            'emailTypes' => $emailTypes,
            'filters' => $request->only(['status', 'email_type', 'recipient_type', 'channel', 'search', 'date_from', 'date_to']),
        ]);
    }

    public function show(NotificationLog $notificationLog): Response
    {
        $notificationLog->load('user:id,first_name,last_name,email');

        return Inertia::render('Admin/NotificationLogs/Show', [
            'log' => $notificationLog,
        ]);
    }

    public function retry(NotificationLog $notificationLog): RedirectResponse
    {
        if (! $notificationLog->canRetry()) {
            return back()->with('error', 'This notification cannot be retried. Maximum attempts reached or already sent.');
        }

        $success = $this->notificationService->retry($notificationLog);

        if ($success) {
            return back()->with('success', 'Notification sent successfully.');
        }

        return back()->with('error', 'Failed to send notification. Check the error details.');
    }

    public function retryAll(): RedirectResponse
    {
        $retryable = NotificationLog::retryable()->get();

        if ($retryable->isEmpty()) {
            return back()->with('info', 'No failed notifications to retry.');
        }

        $successCount = 0;
        $failCount = 0;

        foreach ($retryable as $log) {
            if ($this->notificationService->retry($log)) {
                $successCount++;
            } else {
                $failCount++;
            }
        }

        $message = "Retry complete: {$successCount} sent, {$failCount} failed.";

        return back()->with('success', $message);
    }

    public function destroy(NotificationLog $notificationLog): RedirectResponse
    {
        $notificationLog->delete();

        return back()->with('success', 'Notification log deleted.');
    }

    public function clearOld(Request $request): RedirectResponse
    {
        $days = $request->input('days', 30);

        $deleted = NotificationLog::where('created_at', '<', now()->subDays($days))
            ->where('status', 'sent')
            ->delete();

        return back()->with('success', "Deleted {$deleted} old notification logs.");
    }
}
