<?php

namespace App\Console\Commands;

use App\Models\ConductAlert;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class ExportUnresolvedAlerts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'conduct:export-alerts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Export all unresolved conduct alerts to a CSV file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting export of unresolved conduct alerts...');

        $alerts = ConductAlert::with(['student.section'])
            ->where('is_resolved', false)
            ->get();

        if ($alerts->isEmpty()) {
            $this->warn('No unresolved alerts found.');
            return;
        }

        $filename = 'exports/unresolved_alerts_' . now()->format('Y_m_d_His') . '.csv';
        
        // Ensure directory exists
        if (!Storage::disk('local')->exists('exports')) {
            Storage::disk('local')->makeDirectory('exports');
        }

        $handle = fopen(storage_path('app/' . $filename), 'w');
        
        // Headers
        fputcsv($handle, [
            'Student Name',
            'Student ID',
            'Course',
            'Section',
            'Alert Type',
            'Severity',
            'Message',
            'Created At'
        ]);

        foreach ($alerts as $alert) {
            fputcsv($handle, [
                $alert->student->name,
                $alert->student->student_id,
                $alert->student->course,
                $alert->student->section?->name ?? 'N/A',
                str_replace('_', ' ', strtoupper($alert->alert_type)),
                strtoupper($alert->severity),
                $alert->message,
                $alert->created_at->format('Y-m-d H:i:s'),
            ]);
        }

        fclose($handle);

        $this->info("Export completed successfully. File saved to: storage/app/{$filename}");
    }
}
