<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Helpers\SpaRouting as Inertia;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\View\View;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\MonthlyAttendanceExport;
use Carbon\Carbon;
use App\Models\Student;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Attendance::class);
        $user = Auth::user();
        $date = $request->date ?? date('Y-m-d');
        $sectionId = $request->section_id;

        if ($user->hasRole(['student', 'parent'])) {
            $student = \App\Models\Student::where('user_id', $user->id)->first();
            $attendance = Attendance::where('student_id', $student?->id)
                ->with('recorder')
                ->latest('date')
                ->paginate(30);

            return Inertia::render('Attendance/History', [
                'attendance' => $attendance,
                'student' => $student,
            ]);
        }

        // Programs for the main view
        $programs = \App\Models\Program::withCount('sections')->get()->map(function ($p) {
            // Count total students across all sections in this program
            $p->student_count = \App\Models\Student::whereIn('section_id', $p->sections->pluck('id'))->count();
            return $p;
        });

        $sections = [];
        $programCode = $request->program;

        if ($programCode) {
            $program = \App\Models\Program::where('code', $programCode)->first();
            if ($program) {
                $sections = \App\Models\Section::where('program_id', $program->id)
                    ->withCount('students')
                    ->with('adviser')
                    ->get();
            }
        }

        $students = [];
        if ($sectionId) {
            $students = \App\Models\Student::where('section_id', $sectionId)
                ->orderBy('last_name')
                ->orderBy('first_name')
                ->with([
                    'attendance' => function ($q) use ($date) {
                        $q->where('date', $date);
                    }
                ])
                ->get();
        }

        return Inertia::render('Attendance/Index', [
            'programs' => $programs,
            'sections' => $sections,
            'students' => $students,
            'currentDate' => $date,
            'currentSection' => $sectionId ? (int) $sectionId : null,
            'currentProgram' => $programCode,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', Attendance::class);
        $validated = $request->validate([
            'attendance' => 'required|array',
            'attendance.*.student_id' => 'required|exists:students,id',
            'attendance.*.status' => 'required|in:present,absent,late,excused',
            'date' => 'required|date|before_or_equal:today',
        ]);

        foreach ($validated['attendance'] as $record) {
            Attendance::updateOrCreate(
                [
                    'student_id' => $record['student_id'],
                    'date' => $validated['date'],
                ],
                [
                    'status' => $record['status'],
                    'recorded_by' => Auth::id(),
                ]
            );
        }

        return redirect()->back()->with('success', 'Attendance updated successfully.');
    }

    /**
     * Export monthly attendance records to Excel.
     */
    public function exportMonthly(Request $request, $sectionId, $month)
    {
        $section = \App\Models\Section::findOrFail($sectionId);
        Gate::authorize('view', $section); // Ensure user can view this section

        $filename = "Attendance_{$section->name}_{$month}.xlsx";

        return Excel::download(new MonthlyAttendanceExport($sectionId, $month), $filename);
    }

    /**
     * Get attendance history for a specific student.
     */
    public function studentHistory(Student $student)
    {
        Gate::authorize('viewAny', Attendance::class);

        $history = Attendance::where('student_id', $student->id)
            ->with('recorder:id,name')
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'student' => $student->only(['id', 'first_name', 'last_name', 'student_id']),
            'history' => $history
        ]);
    }
}
