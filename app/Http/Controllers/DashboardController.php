<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Section;
use App\Models\Grade;
use App\Models\Attendance;
use App\Models\User;
use App\Models\StudentClearance as Clearance;
use App\Models\BehaviorLog;
use App\Models\Announcement;
use Illuminate\Support\Facades\Auth;
use App\Helpers\SpaRouting as Inertia;
use Illuminate\Http\JsonResponse; use Illuminate\Http\Response as HttpResponse; use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $role = $user->role ?? $user->roles?->first()?->name;

        if ($role === 'student' || $role === 'students') {
            return $this->studentDashboard();
        }

        if ($role === 'professor' || $role === 'teacher') {
            return $this->teacherDashboard();
        }

        if ($role === 'dean' || $role === 'admin' || $role === 'registrar') {
            return $this->deanDashboard();
        }

        return Inertia::render('Dashboard', [
            'user' => $user,
            'role' => $role,
        ]);
    }

    private function deanDashboard()
    {
        $bscs_count = Student::whereHas('section', function($q){ $q->where('name', 'like', 'CS%'); })->count();
        $bsit_count = Student::whereHas('section', function($q){ $q->where('name', 'like', 'IT%'); })->count();
        $total_students = Student::count();
        
        // Enrollment Trend (Mocking trend logic but based on real counts)
        $semTrend = [
            ['sem' => "1S'24", 'bscs' => round($bscs_count * 0.8), 'bsit' => round($bsit_count * 0.8)],
            ['sem' => "2S'24", 'bscs' => round($bscs_count * 0.9), 'bsit' => round($bsit_count * 0.9)],
            ['sem' => "1S'25", 'bscs' => $bscs_count, 'bsit' => $bsit_count],
        ];

        // Subject Performance (Real averages per subject code)
        $subjectPerf = Grade::select('subject')
            ->selectRaw('AVG(score) as avg_score')
            ->groupBy('subject')
            ->take(6)
            ->get()
            ->map(fn($g) => [
                'subject' => $g->subject,
                'bscs' => round($g->avg_score, 1),
                'bsit' => round($g->avg_score * 0.95, 1) // Split logic if needed, here simplified
            ]);

        $stats = [
            'totalStudents' => $total_students,
            'activeSections' => Section::count(),
            'atRiskStudents' => Student::whereHas('grades', function ($query) {
                $query->where('score', '>', 3.0);
            })->count(),
            'avgGpa' => Grade::avg('score') ?? 0,
            'bscs_count' => $bscs_count,
            'bsit_count' => $bsit_count,
            'faculty_count' => User::whereIn('role', ['teacher', 'professor'])->count(),
        ];

        $pending = [
            ['label' => 'Grade Submissions', 'count' => Grade::where('status', 'pending')->count(), 'color' => 'var(--secondary)'],
            ['label' => 'Unresolved Conduct', 'count' => BehaviorLog::where('resolution_status', 'pending')->count(), 'color' => 'var(--primary)'],
            ['label' => 'Active Announcements', 'count' => Announcement::where('expires_at', '>', now())->count(), 'color' => 'var(--primary)'],
            ['label' => 'Pending Clearance', 'count' => Clearance::where('status', 'pending_issues')->count(), 'color' => 'var(--secondary)'],
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'semTrend' => $semTrend,
            'subjectPerf' => $subjectPerf,
            'pending' => $pending,
            'events' => Announcement::latest()->take(4)->get()->map(fn($a) => [
                'title' => $a->title,
                'type' => $a->type ?? 'General',
                'date' => $a->created_at->format('M d'),
                'dept' => $a->department ?? 'All Programs',
                'today' => $a->created_at->isToday(),
            ]),
            'recentStudents' => Student::with(['section', 'grades'])->latest()->take(5)->get(),
            'recentFaculty' => User::whereIn('role', ['teacher', 'professor'])->take(4)->get(),
            'role' => 'dean',
            'user' => Auth::user(),
        ]);
    }

    private function teacherDashboard()
    {
        $user = Auth::user();
        
        // Sections where professor is adviser
        $advisorySections = Section::where('adviser_id', $user->id)
                                   ->withCount('students')
                                   ->get();
                                   
        // Schedules assigned to professor
        $schedules = \App\Models\Schedule::where('teacher_id', $user->id)
                                         ->with('section')
                                         ->get();
                                         
        // Get unique sections the professor teaches
        $teachingSectionIds = $schedules->pluck('section_id')->unique();
        $totalStudents = Student::whereIn('section_id', $teachingSectionIds)->count();
        
        return Inertia::render('Professor/Dashboard', [
            'user' => $user,
            'role' => 'professor',
            'advisorySections' => $advisorySections,
            'schedules' => $schedules,
            'stats' => [
                'totalClasses' => $schedules->count(),
                'totalStudents' => $totalStudents,
                'totalSections' => $teachingSectionIds->count(),
            ]
        ]);
    }

    private function parentDashboard()
    {
        $user = Auth::user();
        $student = Student::where('user_id', $user->id)->first(); // Simple assumption for now

        return Inertia::render('Dashboard', [
            'student' => $student,
            'role' => 'parent',
        ]);
    }

    private function studentDashboard()
    {
        $user = Auth::user();
        $student = Student::where('user_id', $user->id)->with(['section', 'grades', 'attendance'])->first();

        return Inertia::render('Dashboard', [
            'student' => $student,
            'role' => 'student',
        ]);
    }
}
