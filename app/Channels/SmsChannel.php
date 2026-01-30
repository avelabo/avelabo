<?php

namespace App\Channels;

use App\Contracts\SmsProvider;
use App\Models\EmailSetting;
use App\Models\NotificationPreference;
use Illuminate\Notifications\Notification;

class SmsChannel
{
    public function __construct(protected SmsProvider $smsProvider) {}

    public function send($notifiable, Notification $notification): void
    {
        if (! method_exists($notification, 'toSms')) {
            return;
        }

        if (! method_exists($notification, 'getEmailType')) {
            return;
        }

        $emailType = $notification->getEmailType();

        if (! EmailSetting::isSmsEnabled($emailType)) {
            return;
        }

        if ($notifiable->id && ! NotificationPreference::isSmsEnabledForUser($notifiable->id, $emailType)) {
            return;
        }

        $phoneNumber = $notifiable->routeNotificationFor('sms', $notification);

        if (empty($phoneNumber)) {
            return;
        }

        $message = $notification->toSms($notifiable);

        if (! empty($message)) {
            $this->smsProvider->send($phoneNumber, $message);
        }
    }
}
