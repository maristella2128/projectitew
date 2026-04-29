<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Helpers\SpaRouting as Inertia;
use Illuminate\Http\JsonResponse; use Illuminate\Http\Response as HttpResponse; use Illuminate\View\View;

class SectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Section::class);

        // Preserve existing JSON format for API dropdowns
        if ($request->wantsJson()) {
            $query = Section::query()->with(['adviser'])->withCount('students');
            if ($request->has('grade_level_id')) {
                $query->where('grade_level', $request->grade_level_id);
            }
            return response()->json($query->get()->map(fn($s) => ['id' => $s->id, 'name' => $s->name]));
        }

        // Level 2: Sections by Course
        if ($request->has('course')) {
            $sections = Section::with(['adviser'])->withCount('students')
                ->where('name', 'LIKE', $request->course . '-%')
                ->orderBy('grade_level', 'asc')
                ->get();
                
            return Inertia::render('Sections/Index', [
                'course' => $request->course,
                'sections' => $sections,
                'curricula' => \App\Models\Curriculum::with('program')->get(),
                'programs' => \App\Models\Program::all(),
            ]);
        }

        // Level 1: Course Selection (Distinct Courses + Aggregates)
        // Since 'course' is not a database column, extract it from the 'name' e.g. "BSIT-1A" -> "BSIT"
        $allSections = Section::withCount('students')->get();
        $coursesMap = [];
        
        foreach ($allSections as $section) {
            $courseCode = explode('-', $section->name)[0];
            if (!isset($coursesMap[$courseCode])) {
                $coursesMap[$courseCode] = ['course' => $courseCode, 'section_count' => 0, 'student_count' => 0];
            }
            $coursesMap[$courseCode]['section_count']++;
            $coursesMap[$courseCode]['student_count'] += $section->students_count;
        }

        return Inertia::render('Sections/Index', [
            'courses' => array_values($coursesMap),
            'curricula' => \App\Models\Curriculum::with('program')->get(),
            'programs' => \App\Models\Program::all(),
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Section::class);
        $teachers = \App\Models\User::role('professor')->get();
        return Inertia::render('Sections/Create', [
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:sections',
            'grade_level' => 'required|string',
            'school_year' => 'required|string',
            'semester' => 'required|string',
            'adviser_id' => 'nullable|exists:users,id',
            'curriculum_id' => 'nullable|exists:curricula,id',
        ]);

        Section::create($validated);

        return redirect()->route('sections.index')->with('success', 'Section created successfully.');
    }

    public function show(Section $section)
    {
        Gate::authorize('view', $section);
        return Inertia::render('Sections/Show', [
            'section' => $section->load(['adviser', 'students.user']),
        ]);
    }

    public function edit(Section $section)
    {
        Gate::authorize('update', $section);
        $teachers = \App\Models\User::role('professor')->get();
        return Inertia::render('Sections/Edit', [
            'section' => $section,
            'teachers' => $teachers,
        ]);
    }

    public function update(Request $request, Section $section)
    {
        Gate::authorize('update', $section);
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:sections,name,' . $section->id,
            'grade_level' => 'required|string',
            'school_year' => 'required|string',
            'semester' => 'required|string',
            'adviser_id' => 'nullable|exists:users,id',
            'curriculum_id' => 'nullable|exists:curricula,id',
        ]);

        $section->update($validated);

        return redirect()->route('sections.index')->with('success', 'Section updated successfully.');
    }

    public function assignStudent(Request $request, Section $section)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
        ]);

        \App\Models\Student::where('id', $request->student_id)
               ->update(['section_id' => $section->id]);

        return back()->with('success', 'Student assigned successfully.');
    }

    public function destroy(Section $section)
    {
        Gate::authorize('delete', $section);
        $section->delete();
        return redirect()->route('sections.index')->with('success', 'Section deleted.');
    }

    public function destroyProgram(Request $request, $course)
    {
        Gate::authorize('delete', new \App\Models\Section);
        
        if (empty(trim($course))) {
            return back()->with('error', 'Invalid program code.');
        }

        \App\Models\Section::where('name', 'LIKE', $course . '-%')
               ->orWhere('name', $course)
               ->delete();

        return back()->with('success', 'Program and its associated sections deleted successfully.');
    }
}
