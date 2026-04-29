<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentProfileController extends Controller
{
    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'course' => 'nullable|string|max:100',
            'major' => 'nullable|string|max:100',
            'year_level' => 'nullable|integer|min:1|max:6',
            'academic_status' => 'nullable|string|in:regular,irregular,probation,graduated',
        ]);

        $student->update($validated);

        return redirect()->back()->with('success', 'Student academic profile updated successfully.');
    }

    /**
     * Advanced student filter returning JSON array of matched student profiles.
     */
    public function advancedFilter(Request $request)
    {
        $query = Student::with(['ranking.topCategory', 'alerts', 'section', 'user']);

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
                    $q->where('category_id', $categoryId);
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
                'alerts_count' => $student->alerts ? $student->alerts->count() : 0,
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
}
