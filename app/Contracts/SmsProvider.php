<?php

namespace App\Contracts;

interface SmsProvider
{
    /**
     * Send an SMS message.
     *
     * @param  string  $to  Phone number in international format
     * @param  string  $message  The SMS message content
     * @return bool Whether the SMS was sent successfully
     */
    public function send(string $to, string $message): bool;

    /**
     * Get the provider name.
     */
    public function getName(): string;

    /**
     * Check if the provider is configured and ready to send.
     */
    public function isConfigured(): bool;
}
