<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use App\Helpers\SpaRouting as Inertia;
use Illuminate\Http\JsonResponse; use Illuminate\Http\Response as HttpResponse; use Illuminate\View\View;

class StudentController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();

        // Load student record safely
        $student = null;
        try {
            if (method_exists($user, 'student') || isset($user->student)) {
                $student = Student::where('user_id', $user->id)
                    ->with(['section.program'])
                    ->first();
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('Could not load student record: ' . $e->getMessage());
        }

        return Inertia::render('StudentPortal/Dashboard', [
            'student'         => $student,
            'todaySchedule'   => [],
            'recentDocuments' => [],
            'announcements'   => [],
            'stats'           => [
                'gwa'              => null,
                'attendance_rate'  => null,
                'units_taken'      => null,
                'units_required'   => 24,
                'clearance_status' => 'Pending',
            ],
        ]);
    }

    public function index(Request $request)
    {
        Gate::authorize('viewAny', Student::class);
        $query = Student::query()->with([
            'user', 
            'section', 
            'grades', 
            'attendance', 
            'healthRecords', 
            'achievements', 
            'behaviorLogs', 
            'clearance'
        ]);

        if ($request->has('search')) {
            $query->where('first_name', 'like', '%' . $request->search . '%')
                ->orWhere('last_name', 'like', '%' . $request->search . '%')
                ->orWhere('student_id', 'like', '%' . $request->search . '%');
        }

        if ($request->has('year_level')) {
            $query->where('year_level', $request->year_level);
        }

        if ($request->has('status')) {
            $query->where('enrollment_status', $request->status);
        }

        if ($request->has('skill')) {
            $query->whereJsonContains('skills', $request->skill);
        }

        if ($request->has('activity')) {
            $query->whereJsonContains('activities', $request->activity);
        }

        $students = $query->paginate(10)->withQueryString();

        $stats = [
            'total'     => Student::count(),
            'enrolled'  => Student::where('enrollment_status', 'enrolled')->count(),
            'dropped'   => Student::where('enrollment_status', 'dropped')->count(),
            'graduated' => Student::where('enrollment_status', 'graduated')->count(),
            'avgGwa'    => \App\Models\GradeEntry::avg('final') ?? 0,
            'totalAwards' => \App\Models\Achievement::count(),
        ];

        return Inertia::render('Students/Index', [
            'students' => $students,
            'stats'    => $stats,
            'filters' => $request->only(['search', 'year_level', 'status', 'skill', 'activity']),
            'skillOptions'    => ['Basketball','Programming','Singing','Drawing','Dancing','Chess'],
            'activityOptions' => ['Student Council','Science Club','Sports','Arts & Culture'],
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('query', '');
        $excludeSection = $request->input('exclude_section');

        return Student::with(['user', 'section'])
            ->where(function ($q) use ($query) {
                $q->whereHas('user', fn($u) => $u->where('name', 'like', "%{$query}%"))
                  ->orWhere('student_id', 'like', "%{$query}%");
            })
            ->get()
            ->map(fn($s) => [
                'id'           => $s->id,
                'name'         => $s->user->name,
                'student_id'   => $s->student_id,
                'course'       => $s->course ?? null,
                'section_id'   => $s->section_id,
                'section_name' => $s->section?->name,
            ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create', Student::class);
        return Inertia::render('Students/Create', [
            'sections' => \App\Models\Section::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', Student::class);
        $validated = $request->validate([
            'student_id' => 'required|unique:students|size:12',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users',
            'birthdate' => 'required|date',
            'gender' => 'required|in:male,female,other',
            'address' => 'required|string',
            'guardian_name' => 'required|string|max:255',
            'guardian_contact' => 'required|string|max:20',
            'guardian_relationship' => 'required|string|max:255',
            'year_level' => 'required|string',
            'section_id' => 'nullable|exists:sections,id',
            'enrollment_status' => 'required|in:enrolled,dropped,transferred,graduated',
            'school_year' => 'required|string',
            'photo' => 'nullable|image|max:2048',
            'skills' => 'nullable|array',
            'activities' => 'nullable|array',
        ]);

        // Create User first
        $user = \App\Models\User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => \Illuminate\Support\Facades\Hash::make('password123'),
            'role' => 'student',
        ]);
        $user->assignRole('student');

        // Handle Photo Upload
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('photos', 'public');
        }

        // Create Student
        Student::create(array_merge($validated, [
            'user_id' => $user->id,
            'photo' => $photoPath,
        ]));

        return redirect()->route('students.index')->with('success', 'Student enrolled successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        Gate::authorize('view', $student);
        return Inertia::render('Students/Show', [
            'student' => $student->load(['user', 'section', 'grades.recorder', 'attendance.recorder', 'behaviorLogs.recorder', 'healthRecords.creator', 'documents.uploader', 'achievements']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $student)
    {
        Gate::authorize('update', $student);
        return Inertia::render('Students/Edit', [
            'student' => $student->load('user'),
            'sections' => \App\Models\Section::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student)
    {
        Gate::authorize('update', $student);
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users,email,' . $student->user_id,
            'birthdate' => 'required|date',
            'gender' => 'required|in:male,female,other',
            'address' => 'required|string',
            'guardian_name' => 'required|string|max:255',
            'guardian_contact' => 'required|string|max:20',
            'guardian_relationship' => 'required|string|max:255',
            'year_level' => 'required|string',
            'section_id' => 'nullable|exists:sections,id',
            'enrollment_status' => 'required|in:enrolled,dropped,transferred,graduated',
            'school_year' => 'required|string',
            'photo' => 'nullable|image|max:2048',
            'skills' => 'nullable|array',
            'activities' => 'nullable|array',
        ]);

        // Update User
        $student->user->update([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
        ]);

        // Handle Photo Upload
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($student->photo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($student->photo);
            }
            $validated['photo'] = $request->file('photo')->store('photos', 'public');
        }

        $student->update($validated);

        return redirect()->route('students.index')->with('success', 'Student profile updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        Gate::authorize('delete', $student);
        $student->delete();
        return redirect()->route('students.index')->with('success', 'Student record archived.');
    }

    // Stub methods for other routes:
    public function profilePersonal()
    {
        $user = Auth::user();

        // Load student record with related data safely
        $student = Student::where('user_id', $user->id)
            ->with(['section', 'section.program'])
            ->first();

        \Illuminate\Support\Facades\Log::info('Loaded Student Data', ['user_id' => $user->id, 'found' => $student !== null]);

        $sectionData = null;
        if ($student?->section) {
            $sec = $student->section;
            $sectionData = [
                'id'           => $sec->id,
                'name'         => $sec->name          ?? null,
                'code'         => $sec->name          ?? null,
                'year_level'   => $sec->grade_level   ?? $student->year_level ?? null,
                'semester'     => $sec->semester      ?? null,
                'academic_year'=> $sec->school_year   ?? $student->school_year ?? null,
                'room'         => null,
                'schedule_type'=> null,
                'max_students' => $sec->max_capacity  ?? null,
                'program_name' => $sec->program?->name       ?? null,
                'program_code' => $sec->program?->code       ?? null,
            ];
        }

        return Inertia::render('StudentPortal/Profile/Personal', [
            'user'    => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'created_at' => $user->created_at?->format('F d, Y'),
            ],
            'student' => $student ? [
                // ── Identity ──
                'student_number'  => $student->student_id ?? null,
                'first_name'      => $student->first_name ?? null,
                'last_name'       => $student->last_name ?? null,
                'middle_name'     => $student->middle_name ?? null,
                'suffix'          => null,
                'gender'          => $student->gender ?? null,
                'date_of_birth'   => $student->birthdate ?? null,
                'place_of_birth'  => null,
                'civil_status'    => null,
                'nationality'     => null,
                'religion'        => null,

                // ── Contact ──
                'phone'           => null,
                'address'         => $student->address ?? null,
                'city'            => null,
                'province'        => null,
                'zip_code'        => null,

                // ── Academic ──
                'program'         => $student->section?->program?->name ?? $student->course ?? null,
                'year_level'      => $student->year_level ?? null,
                'section'         => $student->section?->name ?? null,
                'enrollment_status' => $student->enrollment_status ?? 'Enrolled',
                'academic_year'   => $student->school_year ?? null,
                'semester'        => null,

                // ── Emergency Contact ──
                'emergency_contact_name'  => $student->guardian_name ?? null,
                'emergency_contact_phone' => $student->guardian_contact ?? null,
                'emergency_contact_relation' => $student->guardian_relationship ?? null,
            ] : null,
            'section' => $sectionData,
        ]);
    }
    public function profileEnrollment()
    {
        $user    = Auth::user();
        $student = Student::where('user_id', $user->id)
            ->with(['section', 'section.program'])
            ->first();

        // ── Current enrollment summary ──
        $currentEnrollment = null;
        if ($student) {
            $currentEnrollment = [
                'status'        => $student->enrollment_status ?? 'Enrolled',
                'academic_year' => $student->section?->school_year ?? $student->school_year ?? null,
                'semester'      => $student->section?->semester    ?? $student->semester    ?? null,
                'year_level'    => $student->year_level ?? null,
                'program'       => $student->section?->program?->name ?? $student->course ?? null,
                'program_code'  => $student->section?->program?->code ?? null,
                'section'       => $student->section?->name           ?? null,
                'section_code'  => $student->section?->name           ?? null,
                'enrolled_at'   => $student->created_at?->format('F d, Y') ?? null,
            ];
        }

        // ── Enrolled subjects ──
        $subjects = [];
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('schedules') && $student?->section_id) {
                // Fetch schedules and join with users for teacher name
                $subjects = \Illuminate\Support\Facades\DB::table('schedules')
                    ->leftJoin('users', 'schedules.teacher_id', '=', 'users.id')
                    ->select('schedules.*', 'users.name as teacher_name')
                    ->where('section_id', $student->section_id)
                    ->get()
                    ->map(fn($s) => [
                        'code'       => null,
                        'name'       => $s->subject ?? null,
                        'units'      => null,
                        'schedule'   => trim(($s->day ?? '') . ' ' . ($s->start_time ?? '') . ' - ' . ($s->end_time ?? ''), ' -'),
                        'instructor' => $s->teacher_name ?? null,
                        'room'       => $s->room ?? null,
                        'status'     => 'Ongoing',
                    ])->toArray();
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('Could not load subjects: ' . $e->getMessage());
        }

        // ── Enrollment history ──
        $history = [];
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('enrollments') && $student) {
                $history = \Illuminate\Support\Facades\DB::table('enrollments')
                    ->leftJoin('sections', 'enrollments.section_id', '=', 'sections.id')
                    ->leftJoin('programs', 'sections.program_id', '=', 'programs.id')
                    ->where('student_id', $student->id)
                    ->orderByDesc('enrollments.created_at')
                    ->select('enrollments.*', 'sections.name as section_name', 'programs.name as program_name', 'sections.semester as section_semester')
                    ->get()
                    ->map(fn($e) => [
                        'academic_year' => $e->school_year ?? null,
                        'semester'      => $e->section_semester ?? null,
                        'year_level'    => $e->grade_level    ?? null,
                        'section'       => $e->section_name  ?? null,
                        'program'       => $e->program_name  ?? null,
                        'status'        => $e->status        ?? 'Enrolled',
                        'enrolled_at'   => $e->enrolled_date ? \Carbon\Carbon::parse($e->enrolled_date)->format('F d, Y') : null,
                    ])->toArray();
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('Could not load enrollment history: ' . $e->getMessage());
        }

        return Inertia::render('StudentPortal/Profile/Enrollment', [
            'student'           => $student,
            'currentEnrollment' => $currentEnrollment,
            'subjects'          => $subjects,
            'history'           => $history,
        ]);
    }
    public function profileId()        { return Inertia::render('StudentPortal/Profile/Id'); }
    public function gradesCurrent()    { return Inertia::render('StudentPortal/Grades/Current'); }
    public function gradesHistory()    { return Inertia::render('StudentPortal/Grades/History'); }
    public function gradesGpa()        { return Inertia::render('StudentPortal/Grades/Gpa'); }
    public function scheduleTimetable(){ return Inertia::render('StudentPortal/Schedule/Timetable'); }
    public function scheduleExams()    { return Inertia::render('StudentPortal/Schedule/Exams'); }
    public function attendanceRecord() { return Inertia::render('StudentPortal/Attendance/Record'); }
    public function attendanceAbsences(){ return Inertia::render('StudentPortal/Attendance/Absences'); }
    public function documentsOfficial(){ return Inertia::render('StudentPortal/Documents/Official'); }
    public function documentsMaterials(){ return Inertia::render('StudentPortal/Documents/Materials'); }
    public function documentsAssignments(){ return Inertia::render('StudentPortal/Documents/Assignments'); }
    public function reportData(Request $request)
    {
        Gate::authorize('viewAny', Student::class);
        
        $query = Student::query()->with([
            'user', 
            'section', 
            'semesterRecords.subjects', 
            'attendance', 
            'healthRecords', 
            'achievements', 
            'behaviorLogs', 
            'clearance',
            'studentActivities'
        ]);

        if ($request->has('search')) {
            $query->where('first_name', 'like', '%' . $request->search . '%')
                ->orWhere('last_name', 'like', '%' . $request->search . '%')
                ->orWhere('student_id', 'like', '%' . $request->search . '%');
        }

        if ($request->has('year_level')) {
            $query->where('year_level', $request->year_level);
        }

        if ($request->has('status')) {
            $query->where('enrollment_status', $request->status);
        }

        $allStudents = $query->get()->map(function($s) {
            $totalWeighted = 0;
            $totalUnits = 0;
            foreach ($s->semesterRecords as $record) {
                foreach ($record->subjects as $subject) {
                    if ($subject->grade !== null && in_array($subject->status, ['passed', 'failed'])) {
                        $totalWeighted += ($subject->grade * $subject->units);
                        $totalUnits += $subject->units;
                    }
                }
            }
            $s->gwa = $totalUnits > 0 ? round($totalWeighted / $totalUnits, 2) : null;
            return $s;
        });

        return response()->json($allStudents);
    }

    public function clearance()        { return Inertia::render('StudentPortal/Clearance'); }
    public function announcements()    { return Inertia::render('StudentPortal/Announcements'); }
    public function messages()         { return Inertia::render('StudentPortal/Messages'); }
}
