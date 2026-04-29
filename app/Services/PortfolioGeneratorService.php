<?php

namespace App\Services;

use App\Models\Student;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Services\AcademicAlertService;

class PortfolioGeneratorService
{
    protected $alertService;

    public function __construct(AcademicAlertService $alertService)
    {
        $this->alertService = $alertService;
    }

    /**
     * Generate the Portfolio PDF for a given student
     */
    public function generate(Student $student): string
    {
        // 1. Eager load necessary relationships
        $student->load([
            'section',
            'semesterRecords.subjects',
            'studentActivities.activity.category',
            'studentSkills',
            'capstoneProjects',
            'ranking.topCategory',
        ]);

        // 2. Personal Info is available directly on $student
        
        // 3. Academic Summary
        $overallGwa = 0;
        $totalUnits = 0;
        $deanListCount = 0;

        foreach ($student->semesterRecords as $record) {
            $semUnits = 0;
            $semWeighted = 0;
            
            // Compute GWA if it's 0 (safety)
            if ($record->computed_gwa <= 0) {
                $record->computed_gwa = $record->computeGwa();
            }

            // Check dean list roughly (GWA <= 1.75 traditionally)
            if ($record->computed_gwa <= 1.75 && $record->computed_gwa > 0) {
                $deanListCount++;
            }

            foreach ($record->subjects as $subject) {
                if (in_array($subject->status, ['passed', 'failed'])) {
                    $units = (float) $subject->units;
                    $semUnits += $units;
                    $semWeighted += ((float) $subject->grade * $units);
                    
                    $totalUnits += $units;
                    $overallGwa += ((float) $subject->grade * $units);
                }
            }
        }
        $overallGwa = $totalUnits > 0 ? number_format($overallGwa / $totalUnits, 2) : 'N/A';

        // 4. Extracurricular Categories
        $activitiesByCategory = $student->studentActivities->groupBy(function($sa) {
            return $sa->activity->category->name ?? 'Uncategorized';
        });

        // 5. Skills (using correct relationship)
        $skillsByProficiency = $student->studentSkills->groupBy('proficiency');

        // 6. Alerts (Computed via service)
        $alerts = collect($this->alertService->getAlertsForStudent($student));

        // Compile data array
        $data = [
            'student' => $student,
            'overallGwa' => $overallGwa,
            'deanListCount' => $deanListCount,
            'activitiesByCategory' => $activitiesByCategory,
            'skillsByProficiency' => $skillsByProficiency,
            'alerts' => $alerts,
            'ranking' => $student->ranking,
        ];

        // Ensure views/pdf directory exists
        if (!file_exists(resource_path('views/pdf'))) {
            mkdir(resource_path('views/pdf'), 0755, true);
        }

        // Generate PDF
        $pdf = Pdf::loadView('pdf.student-portfolio', $data);
        
        return $pdf->output();
    }
}
