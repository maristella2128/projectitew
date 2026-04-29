<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use App\Helpers\SpaRouting as Inertia;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::with('preRequisite');

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('code', 'like', "%{$request->search}%")
                  ->orWhere('name', 'like', "%{$request->search}%");
            });
        }

        if ($request->department && $request->department !== 'All') {
            $query->where('department', $request->department);
        }

        if ($request->type && $request->type !== 'All') {
            $query->where('type', $request->type);
        }

        $courses = $query->orderBy('code')->paginate(20)->withQueryString();

        return Inertia::render('Curriculum/Courses/Index', [
            'courses'      => $courses,
            'preRequisites' => Course::orderBy('code')->get(['id', 'code', 'name']),
            'filters'      => $request->only(['search', 'department', 'type']),
            'departments'  => Course::whereNotNull('department')->distinct()->pluck('department'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code'             => 'required|string|unique:courses,code|max:20',
            'name'             => 'required|string|max:255',
            'description'      => 'nullable|string',
            'lec_units'        => 'required|integer|min:0|max:6',
            'lab_units'        => 'required|integer|min:0|max:6',
            'type'             => 'required|in:Core,Elective,GE,Professional,Other',
            'department'       => 'nullable|string|max:100',
            'pre_requisite_id' => 'nullable|exists:courses,id',
            'is_active'        => 'boolean',
        ]);

        Course::create($validated);
        return back()->with('success', 'Course created successfully.');
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'code'             => 'required|string|unique:courses,code,' . $course->id . '|max:20',
            'name'             => 'required|string|max:255',
            'description'      => 'nullable|string',
            'lec_units'        => 'required|integer|min:0|max:6',
            'lab_units'        => 'required|integer|min:0|max:6',
            'type'             => 'required|in:Core,Elective,GE,Professional,Other',
            'department'       => 'nullable|string|max:100',
            'pre_requisite_id' => 'nullable|exists:courses,id',
            'is_active'        => 'boolean',
        ]);

        $course->update($validated);
        return back()->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        $course->delete();
        return back()->with('success', 'Course deleted.');
    }
}
