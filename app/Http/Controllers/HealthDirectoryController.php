<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\Section;
use App\Models\Student;
use App\Models\StudentDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Helpers\SpaRouting as Inertia;

class HealthDirectoryController extends Controller
{
    public function index()
    {
        $programs = Program::withCount('sections')->get();
        return Inertia::render('Health/Directory', [
            'programs' => $programs
        ]);
    }

    public function getSections(Program $program)
    {
        $sections = $program->sections()->withCount('students')->get();
        return response()->json($sections);
    }

    public function getStudents(Section $section)
    {
        $students = $section->students()->with('user')
            ->withCount(['studentDocuments as has_medical_record' => function ($query) {
                $query->where('document_type', 'medical_record');
            }])
            ->get();
        return response()->json($students);
    }

    public function getStudentProfile(Student $student)
    {
        $student->load(['user', 'section.program', 'healthRecords.creator']);
        $documents = StudentDocument::where('student_id', $student->id)
            ->where('document_type', 'medical_record')
            ->latest()
            ->get();

        return response()->json([
            'student' => $student,
            'documents' => $documents
        ]);
    }

    public function uploadDocument(Request $request, Student $student)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:51200', // 50MB max
            'file_name' => 'nullable|string'
        ]);

        $file = $request->file('file');
        $path = $file->store('student-health-docs', 'public');

        $document = StudentDocument::create([
            'student_id' => $student->id,
            'document_type' => 'medical_record',
            'file_name' => $request->file_name ?? $file->getClientOriginalName(),
            'file_path' => $path,
            'file_size' => $file->getSize(),
            'uploaded_by' => auth()->id(),
            'academic_year' => $student->school_year ?? '2024-2025',
            'semester' => is_numeric($student->semester) ? (int)$student->semester : 1,
        ]);

        return response()->json($document);
    }

    public function deleteDocument(StudentDocument $document)
    {
        if ($document->document_type !== 'medical_record') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return response()->json(['success' => true]);
    }
}
