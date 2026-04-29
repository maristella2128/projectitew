<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Http\Request;
use App\Helpers\SpaRouting as Inertia;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        $query = Activity::with(['advisor', 'enrollments'])
            ->withCount('enrollments');

        // Students only see active and completed activities
        if ($user->role === 'students') {
            $query->whereIn('status', ['active', 'completed']);
        }

        // Filter by category
        if ($request->filled('category') && $request->category !== 'All Categories') {
            $query->where('category', $request->category);
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        $activities = $query->latest()->paginate(12);

        // For student — attach enrollment status to each activity
        if ($user->role === 'students') {
            $student = $user->student;
            $activities->getCollection()->transform(function ($activity) use ($student) {
                $activity->is_enrolled = $activity->isEnrolled($student->id);
                $activity->is_full     = $activity->isFull();
                return $activity;
            });
        }

        $professors = User::where('role', 'teacher')->orWhereHas('roles', fn($q) => $q->where('name', 'professor'))->get(['id', 'name']);

        return Inertia::render('Activities/Index', [
            'activities' => $activities,
            'professors' => $professors,
            'userRole'   => $user->role,
            'filters'    => $request->only(['category', 'type', 'search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'type'        => 'required|in:Organization,Competition,Sports,Academic,Event',
            'category'    => 'required|in:Tech,Leadership,Academic,Sports,Arts,Community',
            'description' => 'nullable|string',
            'points'      => 'required|integer|min:1|max:100',
            'max_slots'   => 'nullable|integer|min:1',
            'status'      => 'required|in:draft,active,inactive',
            'is_recurring'=> 'boolean',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
            'advisor_id'  => 'nullable|exists:users,id',
        ]);

        $data = $request->all();
        $data['max_slots'] = $data['max_slots'] === '' ? null : $data['max_slots'];
        $data['advisor_id'] = $data['advisor_id'] === '' ? null : $data['advisor_id'];

        Activity::create([
            ...$data,
            'created_by' => auth()->id(),
        ]);

        session()->flash('success', 'Activity registered successfully.');
        return Inertia::location(route('activities.index'));
    }

    public function show(Activity $activity)
    {
        $activity->load(['advisor', 'enrollments.student.user']);

        // Fetch all students NOT yet enrolled in this activity
        $enrolledStudentIds = $activity->enrollments->pluck('student_id');
        
        $availableStudents = \App\Models\Student::with('user')
            ->whereNotIn('id', $enrolledStudentIds)
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->user->name,
                'email' => $s->user->email,
                'student_id' => $s->student_id,
            ]);

        return Inertia::render('Activities/Show', [
            'activity' => $activity,
            'availableStudents' => $availableStudents,
            'userRole' => auth()->user()->role,
        ]);
    }

    public function update(Request $request, Activity $activity)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'type'        => 'required|in:Organization,Competition,Sports,Academic,Event',
            'category'    => 'required|in:Tech,Leadership,Academic,Sports,Arts,Community',
            'description' => 'nullable|string',
            'points'      => 'required|integer|min:1|max:100',
            'max_slots'   => 'nullable|integer|min:1',
            'status'      => 'required|in:draft,active,inactive,completed,archived',
            'is_recurring'=> 'boolean',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
            'advisor_id'  => 'nullable|exists:users,id',
        ]);

        $validTransitions = [
            'draft'     => ['active', 'inactive'],
            'active'    => ['inactive', 'completed'],
            'inactive'  => ['active', 'archived'],
            'completed' => ['archived'],
            'archived'  => [],
        ];

        $currentStatus = $activity->status;
        $newStatus     = $request->status;

        if ($newStatus !== $currentStatus && 
            isset($validTransitions[$currentStatus]) &&
            !in_array($newStatus, $validTransitions[$currentStatus])) {
            return redirect()->back()->with('error', "Cannot change status from {$currentStatus} to {$newStatus}.");
        }

        $data = $request->all();
        $data['max_slots'] = $data['max_slots'] === '' ? null : $data['max_slots'];
        $data['advisor_id'] = $data['advisor_id'] === '' ? null : $data['advisor_id'];

        $activity->update($data);

        session()->flash('success', 'Activity updated.');
        return Inertia::location(route('activities.index'));
    }

    public function destroy(Activity $activity)
    {
        // Prevent deletion if students are enrolled
        if ($activity->enrollments()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete an activity with enrolled students.');
        }

        $activity->delete();
        session()->flash('success', 'Activity removed.');
        return Inertia::location(route('activities.index'));
    }
}
