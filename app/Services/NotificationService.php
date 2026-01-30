<?php

namespace App\Services;

use App\Models\EmailSetting;
use App\Models\NotificationLog;
use App\Models\NotificationPreference;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification as NotificationFacade;

class NotificationService
{
    public function sendToUser(User $user, Notification $notification, string $recipientType = 'customer'): bool
    {
        $emailType = method_exists($notification, 'getEmailType')
            ? $notification->getEmailType()
            : get_class($notification);

        // Check if notification is enabled
        if (method_exists($notification, 'getEmailType')) {
            if (! $this->isNotificationEnabled($emailType, $recipientType)) {
                return false;
            }

            if (! $this->isUserNotificationEnabled($user->id, $emailType)) {
                return false;
            }
        }

        // Create log entry
        $log = $this->createLog($notification, $emailType, $recipientType, $user);

        try {
            $user->notify($notification);
            $log->markAsSent();

            return true;
        } catch (\Throwable $e) {
            $this->handleFailure($log, $e);

            return false;
        }
    }

    public function sendToAdmins(Notification|\Illuminate\Mail\Mailable $notification, string $emailType): bool
    {
        if (! $this->isNotificationEnabled($emailType, 'admin')) {
            return false;
        }

        $admins = User::whereHas('roles', function ($query) {
            $query->where('slug', 'admin');
        })->get();

        if ($admins->isEmpty()) {
            return false;
        }

        $success = true;

        foreach ($admins as $admin) {
            $log = $this->createLog($notification, $emailType, 'admin', $admin);

            try {
                if ($notification instanceof \Illuminate\Mail\Mailable) {
                    Mail::to($admin->email)->send($notification);
                } else {
                    $admin->notify($notification);
                }
                $log->markAsSent();
            } catch (\Throwable $e) {
                $this->handleFailure($log, $e);
                $success = false;
            }
        }

        return $success;
    }

    public function sendToEmail(string $email, Notification|\Illuminate\Mail\Mailable $notification, string $emailType): bool
    {
        if (! $this->isNotificationEnabled($emailType, 'customer')) {
            return false;
        }

        $log = $this->createLogForEmail($notification, $emailType, $email);

        try {
            if ($notification instanceof \Illuminate\Mail\Mailable) {
                Mail::to($email)->send($notification);
            } else {
                NotificationFacade::route('mail', $email)->notify($notification);
            }
            $log->markAsSent();

            return true;
        } catch (\Throwable $e) {
            $this->handleFailure($log, $e);

            return false;
        }
    }

    /**
     * Retry a failed notification
     */
    public function retry(NotificationLog $log): bool
    {
        if (! $log->canRetry()) {
            return false;
        }

        $log->resetForRetry();

        // Reconstruct and resend the notification
        try {
            $notificationClass = $log->notification_class;
            $notificationData = $log->notification_data;

            if (! class_exists($notificationClass)) {
                throw new \Exception("Notification class {$notificationClass} not found");
            }

            // For Mailables
            if (is_subclass_of($notificationClass, \Illuminate\Mail\Mailable::class)) {
                $notification = $this->reconstructMailable($notificationClass, $notificationData);

                if ($log->user_id) {
                    Mail::to($log->recipient_email)->send($notification);
                } else {
                    Mail::to($log->recipient_email)->send($notification);
                }
            } else {
                // For Notifications
                $notification = $this->reconstructNotification($notificationClass, $notificationData);

                if ($log->user_id) {
                    $user = User::find($log->user_id);
                    if ($user) {
                        $user->notify($notification);
                    } else {
                        throw new \Exception('User not found for retry');
                    }
                } else {
                    NotificationFacade::route('mail', $log->recipient_email)->notify($notification);
                }
            }

            $log->markAsSent();

            return true;
        } catch (\Throwable $e) {
            $this->handleFailure($log, $e);

            return false;
        }
    }

    public function isNotificationEnabled(string $emailType, string $recipientType = 'customer'): bool
    {
        return EmailSetting::isEnabled($emailType, $recipientType);
    }

    public function isUserNotificationEnabled(int $userId, string $emailType): bool
    {
        return NotificationPreference::isEmailEnabledForUser($userId, $emailType);
    }

    public function isSmsEnabled(string $emailType): bool
    {
        return EmailSetting::isSmsEnabled($emailType);
    }

    public function isQueueEnabled(): bool
    {
        return Setting::get('email_queue_enabled', false);
    }

    /**
     * Create a notification log entry for a user
     */
    protected function createLog(
        Notification|\Illuminate\Mail\Mailable $notification,
        string $emailType,
        string $recipientType,
        User $user
    ): NotificationLog {
        return NotificationLog::create([
            'email_type' => $emailType,
            'channel' => 'mail',
            'recipient_type' => $recipientType,
            'user_id' => $user->id,
            'recipient_email' => $user->email,
            'notification_class' => get_class($notification),
            'notification_data' => $this->serializeNotificationData($notification),
            'status' => 'pending',
        ]);
    }

    /**
     * Create a notification log entry for an email address
     */
    protected function createLogForEmail(
        Notification|\Illuminate\Mail\Mailable $notification,
        string $emailType,
        string $email
    ): NotificationLog {
        return NotificationLog::create([
            'email_type' => $emailType,
            'channel' => 'mail',
            'recipient_type' => 'customer',
            'recipient_email' => $email,
            'notification_class' => get_class($notification),
            'notification_data' => $this->serializeNotificationData($notification),
            'status' => 'pending',
        ]);
    }

    /**
     * Handle notification failure
     */
    protected function handleFailure(NotificationLog $log, \Throwable $e): void
    {
        $log->markAsFailed(
            $e->getMessage(),
            $e->getTraceAsString()
        );

        Log::error('Notification failed', [
            'log_id' => $log->id,
            'email_type' => $log->email_type,
            'recipient' => $log->recipient_email,
            'error' => $e->getMessage(),
        ]);
    }

    /**
     * Serialize notification data for retry capability
     */
    protected function serializeNotificationData(Notification|\Illuminate\Mail\Mailable $notification): array
    {
        $data = [];

        // Get public properties
        $reflection = new \ReflectionClass($notification);
        foreach ($reflection->getProperties(\ReflectionProperty::IS_PUBLIC) as $property) {
            $name = $property->getName();
            $value = $property->getValue($notification);

            // Handle Eloquent models - store ID and class
            if ($value instanceof \Illuminate\Database\Eloquent\Model) {
                $data[$name] = [
                    '_type' => 'model',
                    '_class' => get_class($value),
                    '_id' => $value->getKey(),
                ];
            } elseif ($value instanceof \Illuminate\Support\Collection) {
                // Handle collections
                $data[$name] = [
                    '_type' => 'collection',
                    '_items' => $value->map(function ($item) {
                        if ($item instanceof \Illuminate\Database\Eloquent\Model) {
                            return [
                                '_type' => 'model',
                                '_class' => get_class($item),
                                '_id' => $item->getKey(),
                            ];
                        }

                        return $item;
                    })->toArray(),
                ];
            } elseif (is_scalar($value) || is_array($value) || is_null($value)) {
                $data[$name] = $value;
            }
        }

        return $data;
    }

    /**
     * Reconstruct a notification from serialized data
     */
    protected function reconstructNotification(string $class, array $data): Notification
    {
        $args = $this->reconstructArgs($class, $data);

        return new $class(...$args);
    }

    /**
     * Reconstruct a mailable from serialized data
     */
    protected function reconstructMailable(string $class, array $data): \Illuminate\Mail\Mailable
    {
        $args = $this->reconstructArgs($class, $data);

        return new $class(...$args);
    }

    /**
     * Reconstruct constructor arguments from serialized data
     */
    protected function reconstructArgs(string $class, array $data): array
    {
        $reflection = new \ReflectionClass($class);
        $constructor = $reflection->getConstructor();

        if (! $constructor) {
            return [];
        }

        $args = [];
        foreach ($constructor->getParameters() as $param) {
            $name = $param->getName();

            if (! isset($data[$name])) {
                if ($param->isDefaultValueAvailable()) {
                    $args[] = $param->getDefaultValue();
                } else {
                    $args[] = null;
                }

                continue;
            }

            $value = $data[$name];

            // Reconstruct models
            if (is_array($value) && isset($value['_type'])) {
                if ($value['_type'] === 'model') {
                    $args[] = $value['_class']::find($value['_id']);
                } elseif ($value['_type'] === 'collection') {
                    $items = collect($value['_items'])->map(function ($item) {
                        if (is_array($item) && isset($item['_type']) && $item['_type'] === 'model') {
                            return $item['_class']::find($item['_id']);
                        }

                        return $item;
                    });
                    $args[] = $items;
                }
            } else {
                $args[] = $value;
            }
        }

        return $args;
    }
}
