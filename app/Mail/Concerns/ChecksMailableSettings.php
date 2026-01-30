<?php

namespace App\Mail\Concerns;

use App\Models\Setting;

trait ChecksMailableSettings
{
    /**
     * Check if queueing is enabled and configure connection accordingly.
     * Call this in the constructor of each mailable.
     */
    protected function configureQueueConnection(): void
    {
        if (! $this->shouldQueue()) {
            $this->connection = 'sync';
        }
    }

    /**
     * Check if email queueing is enabled in settings.
     */
    protected function shouldQueue(): bool
    {
        return Setting::get('email_queue_enabled', false);
    }
}
