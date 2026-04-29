<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GradeEntry;
use App\Models\Student;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GradeEntryController extends Controller
{
    public function index(Request $request)
    {
        $semester = $request->semester ?? 1;
        $academicYear = $request->academic_year ?? '2024-2025';

        $entries = GradeEntry::where('student_id', $request->student_id)
            ->where('semester', $semester)
            ->where('academic_year', $academicYear)
            ->get();
        return response()->json($entries);
    }

    public function update(Request $request, $id)
    {
        $entry = GradeEntry::findOrFail($id);
        
        if ($entry->status === 'locked') {
            return response()->json(['message' => 'Grade is locked'], 403);
        }

        $entry->update($request->all());
        $this->computeGrade($entry);
        
        return response()->json(['success' => true, 'entry' => $entry]);
    }

    public function batchStore(Request $request)
    {
        try {
            $validated = $request->validate([
                'student_id' => 'required',
                'section_id' => 'nullable',
                'semester' => 'required',
                'academic_year' => 'required',
                'grades' => 'required|array'
            ]);

            $sectionId = $validated['section_id'];
            
            if (!$sectionId) {
                $student = Student::find($validated['student_id']);
                if (!$student) {
                    return response()->json(['message' => 'Student not found'], 404);
                }
                $sectionId = $student->section_id;
            }

            if (!$sectionId) {
                return response()->json(['message' => 'Section ID is required but could not be determined'], 422);
            }

            foreach ($request->grades as $gradeData) {
                $data = collect($gradeData)->only([
                    'prelim', 'midterm', 'final', 'status'
                ])->toArray();

                $entry = GradeEntry::updateOrCreate(
                    [
                        'student_id' => $validated['student_id'],
                        'subject_code' => $gradeData['subject_code'] ?? 'PENDING',
                        'semester' => $validated['semester'],
                        'academic_year' => $validated['academic_year']
                    ],
                    array_merge($data, [
                        'section_id' => $sectionId,
                        'encoded_by' => Auth::id()
                    ])
                );
                $this->computeGrade($entry);
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Grade Batch Save Failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'input' => $request->all()
            ]);
            return response()->json([
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function batchSubmit(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required',
            'semester' => 'required',
            'academic_year' => 'required',
            'grades' => 'required|array'
        ]);

        foreach ($request->grades as $gradeData) {
            $data = collect($gradeData)->only([
                'prelim', 'midterm', 'final', 'status'
            ])->toArray();

            $entry = GradeEntry::updateOrCreate(
                [
                    'student_id' => $validated['student_id'],
                    'subject_code' => $gradeData['subject_code'],
                    'semester' => $validated['semester'],
                    'academic_year' => $validated['academic_year']
                ],
                array_merge($data, [
                    'encoded_by' => Auth::id()
                ])
            );

            $this->computeGrade($entry);

            // Transition to submitted if encoded or already draft
            if (in_array($entry->status, ['draft', 'encoded'])) {
                $entry->update(['status' => 'submitted', 'submitted_at' => now()]);
            }
        }

        return response()->json(['success' => true]);
    }

    public function submit($id)
    {
        $entry = GradeEntry::findOrFail($id);
        $entry->update(['status' => 'submitted', 'submitted_at' => now()]);
        return response()->json(['success' => true]);
    }

    public function approve($id)
    {
        $entry = GradeEntry::findOrFail($id);
        $entry->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'approved_at' => now()
        ]);
        return response()->json(['success' => true]);
    }

    public function lock($id)
    {
        $entry = GradeEntry::findOrFail($id);
        $entry->update([
            'status' => 'locked',
            'locked_by' => Auth::id(),
            'locked_at' => now()
        ]);
        return response()->json(['success' => true]);
    }

    private function computeGrade(GradeEntry $entry)
    {
        if ($entry->prelim !== null && $entry->midterm !== null && $entry->final !== null) {
            $computed = ($entry->prelim * 0.30) + ($entry->midterm * 0.30) + ($entry->final * 0.40);
            $entry->computed_grade = round($computed, 2);
            $entry->gwa_equivalent = $this->getGwaEquivalent($entry->computed_grade);
            
            if ($entry->status === 'draft') {
                $entry->status = 'encoded';
            }
            $entry->save();
        }
    }

    private function getGwaEquivalent($score)
    {
        if ($score >= 97) return 1.00;
        if ($score >= 94) return 1.25;
        if ($score >= 91) return 1.50;
        if ($score >= 88) return 1.75;
        if ($score >= 85) return 2.00;
        if ($score >= 82) return 2.25;
        if ($score >= 79) return 2.50;
        if ($score >= 76) return 2.75;
        if ($score >= 75) return 3.00;
        if ($score >= 65) return 4.00;
        return 5.00;
    }
}
