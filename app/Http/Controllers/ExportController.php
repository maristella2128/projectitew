<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Student;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ExportController extends Controller
{
    public function studentSummaryPdf(Student $student, \App\Services\AcademicAlertService $alertService)
    {
        $student->load(['semesterRecords.subjects', 'capstoneProjects', 'user']);
        $alerts = $alertService->getAlertsForStudent($student);
        
        // Ensure DomPDF is installed. You can create a simple view for this, or load HTML directly.
        // Assuming resources/views/exports/student-summary.blade.php exists.
        // For fallback, we render an inline view if it does not exist.
        
        $html = "
            <html>
            <body style='font-family: sans-serif; padding: 20px;'>
                <h2>Academic Summary: {$student->first_name} {$student->last_name}</h2>
                <p><strong>Student ID:</strong> {$student->student_id}</p>
                <p><strong>Course/Level:</strong> {$student->course} - {$student->year_level} Year</p>
                <p><strong>Honors:</strong> {$student->latin_honors}</p>
                <hr/>
                <h3>Semester Records</h3>
        ";

        foreach ($student->semesterRecords as $record) {
            $html .= "<h4>AY: {$record->academic_year} | Sem: {$record->semester} | GWA: {$record->computed_gwa}</h4><ul>";
            foreach ($record->subjects as $subject) {
                $html .= "<li>{$subject->subject_code} - {$subject->subject_name} ({$subject->units}u): {$subject->grade} [{$subject->status}]</li>";
            }
            $html .= "</ul>";
        }

        $html .= "
                <hr/>
                <h3>Active Alerts</h3><ul>
        ";
        foreach ($alerts as $alert) {
            $html .= "<li><strong>{$alert['type']}</strong>: {$alert['message']}</li>";
        }
        $html .= "</ul></body></html>";

        $pdf = Pdf::loadHTML($html);
        return $pdf->download("student_summary_{$student->student_id}.pdf");
    }

    public function gradeReportExcel(Request $request)
    {
        $query = Grade::with(['student.section', 'recorder']);
        
        if ($request->filled('section_id')) {
            $query->whereHas('student', fn($q) => $q->where('section_id', $request->section_id));
        }
        if ($request->filled('student_id')) {
            $query->where('student_id', $request->student_id);
        }
        if ($request->filled('semester')) {
            $query->where('semester', $request->semester);
        }
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('subject', 'like', "%$s%")
                  ->orWhereHas('student', function($sq) use ($s) {
                      $sq->where('first_name', 'like', "%$s%")
                         ->orWhere('last_name', 'like', "%$s%")
                         ->orWhere('student_id', 'like', "%$s%");
                  });
            });
        }

        $grades = $query->get();

        return Excel::download(new class($grades) implements FromCollection, WithHeadings, WithMapping {
            private $grades;
            public function __construct($grades) { $this->grades = $grades; }
            public function collection() { return $this->grades; }
            public function headings(): array {
                return ['ID', 'Student ID', 'Student Name', 'Section', 'Subject', 'Semester', 'Score', 'Remarks', 'Recorded By', 'Date'];
            }
            public function map($grade): array {
                return [
                    $grade->id,
                    $grade->student->student_id,
                    $grade->student->first_name . ' ' . $grade->student->last_name,
                    $grade->student->section->name ?? '',
                    $grade->subject,
                    $grade->semester,
                    $grade->score,
                    $grade->remarks,
                    $grade->recorder->name ?? '',
                    $grade->created_at->format('Y-m-d'),
                ];
            }
        }, 'grade_report.xlsx');
    }

    public function exportProfile(Request $request)
    {
        $query = Student::with(['ranking.topCategory', 'alerts', 'section', 'courseProgram', 'user']);

        // 1. Basic Filters
        if ($request->filled('course')) {
            $query->where('course', $request->course);
        }
        if ($request->filled('year_level')) {
            $query->where('year_level', $request->year_level);
        }
        if ($request->filled('academic_status')) {
            $query->where('academic_status', $request->academic_status);
        }

        // 2. Ranking Filters
        $query->whereHas('ranking', function ($q) use ($request) {
            if ($request->filled('min_points')) {
                $q->where('total_points', '>=', $request->min_points);
            }
            if ($request->filled('max_points')) {
                $q->where('total_points', '<=', $request->max_points);
            }
            if ($request->filled('engagement_level')) {
                if ($request->engagement_level === 'high') {
                    $q->where('engagement_score', '>=', 70);
                } elseif ($request->engagement_level === 'medium') {
                    $q->whereBetween('engagement_score', [40, 69.99]);
                } elseif ($request->engagement_level === 'low') {
                    $q->where('engagement_score', '<', 40);
                }
            }
        });

        // 3. Activity Filters
        $hasLeadership = filter_var($request->has_leadership, FILTER_VALIDATE_BOOLEAN);
        if ($hasLeadership) {
            $query->whereHas('studentActivities', function ($q) {
                $q->whereIn('role', ['officer', 'president', 'coach']);
            });
        }

        $hasAwards = filter_var($request->has_awards, FILTER_VALIDATE_BOOLEAN);
        if ($hasAwards) {
            $query->whereHas('studentActivities', function ($q) {
                $q->whereNotNull('achievement')->where('achievement', '!=', '');
            });
        }

        if ($request->filled('activity_type')) {
            $query->whereHas('studentActivities.activity', function ($q) use ($request) {
                $q->where('activity_type', $request->activity_type);
            });
        }

        if ($request->filled('category_ids') && is_array($request->category_ids)) {
            foreach ($request->category_ids as $categoryId) {
                $query->whereHas('studentActivities.activity', function ($q) use ($categoryId) {
                    $q->where('category_id', $categoryId);
                });
            }
        }

        $students = $query->get();

        return Excel::download(new class($students) implements FromCollection, WithHeadings, WithMapping {
            private $students;
            public function __construct($students) { $this->students = $students; }
            public function collection() { return $this->students; }
            public function headings(): array {
                return ['Student ID', 'First Name', 'Last Name', 'Course', 'Year Level', 'Status', 'Total Points', 'Engagement Score', 'Alerts'];
            }
            public function map($student): array {
                return [
                    $student->student_id,
                    $student->first_name,
                    $student->last_name,
                    $student->course,
                    $student->year_level,
                    $student->academic_status,
                    $student->ranking->total_points ?? 0,
                    $student->ranking->engagement_score ?? 0,
                    $student->alerts ? $student->alerts->count() : 0,
                ];
            }
        }, 'student_profiling_results.xlsx');
    }
}
