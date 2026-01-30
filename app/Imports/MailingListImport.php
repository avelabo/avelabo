<?php

namespace App\Imports;

use App\Models\MailingListSubscriber;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class MailingListImport implements ToCollection, WithHeadingRow
{
    protected int $imported = 0;

    protected int $skipped = 0;

    /**
     * @var array<string>
     */
    protected array $errors = [];

    public function collection(Collection $rows): void
    {
        foreach ($rows as $row) {
            $email = $row['email'] ?? null;

            if (! $email || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $this->errors[] = "Invalid email: {$email}";
                $this->skipped++;

                continue;
            }

            // Check if already exists
            $existing = MailingListSubscriber::where('email', $email)->first();

            if ($existing) {
                // Reactivate if inactive
                if (! $existing->is_active) {
                    $existing->update([
                        'is_active' => true,
                        'unsubscribed_at' => null,
                        'name' => $row['name'] ?? $existing->name,
                    ]);
                    $this->imported++;
                } else {
                    $this->skipped++;
                }

                continue;
            }

            MailingListSubscriber::create([
                'email' => $email,
                'name' => $row['name'] ?? null,
                'source' => 'import',
                'is_active' => true,
                'subscribed_at' => now(),
            ]);

            $this->imported++;
        }
    }

    public function getImportedCount(): int
    {
        return $this->imported;
    }

    public function getSkippedCount(): int
    {
        return $this->skipped;
    }

    /**
     * @return array<string>
     */
    public function getErrors(): array
    {
        return $this->errors;
    }
}
