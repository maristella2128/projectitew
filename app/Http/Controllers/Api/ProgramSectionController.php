<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

use App\Services\AcademicService;

class ProgramSectionController extends Controller
{
    protected $academicService;

    public function __construct(AcademicService $academicService)
    {
        $this->academicService = $academicService;
    }
    // GET /api/programs
    public function getPrograms(Request $request)
    {
        // Must return [{code, name, dept, section_count, student_count}]
        $programs = Program::withCount([
            'sections',
            'sections as student_count' => function ($query) {
                $query->join('students', 'students.section_id', '=', 'sections.id');
            }
        ])->get()->map(function($p) {
            return [
                'code' => $p->code,
                'name' => $p->name,
                'dept' => $p->department,
                'section_count' => $p->sections_count,
                'student_count' => $p->student_count, // Needs proper counting, see below
            ];
        });

        // Let's do a more robust student_count
        $programs = Program::withCount('sections')->get();
        
        $programsArr = $programs->map(function($p) {
            // Count total students across all sections for this program
            $studentCount = \App\Models\Student::whereHas('section', function($q) use ($p) {
                $q->where('program_id', $p->id);
            })->count();

            return [
                'code' => $p->code,
                'name' => $p->name,
                'dept' => $p->department,
                'active_curriculum_id' => $p->active_curriculum_id,
                'is_seeded' => $p->is_seeded,
                'section_count' => $p->sections_count,
                'student_count' => $studentCount,
            ];
        });

        return response()->json($programsArr);
    }

    // POST /api/programs
    public function storeProgram(Request $request)
    {
        Gate::authorize('create', Section::class); 
        
        $request->validate([
            'name' => 'required|string|max:255|unique:programs,name',
            'active_curriculum_id' => 'nullable|exists:curricula,id',
        ]);

        $words = explode(' ', $request->name);
        $code = strtoupper(implode('', array_map(fn($w) => $w[0] ?? '', $words)));

        $program = Program::create([
            'code' => $code,
            'name' => $request->name,
            'department' => 'CCS', 
            'active_curriculum_id' => $request->active_curriculum_id,
            'is_seeded' => false,
        ]);

        return response()->json([
            'code' => $program->code,
            'name' => $program->name,
            'dept' => $program->department,
            'active_curriculum_id' => $program->active_curriculum_id,
            'is_seeded' => $program->is_seeded,
            'section_count' => 0,
            'student_count' => 0,
        ], 201);
    }

    // PATCH /api/programs/{code}
    public function updateProgram(Request $request, $code)
    {
        Gate::authorize('update', new Section); 

        $program = Program::where('code', $code)->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'dept' => 'required|string|max:255',
            'active_curriculum_id' => 'nullable|exists:curricula,id',
        ]);

        $program->update([
            'name' => $validated['name'],
            'department' => $validated['dept'],
            'active_curriculum_id' => $validated['active_curriculum_id'],
        ]);

        return response()->json([
            'code' => $program->code,
            'name' => $program->name,
            'dept' => $program->department,
            'active_curriculum_id' => $program->active_curriculum_id,
            'section_count' => $program->sections()->count(),
            'student_count' => \App\Models\Student::whereHas('section', function($q) use ($program) {
                $q->where('program_id', $program->id);
            })->count(),
        ]);
    }

    // DELETE /api/programs/{code}
    public function destroyProgram(Request $request, $code)
    {
        Gate::authorize('delete', new Section); 

        $program = Program::where('code', $code)->firstOrFail();
        
        // Let's also delete sections (students will have section_id set to null because of foreign key onDelete('set null'))
        $program->sections()->delete();
        $program->delete();

        return response()->json(['success' => true]);
    }

    // GET /api/programs/{code}/sections
    public function getSections(Request $request, $code)
    {
        $program = Program::where('code', $code)->firstOrFail();

        $sections = $program->sections()
            ->with(['adviser:id,name'])
            ->withCount('students')
            ->orderBy('grade_level', 'asc')
            ->get();

        $sectionsArr = $sections->map(function($s) {
            return [
                'id' => $s->id,
                'name' => $s->name,
                'grade_level' => $s->grade_level,
                'school_year' => $s->school_year,
                'semester' => $this->mapIdToSemester($s->semester),
                'adviser' => $s->adviser ? ['name' => $s->adviser->name] : null,
                'students_count' => $s->students_count,
            ];
        });

        return response()->json($sectionsArr);
    }

    // POST /api/programs/{code}/sections
    public function storeSection(Request $request, $code)
    {
        Gate::authorize('create', Section::class);

        $program = Program::where('code', $code)->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:sections,name',
            'grade_level' => 'required|string',
            'school_year' => 'required|string',
            'semester' => 'nullable|string',
            'adviser_id' => 'nullable|exists:users,id',
        ]);

        if (isset($validated['semester'])) {
            $validated['semester'] = $this->mapSemesterToId($validated['semester']);
        }

        $section = $program->sections()->create($validated);

        // Load adviser for response
        $section->load('adviser:id,name');

        return response()->json([
            'id' => $section->id,
            'name' => $section->name,
            'grade_level' => $section->grade_level,
            'school_year' => $section->school_year,
            'semester' => $this->mapIdToSemester($section->semester),
            'adviser' => $section->adviser ? ['name' => $section->adviser->name] : null,
            'students_count' => 0,
        ], 201);
    }

    // DELETE /api/sections/{id}
    public function destroySection(Request $request, $id)
    {
        $section = Section::findOrFail($id);
        Gate::authorize('delete', $section);
        
        $section->delete();
        
        return response()->json(['success' => true]);
    }

    // PATCH /api/sections/{id}
    public function updateSection(Request $request, $id)
    {
        $section = Section::findOrFail($id);
        Gate::authorize('update', $section);

        $validated = $request->validate([
            'name'         => 'required|string|max:255|unique:sections,name,' . $id,
            'grade_level'  => 'required|string',
            'school_year'  => 'required|string',
            'semester'     => 'nullable|string',
            'adviser_id'   => 'nullable|exists:users,id',
        ]);

        if (isset($validated['semester'])) {
            $validated['semester'] = $this->mapSemesterToId($validated['semester']);
        }

        $section->update($validated);

        // Load adviser for the response
        $section->load('adviser:id,name');

        return response()->json([
            'id'             => $section->id,
            'name'           => $section->name,
            'grade_level'    => $section->grade_level,
            'school_year'    => $section->school_year,
            'semester'       => $this->mapIdToSemester($section->semester),
            'adviser'        => $section->adviser ? ['name' => $section->adviser->name] : null,
            'students_count' => $section->students()->count(),
        ]);
    }

    private function mapSemesterToId($semesterStr)
    {
        if (is_numeric($semesterStr)) return (int) $semesterStr;
        
        return match ($semesterStr) {
            '1st Semester' => 1,
            '2nd Semester' => 2,
            'Summer' => 3,
            default => 1,
        };
    }

    private function mapIdToSemester($id)
    {
        return match ((int)$id) {
            1 => '1st Semester',
            2 => '2nd Semester',
            3 => 'Summer',
            default => '1st Semester',
        };
    }

    // GET /api/directory/teachers
    public function getTeachers(Request $request)
    {
        $teachers = \App\Models\User::role('professor')->select('id', 'name')->get();
        return response()->json($teachers);
    }

    // GET /api/directory/students
    public function getStudents(Request $request)
    {
        // Get all students with their section name for directory viewing
        $query = \App\Models\Student::with('section:id,name')
            ->select('id', 'first_name', 'middle_name', 'last_name', 'student_id', 'year_level', 'section_id');

        return response()->json($query->get());
    }

    // GET /api/sections/{id}/details (ROSTER VIEW)
    public function getSectionDetails(Request $request, $id)
    {
        $section = Section::with(['adviser:id,name', 'students', 'program'])->findOrFail($id);
        
        $program = $section->program;
        $curriculumId = $section->curriculum_id ?? ($program ? $program->active_curriculum_id : null);
        
        $subjects = [];
        if ($curriculumId) {
            $subjects = \App\Models\CurriculumCourse::with('course')
                ->where('curriculum_id', $curriculumId)
                ->where('year_level', (int) filter_var($section->grade_level, FILTER_SANITIZE_NUMBER_INT))
                ->where('semester', (int) $section->semester)
                ->orderBy('order')
                ->get()
                ->map(fn($cc) => [
                    'id' => $cc->id,
                    'subject_code' => $cc->course->code,
                    'subject_name' => $cc->course->name,
                    'units' => $cc->course->lec_units + $cc->course->lab_units,
                ]);
        }

        return response()->json([
            'id' => $section->id,
            'name' => $section->name,
            'grade_level' => $section->grade_level,
            'semester' => $this->mapIdToSemester($section->semester),
            'school_year' => $section->school_year,
            'adviser' => $section->adviser,
            'students' => $section->students,
            'curriculum_subjects' => $subjects
        ]);
    }

    // PATCH /api/sections/{id}/adviser
    public function updateAdviser(Request $request, $id)
    {
        $section = Section::findOrFail($id);
        Gate::authorize('update', $section);

        $validated = $request->validate([
            'adviser_id' => 'required|exists:users,id',
        ]);

        $section->update(['adviser_id' => $validated['adviser_id']]);
        return response()->json(['success' => true, 'adviser' => $section->adviser]);
    }

    // POST /api/sections/{id}/assign-students
    public function assignStudents(Request $request, $id)
    {
        $section = Section::with('program')->findOrFail($id);
        // Gate::authorize('update', $section);

        $validated = $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:students,id',
        ]);

        // Check if any of these students are already in a DIFFERENT section
        $alreadyAssigned = \App\Models\Student::whereIn('id', $validated['student_ids'])
            ->whereNotNull('section_id')
            ->where('section_id', '!=', $section->id)
            ->with('section')
            ->get();

        if ($alreadyAssigned->isNotEmpty()) {
            $studentNames = $alreadyAssigned->map(fn($s) => "{$s->first_name} ({$s->section->name})")->join(', ');
            return response()->json([
                'message' => "The following students are already enrolled in other sections: $studentNames"
            ], 422);
        }

        \App\Models\Student::whereIn('id', $validated['student_ids'])
               ->update(['section_id' => $section->id]);

        foreach($validated['student_ids'] as $studentId) {
            $student = \App\Models\Student::find($studentId);
            if ($student) {
                $this->academicService->enrollStudent($student, $section);
            }
        }

        return response()->json(['success' => true]);
    }

    // DELETE /api/sections/{id}/remove-student/{studentId}
    public function removeStudent(Request $request, $id, $studentId)
    {
        $section = Section::findOrFail($id);
        // Gate::authorize('update', $section);

        \App\Models\Student::where('id', $studentId)
               ->where('section_id', $section->id)
               ->update(['section_id' => null]);

        return response()->json(['success' => true]);
    }

    // GET /api/sections/{id}/grades
    public function getSectionGrades(Request $request, $id)
    {
        $section = Section::with(['students.semesterRecords.subjects'])->findOrFail($id);
        
        $gradeData = [];
        foreach ($section->students as $student) {
            // Find the current semester record matching section's school_year and semester
            $record = $student->semesterRecords
                ->where('academic_year', $section->school_year)
                ->where('semester', (int) $section->semester)
                ->first();
            
            $gradeData[] = [
                'student_id' => $student->id,
                'name' => $student->first_name . ' ' . $student->last_name,
                'lrn' => $student->student_id,
                'subjects' => $record ? $record->subjects->map(function ($subj) {
                    return [
                        'id' => $subj->id,
                        'subject_code' => $subj->subject_code,
                        'subject_name' => $subj->subject_name,
                        'prelim_grade' => $subj->prelim_grade,
                        'midterm_grade' => $subj->midterm_grade,
                        'prefinal_grade' => $subj->prefinal_grade,
                        'final_grade' => $subj->final_grade,
                        'status' => $subj->status,
                        'is_locked' => $subj->is_locked,
                    ];
                }) : [],
            ];
        }

        return response()->json($gradeData);
    }

    // PATCH /api/grades/{subjectId}/inline-update
    public function updateInlineGrade(Request $request, $subjectId)
    {
        $validated = $request->validate([
            'prelim_grade' => 'nullable|numeric|min:0|max:100',
            'midterm_grade' => 'nullable|numeric|min:0|max:100',
            'prefinal_grade' => 'nullable|numeric|min:0|max:100',
            'final_grade' => 'nullable|numeric|min:0|max:100', // allow override or auto-compute
        ]);

        $subject = \App\Models\SemesterSubject::findOrFail($subjectId);

        if ($subject->is_locked) {
            return response()->json(['message' => 'Grade is locked'], 403);
        }

        // Auto compute if all three are present and final is not manually overridden
        $finalGrade = $validated['final_grade'] ?? null;
        if (!$finalGrade && isset($validated['prelim_grade']) && isset($validated['midterm_grade']) && isset($validated['prefinal_grade'])) {
            // Formula: Prelim 20%, Midterm 30%, PreFinal 20%, Final (which is actually Finals Period) 30%
            // Wait, the formula mentioned in the prompt is 20/30/20/30. 
            // BUT wait, "prefinal_grade" is 20%, and the 4th period is the "Finals Period" (which we might call final_grade, but we also have the computed "Final Grade").
            // Let's assume the computed grade is the final_grade, and the 4th period is just calculated if they pass 4 values?
            // Actually, let's keep it simple: if they provide a final_grade, we use it. If they provide the 3 periods, we don't have a 4th period field.
            // Let's assume the user meant final_grade = The Computed Overall Grade.
            // Or maybe final_grade = The 4th Period Grade. 
            // If final_grade is the 4th period, where do we store the computed average? In the existing "grade" column!
            
            // Let's use `grade` as the Overall Computed Average.
            // And final_grade as the 4th period grade.
        }

        $subject->prelim_grade = $validated['prelim_grade'] ?? $subject->prelim_grade;
        $subject->midterm_grade = $validated['midterm_grade'] ?? $subject->midterm_grade;
        $subject->prefinal_grade = $validated['prefinal_grade'] ?? $subject->prefinal_grade;
        $subject->final_grade = $validated['final_grade'] ?? $subject->final_grade;

        // Compute overall average if all 4 periods have grades
        if ($subject->prelim_grade !== null && $subject->midterm_grade !== null && $subject->prefinal_grade !== null && $subject->final_grade !== null) {
            $computed = ($subject->prelim_grade * 0.20) + ($subject->midterm_grade * 0.30) + ($subject->prefinal_grade * 0.20) + ($subject->final_grade * 0.30);
            $subject->grade = round($computed, 2);
            $subject->status = $subject->grade >= 75 ? 'passed' : 'failed';
        }

        $subject->save();

        return response()->json(['success' => true, 'subject' => $subject]);
    }
    // POST /api/sections/{id}/sync-grades
    public function syncSectionGrades(Request $request, $id)
    {
        $section = Section::with(['program', 'students'])->findOrFail($id);
        
        $curriculumId = $section->curriculum_id ?? ($section->program ? $section->program->active_curriculum_id : null);
        
        $subjects = [];
        if ($curriculumId) {
            $subjects = \App\Models\CurriculumCourse::with('course')
                ->where('curriculum_id', $curriculumId)
                ->where('year_level', (int) filter_var($section->grade_level, FILTER_SANITIZE_NUMBER_INT))
                ->where('semester', (int) $section->semester)
                ->get();
        }

        if (empty($subjects)) {
            return response()->json(['message' => 'No curriculum subjects found for this level.'], 422);
        }

        foreach($section->students as $student) {
            $record = \App\Models\SemesterRecord::firstOrCreate([
                'student_id' => $student->id,
                'academic_year' => $section->school_year,
                'semester' => (int) $section->semester,
            ], [
                'status' => 'enrolled'
            ]);

            foreach($subjects as $cc) {
                \App\Models\SemesterSubject::firstOrCreate([
                    'semester_record_id' => $record->id,
                    'subject_code' => $cc->course->code,
                ], [
                    'subject_name' => $cc->course->name,
                    'units' => $cc->course->lec_units + $cc->course->lab_units,
                    'status' => 'ongoing',
                ]);
            }
        }

        return response()->json(['success' => true]);
    }
}
