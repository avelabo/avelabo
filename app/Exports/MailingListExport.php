<?php

namespace App\Exports;

use App\Models\MailingListSubscriber;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MailingListExport implements FromCollection, ShouldAutoSize, WithHeadings, WithMapping, WithStyles
{
    public function __construct(
        protected bool $activeOnly = true
    ) {}

    public function collection(): Collection
    {
        $query = MailingListSubscriber::query()->with('user');

        if ($this->activeOnly) {
            $query->active();
        }

        return $query->orderBy('subscribed_at', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Email',
            'Name',
            'Source',
            'Status',
            'Subscribed At',
            'Unsubscribed At',
            'Linked User ID',
        ];
    }

    /**
     * @param  MailingListSubscriber  $subscriber
     */
    public function map($subscriber): array
    {
        return [
            $subscriber->id,
            $subscriber->email,
            $subscriber->name ?? '',
            $subscriber->source,
            $subscriber->is_active ? 'Active' : 'Inactive',
            $subscriber->subscribed_at?->format('Y-m-d H:i:s'),
            $subscriber->unsubscribed_at?->format('Y-m-d H:i:s'),
            $subscriber->user_id,
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => [
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'F1B945'],
                ],
            ],
        ];
    }
}
