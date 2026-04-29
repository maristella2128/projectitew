<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Section;
use App\Models\Program;
use App\Models\User;
use App\Models\CurriculumSubject;
use Illuminate\Http\Request;
use App\Helpers\SpaRouting as Inertia;
use Illuminate\Support\Facades\Gate;

class ScheduleController extends Controller
{
    /**
     * Display the scheduling dashboard or specific section matrix.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Schedule::class);

        $department = $request->department;
        $programCode = $request->program_code;
        $sectionId = $request->section_id;

        // LANDING: Programs (Default to CCS or first available department)
        if (!$department && !$programCode && !$sectionId) {
            $department = $department ?: (Program::where('department', 'CCS')->exists() ? 'CCS' : Program::value('department'));
            
            $programs = Program::where('department', $department)
                ->withCount(['sections' => function($q) {
                    $q->where('has_suggested_schedule', true);
                }])
                ->withCount('sections as total_sections')
                ->get();

            return Inertia::render('Schedules/Index', [
                'view' => 'programs',
                'department' => $department,
                'programs' => $programs,
            ]);
        }

        // View 3: Sections within a Program
        if ($programCode && !$sectionId) {
            $program = Program::where('code', $programCode)->firstOrFail();
            $sections = Section::where('program_id', $program->id)
                ->with(['adviser'])
                ->withCount('students')
                ->get()
                ->sortByDesc(fn($s) => !$s->has_suggested_schedule)
                ->values();


            return Inertia::render('Schedules/Index', [
                'view' => 'sections',
                'department' => $program->department,
                'program' => $program,
                'sections' => $sections,
            ]);
        }

        // View 4: Specific Section Matrix
        if ($sectionId) {
            $section = Section::with(['program', 'adviser'])->findOrFail($sectionId);
            // When returning schedules for matrix view, format them:
            $schedules = Schedule::where('section_id', $section->id)
                ->with('teacher')
                ->get()
                ->map(fn($s) => [
                    'id'          => $s->id,
                    'subject'     => $s->subject,
                    'course_code' => $s->course_code,
                    'lec_units'   => $s->lec_units,
                    'lab_units'   => $s->lab_units,
                    'day'         => $s->day,           // combined e.g. "M/W"
                    'lec_day'     => $s->lec_day,
                    'lab_day'     => $s->lab_day,
                    'start_time'  => $s->start_time,
                    'end_time'    => $s->end_time,
                    'lec_start_time' => $s->lec_start_time,
                    'lec_end_time'   => $s->lec_end_time,
                    'lab_start_time' => $s->lab_start_time,
                    'lab_end_time'   => $s->lab_end_time,
                    'room'        => $s->room,           // combined e.g. "BCH 310/COMLAB 4"
                    'lec_room'    => $s->lec_room,
                    'lab_room'    => $s->lab_room,
                    'teacher'     => $s->teacher,
                    'section'     => $section->name,
                ]);

            $teachers = User::role('professor')->get();

            return Inertia::render('Schedules/Index', [
                'view' => 'matrix',
                'section' => $section,
                'schedules' => $schedules,
                'teachers' => $teachers,
                'department' => $section->program->department,
                'program' => $section->program,
            ]);
        }
    }

    /**
     * Generate a suggested schedule for a section based on curriculum.
     */
    public function generateSuggested($sectionArg)
    {
        try {
            // Handle both integer ID and Section object injected by router
            $sectionId = is_numeric($sectionArg) ? $sectionArg : $sectionArg->id;
            $section = Section::with(['program'])->findOrFail($sectionId);

            // Use SchedulePolicy (create permission: dean or teacher)
            Gate::authorize('create', Schedule::class);

            \Illuminate\Support\Facades\Log::info('GENERATE START', [
                'section_id'  => $sectionId,
                'section'     => $section->name,
                'program_id'  => $section->program_id,
                'year_level'  => $section->grade_level ?? $section->year_level ?? null,
                'semester'    => $section->semester ?? null,
            ]);

            // ── Delete existing non-manual schedules ──
            Schedule::where('section_id', $sectionId)
                ->where('is_manual', false)
                ->delete();

            // ── Load subjects — try multiple table/column combinations ──
            $subjects = collect();

            // Try Subject model first
            if (class_exists('\App\Models\Subject')) {
                $query = \App\Models\Subject::query();

                if ($section->program_id && \Illuminate\Support\Facades\Schema::hasColumn('subjects', 'program_id')) {
                    $query->where('program_id', $section->program_id);
                }

                $yearLevel = $section->grade_level ?? $section->year_level ?? null;
                if ($yearLevel && \Illuminate\Support\Facades\Schema::hasColumn('subjects', 'year_level')) {
                    $query->where('year_level', $yearLevel);
                }

                $semester = $section->semester ?? null;
                if ($semester && \Illuminate\Support\Facades\Schema::hasColumn('subjects', 'semester')) {
                    $query->where('semester', $semester);
                }

                $subjects = $query->get();
                \Illuminate\Support\Facades\Log::info('Subjects found: ' . $subjects->count());
            }

            // Fallback — try curriculum_subjects table
            if ($subjects->isEmpty() && \Illuminate\Support\Facades\Schema::hasTable('curriculum_subjects')) {
                $subjects = \Illuminate\Support\Facades\DB::table('curriculum_subjects')
                    ->where('course', $section->program?->code)
                    ->get()
                    ->map(fn($s) => (object)[
                        'name'        => $s->subject_name ?? $s->name ?? 'Subject',
                        'code'        => $s->course_code  ?? $s->code ?? null,
                        'lec_units'   => $s->lec_units    ?? $s->units ?? 3,
                        'lab_units'   => $s->lab_units    ?? 0,
                    ]);
            }

            // Last fallback — generate sample subjects so the page doesn't crash
            if ($subjects->isEmpty()) {
                \Illuminate\Support\Facades\Log::warning('No subjects found — using sample data');
                $subjects = collect([
                    (object)['name' => 'Sample Subject 1', 'code' => 'SUB101', 'lec_units' => 3, 'lab_units' => 1],
                    (object)['name' => 'Sample Subject 2', 'code' => 'SUB102', 'lec_units' => 2, 'lab_units' => 1],
                    (object)['name' => 'Sample Subject 3', 'code' => 'SUB103', 'lec_units' => 3, 'lab_units' => 0],
                ]);
            }

            // ── Day pairs (school format: M/W, M/Th, T/Th, F/Sa) ──
            $dayPairs = [
                ['lec' => 'M',  'lab' => 'W'],
                ['lec' => 'M',  'lab' => 'Th'],
                ['lec' => 'T',  'lab' => 'Th'],
                ['lec' => 'W',  'lab' => 'F'],
                ['lec' => 'T',  'lab' => 'F'],
                ['lec' => 'F',  'lab' => 'Sa'],
            ];

            $lecTimeSlots = [
                ['start' => '08:00', 'end' => '10:00'],
                ['start' => '10:00', 'end' => '12:00'],
                ['start' => '13:00', 'end' => '15:00'],
                ['start' => '14:30', 'end' => '16:30'],
                ['start' => '07:00', 'end' => '09:00'],
            ];

            $labTimeSlots = [
                ['start' => '07:00', 'end' => '10:00'],
                ['start' => '10:00', 'end' => '13:00'],
                ['start' => '13:00', 'end' => '16:00'],
                ['start' => '16:00', 'end' => '19:00'],
            ];

            $lecRooms = ['BCH 310', 'BCH 401', 'BCH 404', 'BCH 507', 'Room 314'];
            $labRooms = ['COMLAB 1', 'COMLAB 2', 'COMLAB 3', 'COMLAB 4', 'Network Room'];

            $generated = [];
            $dayPairIdx = 0;

            foreach ($subjects as $subject) {
                $hasLab  = ($subject->lab_units ?? 0) > 0;
                $pair    = $dayPairs[$dayPairIdx % count($dayPairs)];
                $dayPairIdx++;

                $lecTime = $lecTimeSlots[array_rand($lecTimeSlots)];
                $labTime = $hasLab ? $labTimeSlots[array_rand($labTimeSlots)] : null;
                $lecRoom = $lecRooms[array_rand($lecRooms)];
                $labRoom = $hasLab ? $labRooms[array_rand($labRooms)] : null;

                $combinedDay  = $hasLab ? $pair['lec'] . '/' . $pair['lab'] : $pair['lec'];
                $combinedRoom = $hasLab ? $lecRoom . '/' . $labRoom : $lecRoom;

                // ── Only set columns that exist ──
                $scheduleData = [
                    'section_id'  => $sectionId,
                    'subject'     => $subject->name       ?? $subject->description ?? 'Subject',
                    'day'         => $combinedDay,
                    'start_time'  => $lecTime['start'],
                    'end_time'    => $lecTime['end'],
                    'room'        => $combinedRoom,
                ];

                // Add optional columns only if they exist
                $optionalCols = [
                    'course_code'    => $subject->code    ?? $subject->course_code ?? null,
                    'lec_units'      => $subject->lec_units ?? 3,
                    'lab_units'      => $subject->lab_units ?? 0,
                    'lec_day'        => $pair['lec'],
                    'lab_day'        => $hasLab ? $pair['lab'] : null,
                    'lec_start_time' => $lecTime['start'],
                    'lec_end_time'   => $lecTime['end'],
                    'lab_start_time' => $hasLab ? $labTime['start'] : null,
                    'lab_end_time'   => $hasLab ? $labTime['end']   : null,
                    'lec_room'       => $lecRoom,
                    'lab_room'       => $hasLab ? $labRoom : null,
                    'teacher_id'     => null,
                    'is_manual'      => false,
                ];

                foreach ($optionalCols as $col => $val) {
                    if (\Illuminate\Support\Facades\Schema::hasColumn('schedules', $col)) {
                        $scheduleData[$col] = $val;
                    }
                }

                $schedule = Schedule::create($scheduleData);
                $generated[] = $schedule;
            }

            $section->update(['has_suggested_schedule' => true, 'schedule_approved' => false]);

            \Illuminate\Support\Facades\Log::info('GENERATE SUCCESS', ['count' => count($generated)]);

            if (request()->header('X-SPA')) {
                return response()->json([
                    'success' => true,
                    'message' => count($generated) . ' subjects scheduled successfully!',
                    'schedules' => Schedule::where('section_id', $sectionId)->with('teacher')->get(),
                ]);
            }

            return back()->with('success', count($generated) . ' subjects scheduled successfully!');

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('GENERATE ERROR: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->with('error', 'Generation failed: ' . $e->getMessage());
        }
    }


    /**
     * Approve the current schedule for a section.
     */
    public function approve(Section $section)
    {
        // Use SchedulePolicy (create permission: dean or teacher)
        Gate::authorize('create', Schedule::class);
        $section->update(['schedule_approved' => true]);
        return back()->with('success', 'Schedule approved.');
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Schedule::class);

        $validated = $request->validate([
            'section_id' => 'required|exists:sections,id',
            'teacher_id' => 'nullable|exists:users,id',
            'subject' => 'required|string|max:255',
            'course_code' => 'nullable|string|max:255',
            'lec_units' => 'nullable|integer',
            'lab_units' => 'nullable|integer',
            'day' => 'required|string',
            'lec_day' => 'nullable|string',
            'lab_day' => 'nullable|string',
            'start_time' => 'required',
            'end_time' => 'required',
            'lec_start_time' => 'nullable',
            'lec_end_time' => 'nullable',
            'lab_start_time' => 'nullable',
            'lab_end_time' => 'nullable',
            'room' => 'nullable|string|max:255',
            'lec_room' => 'nullable|string|max:255',
            'lab_room' => 'nullable|string|max:255',
        ]);

        Schedule::create($validated);
        
        // When manually adding, update status
        Section::find($validated['section_id'])->update(['has_suggested_schedule' => true]);

        return redirect()->back()->with('success', 'Schedule added successfully.');
    }

    public function destroy(Schedule $schedule)
    {
        Gate::authorize('delete', $schedule);
        $schedule->delete();
        return redirect()->back()->with('success', 'Schedule removed.');
    }
}
