<?php

namespace App\Http\Controllers\Admin;

use App\Exports\MailingListExport;
use App\Http\Controllers\Controller;
use App\Imports\MailingListImport;
use App\Models\MailingListSubscriber;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class MailingListController extends Controller
{
    public function index(Request $request): Response
    {
        $query = MailingListSubscriber::query()
            ->with('user:id,name,email');

        // Search filter
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('email', 'ilike', "%{$search}%")
                    ->orWhere('name', 'ilike', "%{$search}%");
            });
        }

        // Status filter
        if ($request->has('status') && $request->input('status') !== '') {
            $status = $request->input('status');
            if ($status === 'active') {
                $query->active();
            } elseif ($status === 'inactive') {
                $query->inactive();
            }
        }

        // Source filter
        if ($source = $request->input('source')) {
            $query->fromSource($source);
        }

        $subscribers = $query->orderBy('subscribed_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        // Stats
        $stats = [
            'total' => MailingListSubscriber::count(),
            'active' => MailingListSubscriber::active()->count(),
            'inactive' => MailingListSubscriber::inactive()->count(),
            'from_website' => MailingListSubscriber::fromSource('website')->count(),
            'from_import' => MailingListSubscriber::fromSource('import')->count(),
            'from_registration' => MailingListSubscriber::fromSource('user_registration')->count(),
            'users_not_subscribed' => User::query()
                ->whereNotIn('email', MailingListSubscriber::active()->pluck('email'))
                ->count(),
        ];

        $settings = [
            'auto_subscribe_users' => Setting::get('auto_subscribe_users_to_mailing_list', false),
        ];

        return Inertia::render('Admin/MailingList/Index', [
            'subscribers' => $subscribers,
            'stats' => $stats,
            'settings' => $settings,
            'filters' => $request->only(['search', 'status', 'source']),
            'sources' => [
                'website' => 'Website Signup',
                'import' => 'File Import',
                'user_registration' => 'User Registration',
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'unique:mailing_list_subscribers,email'],
            'name' => ['nullable', 'string', 'max:255'],
        ]);

        MailingListSubscriber::create([
            'email' => $validated['email'],
            'name' => $validated['name'] ?? null,
            'source' => 'import',
            'is_active' => true,
            'subscribed_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Subscriber added successfully.');
    }

    public function update(Request $request, MailingListSubscriber $subscriber): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'unique:mailing_list_subscribers,email,'.$subscriber->id],
            'name' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        $subscriber->update($validated);

        if (isset($validated['is_active'])) {
            if ($validated['is_active'] && ! $subscriber->is_active) {
                $subscriber->update(['unsubscribed_at' => null]);
            } elseif (! $validated['is_active'] && $subscriber->is_active) {
                $subscriber->update(['unsubscribed_at' => now()]);
            }
        }

        return redirect()->back()->with('success', 'Subscriber updated successfully.');
    }

    public function destroy(MailingListSubscriber $subscriber): RedirectResponse
    {
        $subscriber->delete();

        return redirect()->back()->with('success', 'Subscriber deleted successfully.');
    }

    public function toggle(MailingListSubscriber $subscriber): RedirectResponse
    {
        if ($subscriber->is_active) {
            $subscriber->unsubscribe();
            $message = 'Subscriber deactivated.';
        } else {
            $subscriber->resubscribe();
            $message = 'Subscriber reactivated.';
        }

        return redirect()->back()->with('success', $message);
    }

    public function importFromUsers(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_ids' => ['nullable', 'array'],
            'user_ids.*' => ['exists:users,id'],
            'import_all' => ['boolean'],
        ]);

        $importAll = $validated['import_all'] ?? false;
        $userIds = $validated['user_ids'] ?? [];

        $query = User::query();

        if (! $importAll && ! empty($userIds)) {
            $query->whereIn('id', $userIds);
        }

        $users = $query->get();
        $imported = 0;
        $skipped = 0;

        foreach ($users as $user) {
            $existing = MailingListSubscriber::where('email', $user->email)->first();

            if ($existing) {
                // Link user if not linked
                if (! $existing->user_id) {
                    $existing->update([
                        'user_id' => $user->id,
                        'name' => $user->name,
                    ]);
                }
                $skipped++;

                continue;
            }

            MailingListSubscriber::create([
                'email' => $user->email,
                'name' => $user->name,
                'user_id' => $user->id,
                'source' => 'import',
                'is_active' => true,
                'subscribed_at' => now(),
            ]);

            $imported++;
        }

        return redirect()->back()->with('success', "Imported {$imported} users. Skipped {$skipped} existing.");
    }

    public function importFromFile(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:5120'],
        ]);

        $import = new MailingListImport;
        Excel::import($import, $request->file('file'));

        $imported = $import->getImportedCount();
        $skipped = $import->getSkippedCount();
        $errors = $import->getErrors();

        $message = "Imported {$imported} subscribers. Skipped {$skipped}.";

        if (! empty($errors)) {
            $message .= ' Some rows had errors.';
        }

        return redirect()->back()->with('success', $message);
    }

    public function export(Request $request): BinaryFileResponse
    {
        $activeOnly = $request->boolean('active_only', true);
        $filename = 'mailing-list-'.now()->format('Y-m-d-His').'.xlsx';

        return Excel::download(new MailingListExport($activeOnly), $filename);
    }

    public function updateSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'auto_subscribe_users' => ['boolean'],
        ]);

        Setting::set(
            'auto_subscribe_users_to_mailing_list',
            $validated['auto_subscribe_users'],
            'boolean',
            'mailing_list'
        );

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'in:activate,deactivate,delete'],
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:mailing_list_subscribers,id'],
        ]);

        $action = $validated['action'];
        $ids = $validated['ids'];

        switch ($action) {
            case 'activate':
                MailingListSubscriber::whereIn('id', $ids)->update([
                    'is_active' => true,
                    'unsubscribed_at' => null,
                ]);
                $message = count($ids).' subscribers activated.';
                break;

            case 'deactivate':
                MailingListSubscriber::whereIn('id', $ids)->update([
                    'is_active' => false,
                    'unsubscribed_at' => now(),
                ]);
                $message = count($ids).' subscribers deactivated.';
                break;

            case 'delete':
                MailingListSubscriber::whereIn('id', $ids)->delete();
                $message = count($ids).' subscribers deleted.';
                break;

            default:
                $message = 'No action performed.';
        }

        return redirect()->back()->with('success', $message);
    }

    public function getUnsubscribedUsers(): Response
    {
        $subscribedEmails = MailingListSubscriber::active()->pluck('email');

        $users = User::query()
            ->whereNotIn('email', $subscribedEmails)
            ->select(['id', 'name', 'email', 'created_at'])
            ->orderBy('name')
            ->paginate(50);

        return Inertia::render('Admin/MailingList/UnsubscribedUsers', [
            'users' => $users,
        ]);
    }
}
