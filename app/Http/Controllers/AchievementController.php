<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use App\Models\Student;
use Illuminate\Http\Request;
use App\Helpers\SpaRouting as Inertia;
use Illuminate\Support\Facades\Gate;

class AchievementController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Achievement::class);

        $academic = Achievement::with(['student.section'])
            ->where('channel', 'academic')
            ->when($request->filled('academic_category'), fn($q) => $q->where('category', $request->academic_category))
            ->when($request->filled('section_id'), fn($q) => $q->whereHas('student', fn($s) => $s->where('section_id', $request->section_id)))
            ->latest()->get();

        $nonAcademic = Achievement::with(['student.section'])
            ->where('channel', 'non_academic')
            ->when($request->filled('nonacademic_category'), fn($q) => $q->where('category', $request->nonacademic_category))
            ->latest()->get();

        $group = Achievement::where('channel', 'group')
            ->when($request->filled('group_category'), fn($q) => $q->where('category', $request->group_category))
            ->latest()->get();

        $stats = [
            'total'       => Achievement::count(),
            'academic'    => Achievement::where('channel', 'academic')->count(),
            'non_academic'=> Achievement::where('channel', 'non_academic')->count(),
            'group'       => Achievement::where('channel', 'group')->count(),
        ];

        return Inertia::render('Achievements/Index', [
            'academic'    => $academic,
            'nonAcademic' => $nonAcademic,
            'group'       => $group,
            'stats'       => $stats,
            'sections'    => \App\Models\Section::all(['id', 'name', 'grade_level']),
            'students'    => \App\Models\Student::with('section')->get(['id', 'first_name', 'last_name', 'student_id', 'section_id']),
            'filters'     => $request->only(['academic_category', 'nonacademic_category', 'group_category', 'section_id']),
        ]);
    }

    public function store(Request $request)
    {
        $channel = $request->input('channel', 'academic');

        $rules = [
            'channel'       => 'required|in:academic,non_academic,group',
            'title'         => 'required|string|max:255',
            'description'   => 'nullable|string',
            'category'      => 'required|string',
            'tier'          => 'required|in:gold,silver,bronze',
            'date_awarded'  => 'required|date',
            'certificate_file' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:2048',
        ];

        if ($channel === 'group') {
            $rules['team_name'] = 'required|string|max:255';
            $rules['group_members'] = 'nullable|array';
        } else {
            $rules['student_id'] = 'required|exists:students,id';
        }

        $validated = $request->validate($rules);

        if ($request->hasFile('certificate_file')) {
            $validated['certificate_path'] = $request->file('certificate_file')->store('certificates', 'public');
        }

        // Remove the file object before DB entry
        unset($validated['certificate_file']);

        Gate::authorize('create', Achievement::class);
        Achievement::create($validated);

        return redirect()->back()->with('success', 'Honor marker recorded successfully.');
    }

    public function update(Request $request, Achievement $achievement)
    {
        $channel = $request->input('channel', $achievement->channel);

        $rules = [
            'channel'       => 'required|in:academic,non_academic,group',
            'title'         => 'required|string|max:255',
            'description'   => 'nullable|string',
            'category'      => 'required|string',
            'tier'          => 'required|in:gold,silver,bronze',
            'date_awarded'  => 'required|date',
            'certificate_file' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:4096',
        ];

        if ($channel === 'group') {
            $rules['team_name'] = 'required|string|max:255';
            $rules['group_members'] = 'nullable|array';
        } else {
            $rules['student_id'] = 'required|exists:students,id';
        }

        $validated = $request->validate($rules);

        if ($request->hasFile('certificate_file')) {
            // Delete old file if exists
            if ($achievement->certificate_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($achievement->certificate_path);
            }
            $validated['certificate_path'] = $request->file('certificate_file')->store('certificates', 'public');
        }

        // Remove the file object before DB entry
        unset($validated['certificate_file']);

        Gate::authorize('update', $achievement);
        $achievement->update($validated);

        return redirect()->back()->with('success', 'Achievement updated successfully.');
    }

    public function destroy(Achievement $achievement)
    {
        Gate::authorize('delete', $achievement);
        $achievement->delete();
        return redirect()->back()->with('success', 'Marker removed.');
    }
}
