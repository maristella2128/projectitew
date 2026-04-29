<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Enrollment;
use App\Models\Student;
use App\Models\Section;
use App\Helpers\SpaRouting as Inertia;
use Illuminate\Support\Facades\Auth;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Enrollment::with([
            'student.user',
            'section.program.activeCurriculum',
        ]);

        if ($user->hasRole(['student', 'parent'])) {
            $query->whereHas('student', function($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        if ($request->filled('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->filled('section_id')) {
            $query->where('section_id', $request->section_id);
        }

        $enrollments = $query->latest()->paginate(10)->withQueryString();

        // Map enrollments to include semester context from their section
        $enrollments->getCollection()->transform(function ($enrollment) {
            $section = $enrollment->section;
            $enrollment->semester = $section?->semester ?? null;
            $enrollment->curriculum_id = $section?->program?->activeCurriculum?->id ?? null;
            return $enrollment;
        });

        return Inertia::render('EnrollmentHistory/Index', [
            'enrollments' => $enrollments,
            'sections'    => Section::with(['program'])->get(['id', 'name', 'grade_level', 'semester', 'program_id']),
            'students'    => Student::all(['id', 'first_name', 'last_name', 'student_id']),
            'filters'     => $request->only(['student_id', 'section_id']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'section_id' => 'nullable|exists:sections,id',
            'grade_level' => 'required|string',
            'school_year' => 'required|string',
            'status' => 'required|string',
            'enrolled_date' => 'required|date',
            'completed_date' => 'nullable|date|after_or_equal:enrolled_date',
        ]);

        Enrollment::create($validated);

        return redirect()->back()->with('success', 'Enrollment record added successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'section_id' => 'nullable|exists:sections,id',
            'grade_level' => 'required|string',
            'school_year' => 'required|string',
            'status' => 'required|string',
            'enrolled_date' => 'required|date',
            'completed_date' => 'nullable|date|after_or_equal:enrolled_date',
        ]);

        $enrollment = Enrollment::findOrFail($id);
        $enrollment->update($validated);

        return redirect()->back()->with('success', 'Enrollment record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $enrollment = Enrollment::findOrFail($id);
        $enrollment->delete();

        return redirect()->back()->with('success', 'Enrollment record deleted.');
    }
}
