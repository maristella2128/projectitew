<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Grade;
use App\Models\Attendance;
use App\Models\BehaviorLog;
use App\Models\HealthRecord;
use App\Models\Achievement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Helpers\SpaRouting as Inertia;
use Illuminate\Http\JsonResponse; use Illuminate\Http\Response as HttpResponse; use Illuminate\View\View;

class AcademicRecordsController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if ($user->hasRole('student')) {
            $student = Student::where('user_id', $user->id)
                ->with(['section', 'grades', 'attendance', 'behaviorLogs', 'healthRecords', 'achievements'])
                ->firstOrFail();
            
            return $this->studentOverview($student);
        }

        // For Dean/Teacher/Staff
        // If a student_id is provided, show that student's overview
        if ($request->has('student_id')) {
            $student = Student::with(['section', 'grades', 'attendance', 'behaviorLogs', 'healthRecords', 'achievements'])
                ->findOrFail($request->student_id);
            return $this->studentOverview($student);
        }

        // Otherwise, show high-level aggregate dashboard for Dean
        return $this->deanOverview();
    }

    private function studentOverview(Student $student)
    {
        // Calculate GWA
        $gwa = $student->grades->avg('score') ?? 0;

        // Calculate Attendance Rate
        $totalAttendance = $student->attendance->count();
        $presentDays = $student->attendance->where('status', 'present')->count();
        $attendanceRate = $totalAttendance > 0 ? round(($presentDays / $totalAttendance) * 100, 1) : 0;

        // Calculate Behavior Score
        $merits = $student->behaviorLogs->where('type', 'merit')->sum('points');
        $demerits = $student->behaviorLogs->where('type', 'demerit')->sum('points');
        $behaviorIndex = $merits - $demerits;

        // Latest Health Record
        $latestHealth = $student->healthRecords->sortByDesc('date')->first();

        // Recent Achievements
        $recentAchievements = $student->achievements->sortByDesc('date_awarded')->take(3)->values();

        return Inertia::render('AcademicRecords/Index', [
            'student' => $student,
            'metrics' => [
                'gwa' => round($gwa, 2),
                'attendanceRate' => $attendanceRate,
                'behaviorIndex' => $behaviorIndex,
                'latestHealth' => $latestHealth,
                'achievementsCount' => $student->achievements->count(),
                'recentAchievements' => $recentAchievements,
            ],
            'role' => 'student_view'
        ]);
    }

    private function deanOverview()
    {
        $stats = [
            'avgInstitutionGwa' => round(Grade::avg('score') ?? 0, 2),
            'overallAttendance' => round((Attendance::where('status', 'present')->count() / (Attendance::count() ?: 1)) * 100, 1),
            'totalAchievements' => Achievement::count(),
            'outstandingBehavior' => BehaviorLog::where('type', 'merit')->count(),
            'atRiskCount' => Student::whereHas('grades', function($q) { $q->where('score', '<', 75); })->count(),
        ];

        // Get some top students
        $topStudents = Student::with('grades')
            ->get()
            ->map(function($s) {
                $s->gwa = $s->grades->avg('score') ?? 0;
                return $s;
            })
            ->sortByDesc('gwa')
            ->take(5)
            ->values();

        return Inertia::render('AcademicRecords/Index', [
            'stats' => $stats,
            'topStudents' => $topStudents,
            'role' => 'dean_view'
        ]);
    }
}
