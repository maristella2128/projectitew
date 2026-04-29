<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Curriculum;
use App\Models\CurriculumCourse;
use App\Models\Program;
use Illuminate\Http\Request;
use App\Helpers\SpaRouting as Inertia;

class CurriculumController extends Controller
{
    public function index(Request $request)
    {
        $curricula = Curriculum::with('program')
            ->withCount('courses')
            ->orderByDesc('effective_year')
            ->get();

        $programs = Program::orderBy('code')->get();

        return Inertia::render('Curriculum/Index', [
            'curricula' => $curricula,
            'programs'  => $programs,
        ]);
    }

    public function show(Curriculum $curriculum, Request $request)
    {
        $curriculum->load(['program', 'courses.preRequisite']);

        $grouped = $curriculum->courses
            ->groupBy('pivot.year_level')
            ->map(fn($yearGroup) => $yearGroup->groupBy('pivot.semester'));

        $allCourses = Course::where('is_active', true)
            ->orderBy('code')
            ->get();

        // Build student context if navigating from enrollment history
        $studentContext = null;
        if ($request->filled('student_id')) {
            $student = \App\Models\Student::with('section')->find($request->student_id);
            if ($student) {
                $studentContext = [
                    'student_id'  => $student->id,
                    'name'        => $student->first_name . ' ' . $student->last_name,
                    'student_no'  => $student->student_id,
                    'semester'    => $request->input('semester', $student->section?->semester),
                    'year_level'  => $request->input('year_level', $student->section?->grade_level),
                ];
            }
        }

        return Inertia::render('Curriculum/Show', [
            'curriculum'     => $curriculum,
            'grouped'        => $grouped,
            'allCourses'     => $allCourses,
            'programs'       => Program::orderBy('code')->get(),
            'studentContext' => $studentContext,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'program_id'     => 'required|exists:programs,id',
            'effective_year' => 'required|integer|min:2000|max:2099',
            'status'         => 'required|in:Draft,Active,Archived',
            'description'    => 'nullable|string',
        ]);

        Curriculum::create($validated);
        return back()->with('success', 'Curriculum created.');
    }

    public function update(Request $request, Curriculum $curriculum)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'program_id'     => 'required|exists:programs,id',
            'effective_year' => 'required|integer|min:2000|max:2099',
            'status'         => 'required|in:Draft,Active,Archived',
            'description'    => 'nullable|string',
        ]);

        $curriculum->update($validated);
        return back()->with('success', 'Curriculum updated.');
    }

    // Add a course to a curriculum slot
    public function addCourse(Request $request, Curriculum $curriculum)
    {
        $validated = $request->validate([
            'course_id'  => 'required|exists:courses,id',
            'year_level' => 'required|in:1st Year,2nd Year,3rd Year,4th Year',
            'semester'   => 'required|in:1st Semester,2nd Semester,Summer',
            'order'      => 'integer|min:0',
        ]);

        // Prevent duplicate
        $exists = CurriculumCourse::where('curriculum_id', $curriculum->id)
            ->where('course_id', $validated['course_id'])
            ->where('year_level', $validated['year_level'])
            ->where('semester', $validated['semester'])
            ->exists();

        if ($exists) {
            return back()->with('error', 'Course already added to this slot.');
        }

        CurriculumCourse::create([
            'curriculum_id' => $curriculum->id,
            'course_id'     => $validated['course_id'],
            'year_level'    => $validated['year_level'],
            'semester'      => $validated['semester'],
            'order'         => $validated['order'] ?? 0,
        ]);

        return back()->with('success', 'Course added to curriculum.');
    }

    // Remove a course from curriculum
    public function removeCourse(Curriculum $curriculum, Course $course)
    {
        CurriculumCourse::where('curriculum_id', $curriculum->id)
            ->where('course_id', $course->id)
            ->delete();

        return back()->with('success', 'Course removed from curriculum.');
    }

    public function destroy(Curriculum $curriculum)
    {
        $curriculum->delete();
        return back()->with('success', 'Curriculum deleted.');
    }
}
