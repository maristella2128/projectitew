<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Carbon\Carbon;

class ClearanceExport implements FromCollection, WithHeadings, WithMapping
{
    protected $clearances;

    public function __construct($clearances)
    {
        $this->clearances = $clearances;
    }

    public function collection()
    {
        return $this->clearances;
    }

    public function headings(): array
    {
        return [
            'Student ID',
            'Full Name',
            'Course',
            'Year Level',
            'Section',
            'Status',
            'Cleared For',
            'Behavior Score',
            'Last Evaluated'
        ];
    }

    public function map($clearance): array
    {
        $student = $clearance->student;
        return [
            $student->student_id,
            $student->name,
            $student->course,
            $student->year_level,
            $student->section?->name ?? 'N/A',
            $clearance->status_label,
            implode(', ', $clearance->cleared_for ?? []),
            $student->conductScore?->total_score ?? 100,
            $clearance->last_evaluated_at ? Carbon::parse($clearance->last_evaluated_at)->format('Y-m-d H:i') : 'Never'
        ];
    }
}
