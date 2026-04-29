<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Section;
use App\Services\AcademicService;
use App\Services\AcademicAlertService;
use App\Services\RecommendationService;
use App\Services\PointsCalculatorService;
use App\Models\Student;
use App\Models\GradeEntry;
use App\Models\Program;
use App\Models\SemesterSubject;
use App\Models\SemesterRecord;
use App\Models\BehaviorLog;
use App\Models\ConductAlert;
use App\Models\StudentRanking;
use App\Models\StudentClearance;
use App\Models\ActivityCategory;
use App\Models\Curriculum;
use App\Models\CurriculumCourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Helpers\SpaRouting as Inertia;
use Illuminate\Http\JsonResponse; use Illuminate\Http\Response as HttpResponse; use Illuminate\View\View;

class GradeController extends Controller
{
    protected $academicService;

    public function __construct(AcademicService $academicService)
    {
        $this->academicService = $academicService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, AcademicAlertService $alertService, RecommendationService $recService, PointsCalculatorService $pointsService)
    {
        Gate::authorize('viewAny', Grade::class);
        $user = Auth::user();

        // Use GradeEntry for the primary academic data
        $query = GradeEntry::with(['student.user', 'student.section', 'encodedBy']);

        // ── 1. Role-based Visibility ──
        if ($user->hasRole(['student', 'parent'])) {
            $query->whereHas('student', function($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        // ── 2. Apply Filters ──
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
                $q->where('subject_name', 'like', "%$s%")
                  ->orWhere('subject_code', 'like', "%$s%")
                  ->orWhereHas('student', function($sq) use ($s) {
                      $sq->where('first_name', 'like', "%$s%")
                         ->orWhere('last_name', 'like', "%$s%")
                         ->orWhere('student_id', 'like', "%$s%");
                  });
            });
        }

        // ── 3. Summary Analytics ──
        $grades = $query->latest()->paginate(10)->withQueryString();
        
        $studentIds = $grades->pluck('student_id');
        
        // If we are in the main drill-down view (no specific student or section filter), 
        // load all students to ensure they are visible in the roster levels.
        if (!$request->filled('section_id') && !$request->filled('student_id')) {
            $studentIds = Student::pluck('id');
        } elseif ($request->filled('section_id')) {
            $sectionStudentIds = Student::where('section_id', $request->section_id)->pluck('id');
            $studentIds = $studentIds->merge($sectionStudentIds)->unique();
        }

        $students = Student::with([
            'section', 
            'semesterRecords.subjects', 
            'capstoneProjects.members', 
            'studentDocuments.uploader',
            'studentActivities.activity.category',
            'studentSkills',
            'conductScore', 
            'clearance', 
            'conductAlerts' => fn($q) => $q->where('is_resolved', false)->latest()->limit(3),
            'behaviorLogs' => fn($q) => $q->latest('date')->limit(5)->with(['recorder'])
        ])->whereIn('id', $studentIds)->get();

        $categorySummaries = BehaviorLog::whereIn('student_id', $students->pluck('id'))
            ->selectRaw('student_id, category, count(*) as count')
            ->groupBy('student_id', 'category')
            ->get()
            ->groupBy('student_id');

        $totalActiveAlerts = 0;
        $conductData = [];
        /** @var Student $student */
        foreach ($students as $student) {
            $alerts = $alertService->getAlertsForStudent($student);
            $student->setAttribute('alerts', $alerts);
            $student->setAttribute('capstone', $student->capstoneProjects->first());

            $conductData[$student->id] = [
                'score' => $student->conductScore ? [
                    'total_score' => $student->conductScore->total_score,
                    'score_status' => $student->conductScore->score_status,
                    'score_color' => $student->conductScore->score_color,
                    'violation_count' => $student->conductScore->violation_count,
                    'commendation_count' => $student->conductScore->commendation_count,
                    'high_severity_count' => $student->conductScore->high_severity_count,
                    'last_computed_at' => $student->conductScore->last_computed_at,
                ] : null,
                'clearance' => $student->clearance ? [
                    'status' => $student->clearance->status,
                    'status_label' => $student->clearance->status_label,
                    'status_color' => $student->clearance->status_color,
                    'cleared_for' => $student->clearance->cleared_for,
                    'hold_reason' => $student->clearance->hold_reason,
                ] : null,
                'unresolvedAlerts' => $student->conductAlerts,
                'recentLogs' => $student->behaviorLogs->map(fn($log) => [
                    'category_label' => $log->category_label,
                    'category_color' => $log->category_color,
                    'points' => $log->points,
                    'type' => $log->type,
                    'severity' => $log->severity,
                    'logged_at' => $log->date,
                ]),
            ];
        }

        $summary = $this->buildSummary($query, $students);
        $summary['total_active_alerts'] = $totalActiveAlerts;
        $summary['active_conduct_alerts'] = ConductAlert::where('is_resolved', false)->count();

        // ── 4. Intelligent Recommendations (Lazy Bound) ──
        $recommendationsMap = [];
        if ($students->count() <= 15) {
            /** @var Student $student */
            foreach ($students as $student) {
                $recommendationsMap[$student->id] = $recService->getRecommendationsForStudent($student);
            }
        }

        // ── 5. Rankings Cross-Reference ──
        $studentRankings = StudentRanking::whereIn('student_id', $students->pluck('id'))
            ->get()
            ->keyBy('student_id');

        // ── 6. Leaderboard Data (for Engagement View) ──
        $leaderboard = $pointsService->getLeaderboardData($request->only(['course', 'year_level']));

        // ── 7. Unified Programs & Sections Sync ──
        $programs = Program::withCount(['sections'])->get()->map(function($p) {
            $studentCount = Student::whereHas('section', fn($q) => $q->where('program_id', $p->id))->count();
            return [
                'name' => $p->code,
                'fullName' => $p->name,
                'sectionCount' => $p->sections_count,
                'studentCount' => $studentCount,
            ];
        });

        return Inertia::render('Grades/Index', [
            'grades'   => $grades,
            'sections' => Section::with(['adviser'])->withCount([
                'students',
                'students as passing_count' => function ($query) {
                    $query->whereHas('semesterRecords.subjects', function ($q) {
                        $q->where('status', 'passed');
                    });
                }
            ])->get(),
            'programs' => $programs,
            'students' => $students,
            'studentSemesterRecords' => SemesterRecord::with('subjects')->get()->groupBy('student_id'),
            'curriculumSubjects' => Program::with(['activeCurriculum.courses'])->get()->mapWithKeys(function($p) {
                return [$p->code => ($p->activeCurriculum ? $p->activeCurriculum->courses->map(fn($course) => [
                    'subject_code' => $course->code ?? 'N/A',
                    'subject_name' => $course->name ?? 'Unknown',
                    'units' => ($course->lec_units ?? 0) + ($course->lab_units ?? 0),
                    'year_level' => $course->pivot->year_level,
                    'semester' => $course->pivot->semester,
                    'is_required' => true,
                ]) : [])];
            }),
            'activityCategories' => ActivityCategory::all(),
            'recommendations' => $recommendationsMap,
            'studentRankings' => $studentRankings,
            'leaderboard'     => $leaderboard,
            'filters'  => $request->only(['student_id', 'section_id', 'semester', 'search', 'course', 'year_level']),
            'summary'  => $summary,
            'conductData' => $conductData,
        ]);
    }

    /**
     * Build the summary object for the filtered dataset.
     */
    private function buildSummary(\Illuminate\Database\Eloquent\Builder $query, \Illuminate\Support\Collection $students)
    {
        // Clone to avoid affecting the original paginator query
        $q = clone $query;
        $allEntries = $q->get();
        $totalRecords = $allEntries->count();

        // Calculate Average Score across all Final Grades
        $avgScore = $totalRecords > 0 ? $allEntries->avg('final') : 0;

        // Highest Performer based on Student Weighted Average
        $highestStats = GradeEntry::selectRaw('student_id, avg(final) as avg_final')
            ->whereIn('student_id', $students->pluck('id'))
            ->groupBy('student_id')
            ->orderByDesc('avg_final')
            ->first();

        $highestPerformer = null;
        if ($highestStats) {
            $topStudent = $students->firstWhere('id', $highestStats->student_id);
            $highestPerformer = [
                'name' => $topStudent ? ($topStudent->first_name . ' ' . $topStudent->last_name) : 'Unknown',
                'avg' => $highestStats->avg_final
            ];
        }

        // Engagement Metrics from Ranking relation
        $avgEngagement = StudentRanking::whereIn('student_id', $students->pluck('id'))->avg('total_points') ?: 0;
        $topEngagementRecord = StudentRanking::with('student')
            ->whereIn('student_id', $students->pluck('id'))
            ->orderByDesc('total_points')
            ->first();

        return [
            'total_records' => $totalRecords,
            'average_score' => round($avgScore, 1),
            'highest_score' => $highestPerformer ? [
                'score' => round($highestPerformer['avg'], 2),
                'name'  => $highestPerformer['name']
            ] : null,
            'lowest_score'  => $totalRecords > 0 ? $allEntries->min('final') : 0,
            'passing_count' => $allEntries->where('final', '>=', 75)->count(),
            'failing_count' => $allEntries->where('final', '<', 75)->count(),
            'avg_engagement' => round($avgEngagement, 1),
            'top_engagement' => $topEngagementRecord ? [
                'score' => $topEngagementRecord->total_points,
                'name'  => $topEngagementRecord->student->first_name . ' ' . $topEngagementRecord->student->last_name
            ] : null,
        ];
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', Grade::class);
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'subject'    => 'required|string|max:120',
            'semester'   => 'required|in:1,2,3',
            'score'      => 'required|numeric|min:0|max:100',
        ]);

        $score = $validated['score'];
        $remarks = $this->calculateRemarks($score);

        Grade::create(array_merge($validated, [
            'remarks'     => $remarks,
            'recorded_by' => Auth::id(),
        ]));

        return redirect()->back()->with('success', 'Academic record authorized and published.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Grade $grade)
    {
        Gate::authorize('update', $grade);
        $validated = $request->validate([
            'subject'    => 'required|string|max:120',
            'semester'   => 'required|in:1,2,3',
            'score'      => 'required|numeric|min:0|max:100',
        ]);

        $score = $validated['score'];
        $remarks = $this->calculateRemarks($score);

        $grade->update(array_merge($validated, [
            'remarks' => $remarks
        ]));

        return redirect()->back()->with('success', 'Academic record adjusted and saved.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Grade $grade)
    {
        Gate::authorize('delete', $grade);
        
        // Ownership check: only original recorder or admin/dean
        if ($grade->recorded_by !== Auth::id() && !Auth::user()->hasRole(['admin', 'dean'])) {
            return back()->withErrors(['delete' => 'Authorization failure. Entry was not recorded by your account.']);
        }

        $grade->delete();
        return redirect()->back()->with('success', 'Record purged from registry.');
    }

    private function calculateRemarks($score)
    {
        if ($score >= 90) return 'Excellent';
        if ($score >= 80) return 'Very Good';
        if ($score >= 75) return 'Satisfactory';
        if ($score >= 65) return 'Needs Improvement';
        return 'Failed';
    }

    /**
     * Advanced student filter returning JSON array of matched student profiles.
     */
    public function advancedFilter(Request $request)
    {
        $query = Student::with(['ranking.topCategory', 'section', 'user']);

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

        // 2. Ranking Filters (Points & Engagement Level)
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

        // 3. Activity Filters (Leadership, Awards, Categories, Types)
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
                    $q->where('activity_category_id', $categoryId);
                });
            }
        }

        $students = $query->get()->map(function ($student) {
            return [
                'id' => $student->id,
                'student_id' => $student->student_id,
                'first_name' => $student->first_name,
                'last_name' => $student->last_name,
                'course' => $student->course,
                'year_level' => $student->year_level,
                'academic_status' => $student->academic_status,
                'academic_status_color' => $student->academic_status_color,
                'ranking' => $student->ranking,
                'section_name' => $student->section ? $student->section->name : null,
                'user' => $student->user,
                'full_name' => trim($student->first_name . ' ' . $student->last_name),
            ];
        });

        return response()->json([
            'count' => $students->count(),
            'students' => $students,
        ]);
    }
    /**
     * Get the curriculum-aligned courses for a section's grade encoding sheet.
     */


    /**
     * Get Curriculum Progress Map
     */
    public function curriculumProgress(Student $student)
    {
        $curriculum = $student->curriculum ?? ($student->section ? $student->section->program->activeCurriculum : null);
        
        if (!$curriculum) {
            return response()->json(['error' => 'No curriculum assigned to student.'], 404);
        }

        $allCourses = CurriculumCourse::with('course')
            ->where('curriculum_id', $curriculum->id)
            ->orderBy('year_level')
            ->orderBy('semester')
            ->orderBy('order')
            ->get();

        $enrollments = SemesterSubject::whereHas('semesterRecord', function($q) use ($student) {
            $q->where('student_id', $student->id);
        })->get()->groupBy('curriculum_course_id');

        $progress = $allCourses->map(function($cc) use ($enrollments) {
            $enrollment = $enrollments->get($cc->id)?->last(); // Latest attempt
            return [
                'id' => $cc->id,
                'year_level' => $cc->year_level,
                'semester' => $cc->semester,
                'subject_code' => $cc->course->code ?? 'N/A',
                'subject_name' => $cc->course->name ?? 'Unknown',
                'units' => ($cc->course->lec_units ?? 0) + ($cc->course->lab_units ?? 0),
                'status' => $enrollment->status ?? 'not taken',
                'grade' => $enrollment->grade ?? null,
                'gwa' => $enrollment->gwa_equivalent ?? null,
            ];
        });

        return response()->json([
            'curriculum_name' => $curriculum->name,
            'progress' => $progress->groupBy(['year_level', 'semester'])
        ]);
    }

    public function getEncodingGrid(Section $section, Request $request)
    {
        $section->load(['program']);
        $program = $section->program;
        
        if (!$program) {
            return response()->json(['error' => 'Section has no assigned program.'], 404);
        }

        $curriculumId = $section->curriculum_id ?? $program->active_curriculum_id;
        if (!$curriculumId) {
            return response()->json(['error' => 'No active curriculum found for this program.'], 404);
        }

        $curriculum = Curriculum::find($curriculumId);
        $yearLevel = $section->grade_level; // Already in "1st Year" format
        $semesterNum = (int) $section->semester;
        $semester = match ($semesterNum) {
            1 => '1st Semester',
            2 => '2nd Semester',
            3 => 'Summer',
            default => $section->semester,
        };

        $courses = CurriculumCourse::with('course')
            ->where('curriculum_id', $curriculumId)
            ->where('year_level', $yearLevel)
            ->where('semester', $semester)
            ->orderBy('order')
            ->get();

        $studentQuery = $section->students()->with(['semesterRecords' => function($q) use ($section) {
            $q->where('academic_year', $section->school_year)
              ->where('semester', (int) $section->semester);
        }, 'semesterRecords.subjects']);

        if ($request->has('student_id')) {
            $studentQuery->where('id', $request->student_id);
        }

        $studentsData = $studentQuery->get()->map(function($student) use ($courses) {
            $record = $student->semesterRecords->first();

            return [
                'id' => $student->id,
                'name' => $student->name,
                'student_id' => $student->student_id,
                'subjects' => $courses->map(function($cc) use ($record) {
                    $enrollment = $record ? $record->subjects->where('curriculum_course_id', $cc->id)->first() : null;
                    return [
                        'enrollment_id' => $enrollment->id ?? null,
                        'curriculum_course_id' => $cc->id,
                        'subject_code' => $cc->course->code ?? 'N/A',
                        'subject_name' => $cc->course->name ?? 'Unknown',
                        'units' => ($cc->course->lec_units ?? 0) + ($cc->course->lab_units ?? 0),
                        'prelim' => $enrollment->prelim_grade ?? null,
                        'midterm' => $enrollment->midterm_grade ?? null,
                        'final' => $enrollment->final_grade ?? null,
                        'computed' => $enrollment->grade ?? null,
                        'gwa' => $enrollment->gwa_equivalent ?? null,
                        'status' => $enrollment->status ?? 'ongoing',
                        'is_locked' => $enrollment->is_locked ?? false,
                    ];
                })
            ];
        });

        return response()->json([
            'section' => $section->name,
            'program' => $program->name,
            'curriculum' => $curriculum->name ?? 'Primary Curriculum',
            'students' => $studentsData,
            'semester' => $semester,
            'academic_year' => $section->school_year
        ]);
    }

    /**
     * POST /api/grade-entries/batch
     */
    public function batchUpsert(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'nullable|exists:students,id',
            'semester' => 'nullable',
            'academic_year' => 'nullable',
            'entries' => 'required|array',
            'entries.*.id' => 'nullable|integer',
            'entries.*.subject_code' => 'required_without:entries.*.id|string',
            'entries.*.subject_name' => 'nullable|string',
            'entries.*.units' => 'nullable|numeric',
            'entries.*.prelim' => 'nullable|numeric|min:0|max:100',
            'entries.*.midterm' => 'nullable|numeric|min:0|max:100',
            'entries.*.final' => 'nullable|numeric|min:0|max:100',
        ]);

        $studentId = $validated['student_id'] ?? null;
        $semester = $validated['semester'] ?? null;
        $year = $validated['academic_year'] ?? null;

        foreach ($validated['entries'] as $entry) {
            $subject = null;
            
            if (isset($entry['id']) && $entry['id']) {
                $subject = SemesterSubject::find($entry['id']);
            } elseif ($studentId && $semester && $year) {
                // Find or create semester record
                $record = SemesterRecord::firstOrCreate([
                    'student_id' => $studentId,
                    'academic_year' => $year,
                    'semester' => (int) $semester
                ]);

                // Find or create subject entry
                $subject = SemesterSubject::firstOrCreate([
                    'semester_record_id' => $record->id,
                    'subject_code' => $entry['subject_code']
                ], [
                    'subject_name' => $entry['subject_name'] ?? 'Manual Entry',
                    'units' => $entry['units'] ?? 3,
                    'status' => 'ongoing'
                ]);
            }

            if (!$subject) continue;

            // Check if locked
            if ($subject->is_locked || ($subject->semesterRecord && $subject->semesterRecord->is_locked)) {
                continue;
            }

            if (array_key_exists('prelim', $entry)) $subject->prelim_grade = $entry['prelim'];
            if (array_key_exists('midterm', $entry)) $subject->midterm_grade = $entry['midterm'];
            if (array_key_exists('final', $entry)) $subject->final_grade = $entry['final'];
            
            // Recompute
            // If all 4 are present, or at least 3 (depending on curriculum)
            // AcademicService->computeGrade currently takes 3 params? Let's check.
            $p = $subject->prelim_grade;
            $m = $subject->midterm_grade;
            $f = $subject->final_grade;

            if ($p !== null && $m !== null && $f !== null) {
                $subject->grade = $this->academicService->computeGrade($p, $m, $f);
                $subject->gwa_equivalent = $this->academicService->mapToGwaScale($subject->grade);
                $subject->status = $subject->grade >= 75 ? 'passed' : 'failed';
            } else {
                $subject->status = 'ongoing';
            }
            
            $subject->save();
        }

        return response()->json(['message' => 'Grades updated successfully.']);
    }

    /**
     * POST /api/grade-entries/batch-submit
     */
    public function batchSubmit(Request $request)
    {
        $request->validate([
            'subject_ids' => 'required|array',
            'subject_ids.*' => 'required|integer',
        ]);

        $subjects = SemesterSubject::with('semesterRecord.student')->whereIn('id', $request->subject_ids)->get();

        foreach ($subjects as $subject) {
            /** @var SemesterSubject $subject */
            $subject->is_locked = true;
            $subject->save();
            
            if ($subject->semesterRecord) {
                $this->academicService->finalizeSemester($subject->semesterRecord);
            }
        }

        return response()->json(['message' => 'Grades submitted and finalized.']);
    }
}
