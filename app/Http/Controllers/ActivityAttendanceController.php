<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\ActivityEnrollment;
use App\Models\Student;
use App\Models\StudentPoints;
use Illuminate\Http\Request;

class ActivityAttendanceController extends Controller
{
    public function markAttended(Request $request, Activity $activity)
    {
        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:students,id',
        ]);

        foreach ($request->student_ids as $studentId) {
            $enrollment = ActivityEnrollment::where('activity_id', $activity->id)
                ->where('student_id', $studentId)
                ->where('status', 'enrolled')
                ->first();

            if (!$enrollment) continue;

            // Mark as attended
            $enrollment->update([
                'status'       => 'attended',
                'completed_at' => now(),
            ]);

            // Award points — only if not already awarded
            StudentPoints::firstOrCreate(
                ['student_id' => $studentId, 'activity_id' => $activity->id],
                [
                    'points_awarded' => $activity->points,
                    'reason'         => "Attended: {$activity->name}",
                    'awarded_at'     => now(),
                ]
            );

            // Update student's total engagement points
            Student::where('id', $studentId)->increment('total_engagement_points', $activity->points);
        }

        // If all enrolled students are processed, mark activity completed
        $allAttended = $activity->enrollments()
            ->where('status', 'enrolled')
            ->doesntExist();

        if ($allAttended) {
            $activity->update(['status' => 'completed']);
        }

        return redirect()->back()->with('success', 'Attendance recorded and points awarded.');
    }
}
