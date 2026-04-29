<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExtracurricularRequest;
use App\Models\ActivityCategory;
use App\Models\ExtracurricularActivity;
use Illuminate\Http\Request;
use App\Helpers\SpaRouting as Inertia;

class ExtracurricularController extends Controller
{
    /**
     * Display a paginated, filtered listing of activities.
     */
    public function index(Request $request)
    {
        $query = ExtracurricularActivity::with('category');

        if ($request->filled('category')) {
            $query->where('activity_category_id', $request->category);
        }

        if ($request->filled('type')) {
            $query->where('activity_type', $request->type);
        }

        if ($request->filled('course')) {
            $query->whereJsonContains('recommended_for_courses', $request->course);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%$s%")
                  ->orWhere('description', 'like', "%$s%");
            });
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $activities = $query->latest()->paginate(20)->withQueryString();
        $categories = ActivityCategory::all(['id', 'name', 'color']);

        return Inertia::render('Extracurriculars/Index', [
            'activities' => $activities,
            'categories' => $categories,
            'filters'    => $request->only(['category', 'type', 'course', 'search', 'is_active']),
        ]);
    }

    /**
     * Store a new extracurricular activity.
     */
    public function store(StoreExtracurricularRequest $request)
    {
        ExtracurricularActivity::create($request->validated());

        return redirect()->back()->with('success', 'Activity created successfully.');
    }

    /**
     * Update an existing extracurricular activity.
     */
    public function update(StoreExtracurricularRequest $request, ExtracurricularActivity $extracurricular)
    {
        $extracurricular->update($request->validated());

        return redirect()->back()->with('success', 'Activity updated successfully.');
    }

    /**
     * Delete an activity — only if no student_activities reference it.
     */
    public function destroy(ExtracurricularActivity $extracurricular)
    {
        if ($extracurricular->studentActivities()->exists()) {
            return redirect()->back()->withErrors([
                'delete' => 'Cannot delete this activity because students are enrolled in it. Deactivate it instead.',
            ]);
        }

        $extracurricular->delete();

        return redirect()->back()->with('success', 'Activity deleted successfully.');
    }
}
