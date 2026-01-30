<?php

namespace App\Notifications\Concerns;

use App\Channels\SmsChannel;
use App\Models\EmailSetting;
use App\Models\NotificationPreference;
use App\Models\Setting;

trait ChecksNotificationSettings
{
    abstract public function getEmailType(): string;

    public function via($notifiable): array
    {
        $channels = [];

        if ($this->shouldSendEmail($notifiable)) {
            $channels[] = 'mail';
        }

        if ($this->shouldSendSms($notifiable)) {
            $channels[] = SmsChannel::class;
        }

        return $channels;
    }

    protected function shouldSendEmail($notifiable): bool
    {
        $emailType = $this->getEmailType();

        if (! EmailSetting::isEnabled($emailType, $this->getRecipientType())) {
            return false;
        }

        if ($notifiable->id) {
            return NotificationPreference::isEmailEnabledForUser($notifiable->id, $emailType);
        }

        return true;
    }

    protected function shouldSendSms($notifiable): bool
    {
        $emailType = $this->getEmailType();

        if (! EmailSetting::isSmsEnabled($emailType)) {
            return false;
        }

        if ($notifiable->id) {
            return NotificationPreference::isSmsEnabledForUser($notifiable->id, $emailType);
        }

        return true;
    }

    protected function getRecipientType(): string
    {
        return 'customer';
    }

    protected function shouldQueue(): bool
    {
        return Setting::get('email_queue_enabled', false);
    }

    /**
     * Configure the queue connection based on email settings.
     * Call this in the notification constructor.
     */
    protected function configureQueueConnection(): void
    {
        if (! $this->shouldQueue()) {
            $this->connection = 'sync';
        }
    }
}
