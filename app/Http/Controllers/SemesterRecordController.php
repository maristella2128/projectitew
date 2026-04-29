<?php

namespace App\Http\Controllers;

use App\Models\SemesterRecord;
use App\Models\SemesterSubject;
use App\Models\Student;
use Illuminate\Http\Request;

class SemesterRecordController extends Controller
{
    // --- SEMESTER RECORDS ---

    public function storeRecord(Request $request, Student $student)
    {
        $validated = $request->validate([
            'academic_year' => 'required|string',
            'semester' => 'required|integer|in:1,2,3',
            'computed_gwa' => 'nullable|numeric|min:1|max:5',
        ]);

        $student->semesterRecords()->create($validated);

        return redirect()->back()->with('success', 'Semester record created successfully.');
    }

    public function updateRecord(Request $request, SemesterRecord $record)
    {
        $validated = $request->validate([
            'academic_year' => 'required|string',
            'semester' => 'required|integer|in:1,2,3',
            'computed_gwa' => 'nullable|numeric|min:1|max:5',
        ]);

        $record->update($validated);

        return redirect()->back()->with('success', 'Semester record updated successfully.');
    }

    public function destroyRecord(SemesterRecord $record)
    {
        $record->delete();

        return redirect()->back()->with('success', 'Semester record deleted.');
    }

    // --- SEMESTER SUBJECTS ---

    public function storeSubject(Request $request, SemesterRecord $record)
    {
        $validated = $request->validate([
            'subject_code' => 'required|string',
            'subject_name' => 'required|string',
            'units' => 'required|integer|min:1',
            'grade' => 'nullable|numeric',
            'status' => 'required|string|in:passed,failed,ongoing,dropped',
            'is_retake' => 'boolean',
        ]);

        $record->subjects()->create($validated);

        return redirect()->back()->with('success', 'Subject added successfully.');
    }

    public function updateSubject(Request $request, SemesterSubject $subject)
    {
        $validated = $request->validate([
            'subject_code' => 'required|string',
            'subject_name' => 'required|string',
            'units' => 'required|integer|min:1',
            'grade' => 'nullable|numeric',
            'status' => 'required|string|in:passed,failed,ongoing,dropped',
            'is_retake' => 'boolean',
        ]);

        $subject->update($validated);

        return redirect()->back()->with('success', 'Subject updated successfully.');
    }

    public function destroySubject(SemesterSubject $subject)
    {
        $subject->delete();

        return redirect()->back()->with('success', 'Subject removed.');
    }
}
