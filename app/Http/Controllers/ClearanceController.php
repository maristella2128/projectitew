<?php

namespace App\Http\Controllers;

use App\Http\Requests\OverrideClearanceRequest;
use App\Models\Student;
use App\Models\StudentClearance;
use App\Services\ConductScoringService;
use App\Exports\ClearanceExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Helpers\SpaRouting as Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ClearanceController extends Controller
{
    public function index(Request $request)
    {
        $query = StudentClearance::with([
            'student.section', 
            'student.conductScore', 
            'student.clearanceEntries.department',
            'student.conductAlerts' => function($q) {
                $q->unresolved();
            }
        ]);

        // Filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('course')) {
            $query->whereHas('student', function($q) use ($request) {
                $q->where('course', $request->course);
            });
        }

        if ($request->filled('year_level')) {
            $query->whereHas('student', function($q) use ($request) {
                $q->where('year_level', $request->year_level);
            });
        }

        if ($request->filled('section_id')) {
            $query->whereHas('student', function($q) use ($request) {
                $q->where('section_id', $request->section_id);
            });
        }

        if ($request->filled('cleared_for')) {
            $query->whereJsonContains('cleared_for', $request->cleared_for);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->whereHas('student', function($q) use ($s) {
                $q->where('first_name', 'like', "%$s%")
                  ->orWhere('last_name', 'like', "%$s%")
                  ->orWhere('student_id', 'like', "%$s%");
            });
        }

        $clearances = $query->paginate(10)->withQueryString();

        // Summary Calculations
        $summary = [
            'total_cleared' => StudentClearance::where('status', 'cleared')->count(),
            'total_pending' => StudentClearance::where('status', 'pending_issues')->count(),
            'total_under_action' => StudentClearance::where('status', 'under_disciplinary_action')->count(),
            'total_hold' => StudentClearance::where('status', 'hold')->count(),
            'graduation_cleared_count' => StudentClearance::whereJsonContains('cleared_for', 'graduation')->count(),
            'enrollment_cleared_count' => StudentClearance::whereJsonContains('cleared_for', 'enrollment')->count(),
            'ojt_cleared_count' => StudentClearance::whereJsonContains('cleared_for', 'ojt')->count(),
        ];

        return Inertia::render('Clearance/Index', [
            'clearances' => $clearances,
            'filters' => $request->only(['status', 'course', 'year_level', 'cleared_for', 'search', 'section_id']),
            'summary' => $summary,
            'courses' => Student::distinct()->pluck('course')->filter()->values(),
        ]);
    }

    public function override(OverrideClearanceRequest $request, StudentClearance $clearance)
    {
        $validated = $request->validated();

        $updateData = array_merge($validated, [
            'evaluated_by' => Auth::id(),
            'last_evaluated_at' => now(),
        ]);

        if ($validated['status'] === 'cleared') {
            $updateData['cleared_for'] = ['graduation', 'enrollment', 'ojt'];
        }

        $clearance->update($updateData);

        return back()->with('success', 'Clearance overridden successfully.');
    }

    public function batchEvaluate(Request $request, ConductScoringService $service)
    {
        // Simple implementation of filtered batch re-evaluation
        if ($request->filled('course') || $request->filled('year_level')) {
            $studentQuery = Student::query();
            if ($request->filled('course')) $studentQuery->where('course', $request->course);
            if ($request->filled('year_level')) $studentQuery->where('year_level', $request->year_level);
            
            $students = $studentQuery->get();
            foreach ($students as $student) {
                $service->evaluateClearanceForStudent($student);
            }
            $count = $students->count();
        } else {
            $service->evaluateClearanceForAll();
            $count = Student::count();
        }

        return back()->with('success', "Clearance re-evaluated for {$count} students.");
    }

    public function exportClearanceList(Request $request)
    {
        $query = StudentClearance::with('student', 'student.conductScore');

        // Apply same filters as index
        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('course')) $query->whereHas('student', fn($q) => $q->where('course', $request->course));
        if ($request->filled('search')) {
            $s = $request->search;
            $query->whereHas('student', fn($q) => $q->where('first_name', 'like', "%$s%")->orWhere('last_name', 'like', "%$s%")->orWhere('student_id', 'like', "%$s%"));
        }

        $filename = "clearance_list_" . date('Y_m_d_His') . ".xlsx";
        return Excel::download(new ClearanceExport($query->get()), $filename);
    }
}
