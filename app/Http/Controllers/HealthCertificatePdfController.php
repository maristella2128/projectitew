<?php

namespace App\Http\Controllers;

use App\Models\HealthRecord;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class HealthCertificatePdfController extends Controller
{
    public function generate(HealthRecord $record)
    {
        if ($record->record_type !== 'medical_certificate') abort(404);

        // Students can only download their own
        $user = auth()->user();
        if ($user->role === 'student' && $record->student_id !== $user->student->id) abort(403);

        $student = $record->student;
        $cert    = $record->certificate;

        $pdf = Pdf::loadView('pdf.medical_certificate', compact('student', 'cert', 'record'));

        // Save to storage and update path
        $path = "certificates/cert_{$record->id}.pdf";
        Storage::put("public/{$path}", $pdf->output());
        $cert->update(['pdf_path' => $path]);

        return $pdf->download("MedCert_{$student->last_name}_{$cert->issued_date->format('Y-m-d')}.pdf");
    }
}
