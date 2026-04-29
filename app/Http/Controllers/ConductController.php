<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Helpers\SpaRouting as Inertia;
use Carbon\Carbon;

class ConductController extends Controller
{
    public function timeline(Student $student)
    {
        $student->load(['section']);

        $logs = $student->behaviorLogs()->orderBy('date', 'desc')->get();

        $groupedLogs = $logs->groupBy(function ($log) {
            return Carbon::parse($log->date ?? $log->created_at)->format('Y-m');
        })->map(fn($group) => $group->values())->toArray();

        // Expand nested properties for frontend usage
        $conductScore = $student->conductScore;
        $clearance    = $student->clearance;
        $alerts       = $student->conductAlerts()->latest()->get()->map(fn($a) => [
            'id'                => $a->id,
            'type'              => $a->alert_type,
            'severity'          => $a->severity,
            'message'           => $a->message,
            'resolution_status' => $a->is_resolved ? 'resolved' : 'unresolved',
            'created_at'        => $a->created_at,
        ]);

        $available_categories = [
            'academic_misconduct' => 'Academic Misconduct',
            'behavioral_misconduct' => 'Behavioral Misconduct',
            'attendance' => 'Attendance Issues',
            'dress_code' => 'Dress Code',
            'excellence' => 'Excellence',
            'leadership' => 'Leadership',
            'community' => 'Community Service',
            'other' => 'Other'
        ];

        // compute category summary manually from the N+1 loaded logs just for UI.
        $category_summary = $logs->groupBy('category')->map(function($catLogs, $cat) use ($available_categories) {
            return [
                'category' => $cat,
                'label' => $available_categories[$cat] ?? 'Other',
                'count' => $catLogs->count(),
                'color' => (new \App\Models\BehaviorLog(['category' => $cat]))->category_color
            ];
        })->values()->toArray();

        return Inertia::render('Conduct/Timeline', [
            'student' => $student,
            'groupedLogs' => $groupedLogs,
            'conductScore' => $conductScore,
            'clearance' => $clearance,
            'alerts' => $alerts,
            'available_categories' => $available_categories,
            'category_summary' => $category_summary,
        ]);
    }
}
