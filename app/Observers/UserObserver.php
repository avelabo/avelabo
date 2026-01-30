<?php

namespace App\Observers;

use App\Models\MailingListSubscriber;
use App\Models\Setting;
use App\Models\User;

class UserObserver
{
    /**
     * Handle the User "created" event.
     * Optionally subscribe the user to the mailing list based on settings.
     */
    public function created(User $user): void
    {
        $autoSubscribe = Setting::get('auto_subscribe_users_to_mailing_list', false);

        if ($autoSubscribe) {
            $this->subscribeUserToMailingList($user);
        }
    }

    /**
     * Handle the User "updated" event.
     * Sync email changes to the mailing list if subscribed.
     */
    public function updated(User $user): void
    {
        if ($user->isDirty('email')) {
            $subscriber = MailingListSubscriber::where('user_id', $user->id)->first();

            if ($subscriber) {
                $oldEmail = $user->getOriginal('email');
                $newEmail = $user->email;

                // Check if new email already exists
                $existingWithNewEmail = MailingListSubscriber::where('email', $newEmail)
                    ->where('id', '!=', $subscriber->id)
                    ->first();

                if (! $existingWithNewEmail) {
                    $subscriber->update(['email' => $newEmail]);
                }
            }
        }

        if ($user->isDirty('name')) {
            MailingListSubscriber::where('user_id', $user->id)
                ->update(['name' => $user->name]);
        }
    }

    /**
     * Handle the User "deleted" event.
     * Unsubscribe the user from the mailing list (soft unsubscribe).
     */
    public function deleted(User $user): void
    {
        MailingListSubscriber::where('user_id', $user->id)
            ->update([
                'is_active' => false,
                'unsubscribed_at' => now(),
            ]);
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        // Optionally resubscribe on restore
        $autoResubscribe = Setting::get('auto_resubscribe_restored_users', false);

        if ($autoResubscribe) {
            MailingListSubscriber::where('user_id', $user->id)
                ->update([
                    'is_active' => true,
                    'unsubscribed_at' => null,
                ]);
        }
    }

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void
    {
        // Keep the subscriber record but remove user association
        MailingListSubscriber::where('user_id', $user->id)
            ->update([
                'user_id' => null,
                'is_active' => false,
                'unsubscribed_at' => now(),
            ]);
    }

    /**
     * Subscribe a user to the mailing list.
     */
    protected function subscribeUserToMailingList(User $user): void
    {
        // Check if already subscribed with this email
        $existingSubscriber = MailingListSubscriber::where('email', $user->email)->first();

        if ($existingSubscriber) {
            // Link user to existing subscription if not already linked
            if (! $existingSubscriber->user_id) {
                $existingSubscriber->update([
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'is_active' => true,
                    'unsubscribed_at' => null,
                ]);
            }

            return;
        }

        MailingListSubscriber::create([
            'email' => $user->email,
            'name' => $user->name,
            'user_id' => $user->id,
            'source' => 'user_registration',
            'is_active' => true,
            'subscribed_at' => now(),
        ]);
    }
}
