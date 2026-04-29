<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class StudentDocumentController extends Controller
{
    public function store(Request $request, Student $student)
    {
        $request->validate([
            'document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'document_type' => 'required|in:transcript,cor,internship_certificate,other',
            'academic_year' => 'nullable|string',
            'semester' => 'nullable|integer',
        ]);

        $file = $request->file('document');
        $fileName = $file->getClientOriginalName();
        // storeAs path: storage/app/private/student-docs/{id}
        // Actually locally Laravel 11 disk 'private' maps to storage/app/private
        $filePath = $file->storeAs("student-docs/{$student->id}", uniqid() . '_' . $fileName, 'private');

        $student->studentDocuments()->create([
            'document_type' => $request->document_type,
            'file_name' => $fileName,
            'file_path' => $filePath,
            'file_size' => $file->getSize(),
            'uploaded_by' => Auth::id(),
            'academic_year' => $request->academic_year,
            'semester' => $request->semester,
        ]);

        return redirect()->back()->with('success', 'Document uploaded successfully.');
    }

    public function destroy(StudentDocument $document)
    {
        if (Storage::disk('private')->exists($document->file_path)) {
            Storage::disk('private')->delete($document->file_path);
        }

        $document->delete();

        return redirect()->back()->with('success', 'Document deleted successfully.');
    }

    public function download(StudentDocument $document)
    {
        if (!Storage::disk('private')->exists($document->file_path)) {
            abort(404, 'File not found.');
        }

        return Storage::disk('private')->download($document->file_path, $document->file_name);
    }
}
