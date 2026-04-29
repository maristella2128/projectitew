<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Services\PortfolioGeneratorService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PortfolioController extends Controller
{
    /**
     * Generate and return the Auto Resume / Portfolio PDF for a student.
     */
    public function generate(Student $student, PortfolioGeneratorService $service)
    {
        // Check permissions or gate if necessary
        // Gate::authorize('view', $student);

        $pdfContent = $service->generate($student);
        $filename = "{$student->student_id}_{$student->last_name}_Portfolio.pdf";

        return response()->make($pdfContent, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $filename . '"',
        ]);
    }
}
