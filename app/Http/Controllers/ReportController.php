<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Section;
use App\Models\Grade;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function studentProfile(Student $student)
    {
        $student->load(['user', 'section', 'grades', 'attendance', 'healthRecords', 'achievements', 'behaviorLogs', 'clearance']);
        
        $data = [
            'student' => $student,
            'generated_at' => now()->format('F d, Y h:i A'),
            'institution' => 'College of Computing Studies',
            'report_id' => 'STU-AUD-' . strtoupper(substr(uniqid(), -6)),
        ];

        $pdf = Pdf::loadView('reports.student_audit', $data);
        return $pdf->download("student_audit_{$student->student_id}.pdf");
    }

    public function overallPdf()
    {
        $students = Student::with(['section', 'clearance', 'behaviorLogs', 'achievements', 'studentActivities'])->get();
        
        $total = $students->count();
        $enrolled = $students->where('enrollment_status', 'enrolled')->count();
        $dropped = $students->where('enrollment_status', 'dropped')->count();
        
        // Academic stats
        $avgGwa = \App\Models\GradeEntry::avg('final') ?? 0;
        
        // Year Level Distribution
        $yearDistribution = $students->groupBy('year_level')->map->count();

        // Audit stats
        $totalAttendance = \App\Models\Attendance::count();
        $totalHealth = \App\Models\HealthRecord::count();
        $totalAwards = \App\Models\Achievement::count();
        $totalViolations = \App\Models\BehaviorLog::whereIn('type', ['violation', 'offense'])->count();
        $criticalViolations = \App\Models\BehaviorLog::whereIn('severity', ['high', 'critical'])->count();
        $clearedCount = $students->where('clearance.status', 'cleared')->count();
        
        // Engagement Leaderboard
        $leaderboard = $students->sortByDesc('engagement_score')->take(5);
        
        $data = [
            'totalStudents' => $total,
            'enrolledCount' => $enrolled,
            'droppedCount' => $dropped,
            'avgGwa' => number_format($avgGwa, 2),
            'yearDistribution' => $yearDistribution,
            'totalAttendance' => $totalAttendance,
            'totalHealth' => $totalHealth,
            'totalAwards' => $totalAwards,
            'totalViolations' => $totalViolations,
            'criticalViolations' => $criticalViolations,
            'clearedCount' => $clearedCount,
            'clearanceRate' => $total > 0 ? round(($clearedCount / $total) * 100, 1) : 0,
            'leaderboard' => $leaderboard,
            'generated_at' => now()->format('F d, Y h:i A'),
            'institution' => 'College of Computing Studies',
            'dean_name' => Auth::user()->name,
        ];

        $pdf = Pdf::loadView('reports.overall_summary', $data);
        return $pdf->download('institutional_audit_summary_report.pdf');
    }
}
