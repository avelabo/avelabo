<?php

namespace App\Services\Sms;

use App\Contracts\SmsProvider;
use Illuminate\Support\Facades\Log;

class NullSmsProvider implements SmsProvider
{
    public function send(string $to, string $message): bool
    {
        Log::channel('daily')->info('SMS (NullProvider - not sent)', [
            'to' => $to,
            'message' => $message,
        ]);

        return true;
    }

    public function getName(): string
    {
        return 'null';
    }

    public function isConfigured(): bool
    {
        return true;
    }
}
