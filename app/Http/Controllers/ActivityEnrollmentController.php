<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\ActivityEnrollment;
use Illuminate\Http\Request;
use App\Helpers\SpaRouting as Inertia;

class ActivityEnrollmentController extends Controller
{
    public function store(Activity $activity)
    {
        $student = auth()->user()->student;

        // Guard: activity must be active
        if ($activity->status !== 'active') {
            return redirect()->back()->with('error', 'This activity is no longer accepting enrollments.');
        }

        // Guard: slots full
        if ($activity->isFull()) {
            return redirect()->back()->with('error', 'This activity is already full.');
        }

        // Guard: already enrolled
        if ($activity->isEnrolled($student->id)) {
            return redirect()->back()->with('error', 'You are already enrolled in this activity.');
        }

        ActivityEnrollment::create([
            'activity_id' => $activity->id,
            'student_id'  => $student->id,
            'status'      => 'enrolled',
        ]);

        session()->flash('success', "You have joined {$activity->name}!");
        return Inertia::location(route('activities.index'));
    }

    public function withdraw(Activity $activity)
    {
        $student = auth()->user()->student;

        $enrollment = ActivityEnrollment::where('activity_id', $activity->id)
            ->where('student_id', $student->id)
            ->firstOrFail();

        // Cannot withdraw after attendance is marked
        if (in_array($enrollment->status, ['attended', 'completed'])) {
            return redirect()->back()->with('error', 'Cannot withdraw after attendance has been recorded.');
        }

        $enrollment->update(['status' => 'withdrew']);

        session()->flash('success', 'You have withdrawn from this activity.');
        return Inertia::location(route('activities.index'));
    }

    public function bulkAdd(Request $request, Activity $activity)
    {
        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:students,id',
        ]);

        foreach ($request->student_ids as $studentId) {
            ActivityEnrollment::firstOrCreate([
                'activity_id' => $activity->id,
                'student_id' => $studentId,
            ], [
                'status' => 'enrolled',
                'joined_at' => now(),
            ]);
        }

        session()->flash('success', count($request->student_ids) . ' students added successfully.');
        return Inertia::location(route('activities.show', $activity->id));
    }

    public function destroy(Activity $activity, $enrollmentId)
    {
        $enrollment = ActivityEnrollment::where('activity_id', $activity->id)
            ->findOrFail($enrollmentId);

        $enrollment->delete();

        session()->flash('success', 'Student removed from activity.');
        return Inertia::location(route('activities.show', $activity->id));
    }
}
