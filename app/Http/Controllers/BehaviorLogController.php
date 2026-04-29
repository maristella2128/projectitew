<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBehaviorLogRequest;
use App\Http\Requests\UpdateBehaviorLogRequest;
use App\Http\Requests\ResolveBehaviorLogRequest;
use App\Models\BehaviorLog;
use App\Models\Section;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Helpers\SpaRouting as Inertia;
use Illuminate\Http\JsonResponse; use Illuminate\Http\Response as HttpResponse; use Illuminate\View\View;

class BehaviorLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', BehaviorLog::class);
        $user = Auth::user();
        
        $query = BehaviorLog::with(['student.user', 'student.section', 'student.conductScore', 'recorder', 'resolver']);

        // ── FILTERS ───────────────────────────────────────────────────────────
        if ($user->hasRole(['student', 'parent'])) {
            $query->whereHas('student', fn($q) => $q->where('user_id', $user->id));
        }

        if ($request->filled('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->filled('section_id')) {
            $query->whereHas('student', fn($q) => $q->where('section_id', $request->section_id));
        }

        if ($request->filled('course')) {
            $query->whereHas('student', fn($q) => $q->where('course', $request->course));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('severity')) {
            $query->where('severity', $request->severity);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('resolution_status')) {
            $query->where('resolution_status', $request->resolution_status);
        }

        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->whereHas('student', function($sq) use ($s) {
                    $sq->where('first_name', 'like', "%$s%")
                      ->orWhere('last_name', 'like', "%$s%")
                      ->orWhere('student_id', 'like', "%$s%");
                })->orWhere('description', 'like', "%$s%");
            });
        }

        $baseQuery = clone $query;
        $logs = $query->latest()->paginate(10)->withQueryString();

        // ── SUMMARY METRICS ───────────────────────────────────────────────────
        $summaryQuery = clone $baseQuery;
        
        $summary = [
            'total_logs'         => (clone $summaryQuery)->count(),
            'total_violations'   => (clone $summaryQuery)->where('type', 'violation')->count(),
            'total_commendations' => (clone $summaryQuery)->where('type', 'commendation')->count(),
            'pending_count'      => (clone $summaryQuery)->where('resolution_status', 'pending')->count(),
            'resolved_count'     => (clone $summaryQuery)->where('resolution_status', 'resolved')->count(),
            'high_severity_count'=> (clone $summaryQuery)->where('severity', 'high')->count(),
            'average_score'      => round(Student::whereIn('id', (clone $summaryQuery)->pluck('student_id'))
                                    ->with('conductScore')
                                    ->get()
                                    ->avg(fn($s) => $s->conductScore?->total_score ?? 100), 1),
        ];

        $available_categories = [
            'academic_misconduct' => 'Academic Misconduct',
            'behavioral_misconduct' => 'Behavioral Misconduct',
            'attendance' => 'Attendance Issues',
            'dress_code' => 'Dress Code',
            'excellence' => 'Excellence',
            'leadership' => 'Leadership',
            'community' => 'Community Service',
            'other' => 'Other'
        ];

        return Inertia::render('Conduct/Index', [
            'logs' => $logs,
            'filters' => $request->only(['student_id', 'section_id', 'course', 'type', 'severity', 'category', 'resolution_status', 'date_from', 'date_to', 'search']),
            'summary' => $summary,
            'sections' => Section::all(['id', 'name', 'grade_level']),
            'students' => Student::all(['id', 'first_name', 'last_name', 'student_id']),
            'available_categories' => $available_categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBehaviorLogRequest $request)
    {
        Gate::authorize('create', BehaviorLog::class);
        $validated = $request->validated();

        // Calculate points
        $points = 0;
        if ($validated['type'] === 'commendation') {
            $points = $validated['severity'] === 'low' ? 5 : ($validated['severity'] === 'medium' ? 10 : 20);
        } else {
            $points = $validated['severity'] === 'low' ? -5 : ($validated['severity'] === 'medium' ? -15 : -30);
        }

        $log = BehaviorLog::create(array_merge($validated, [
            'date'      => $validated['logged_at'], // Mapping logged_at to date
            'logged_by' => Auth::id(),
            'resolution_status' => 'pending',
            'points'    => $points,
        ]));

        // Update student conduct score
        $student = \App\Models\Student::find($validated['student_id']);
        if ($student) {
            $score = $student->conductScore()->firstOrCreate(
                ['student_id' => $student->id],
                ['total_score' => 100]
            );
            $score->total_score += $points;
            $score->save();
        }

        return redirect()->back()->with('success', 'Behavior record logged successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBehaviorLogRequest $request, BehaviorLog $behavior)
    {
        Gate::authorize('update', $behavior);
        $validated = $request->validated();

        $behavior->update(array_merge($validated, [
            'date' => $validated['logged_at'],
        ]));

        return redirect()->back()->with('success', 'Behavior record updated.');
    }

    /**
     * Resolve the behavior log.
     */
    public function resolve(ResolveBehaviorLogRequest $request, BehaviorLog $behavior)
    {
        Gate::authorize('update', $behavior); 
        $validated = $request->validated();

        $behavior->update(array_merge($validated, [
            'resolved_by' => Auth::id(),
            'resolved_at' => now(),
        ]));

        return redirect()->back()->with('success', 'Incident resolved successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, BehaviorLog $behavior)
    {
        Gate::authorize('delete', $behavior);

        // Soft check for high severity pending logs
        if ($behavior->severity === 'high' && $behavior->resolution_status === 'pending') {
            if (!$request->boolean('confirmed')) {
                return redirect()->back()->withErrors([
                    'security' => 'Deleting a high-severity pending incident requires administrative confirmation.'
                ]);
            }
        }

        $behavior->delete();
        return redirect()->back()->with('success', 'Log entry removed.');
    }
}
