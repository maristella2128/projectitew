<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Helpers\SpaRouting as Inertia;
use Illuminate\Http\JsonResponse; use Illuminate\Http\Response as HttpResponse; use Illuminate\View\View;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $docs = Document::visibleTo(Auth::user())
            ->with(['student.section.program', 'uploader'])
            ->latest()
            ->get()
            ->map(fn($d) => [
                'id'               => $d->id,
                'title'            => $d->title,
                'file_path'        => $d->file_path,
                'type'             => $d->type,
                'visibility'       => $d->visibility,
                'section_id'       => $d->section_id,
                'folder_id'        => $d->folder_id,
                'student_id'       => $d->student_id,
                'program_id'       => $d->program_id,
                'uploaded_by'      => $d->uploaded_by,
                'uploaded_by_role' => $d->uploaded_by_role,
                'created_at'       => $d->created_at,
                'student'          => $d->student,
                'uploader'         => $d->uploader,
            ]);

        return Inertia::render('Documents/Index', [
            'documents' => ['data' => $docs],
            'students' => \App\Models\Student::all(['id', 'first_name', 'last_name']),
            'programs' => \App\Models\Program::with(['sections' => function($q) {
                $q->withCount('students')->with('adviser');
            }])->withCount('sections')->get()->map(function($p) {
                $p->students_count = $p->sections->sum('students_count');
                return $p;
            }),
            'folders' => \App\Models\Folder::withCount('documents')
                         ->whereNull('parent_id')
                         ->whereNull('section_id')
                         ->latest()
                         ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', Document::class);
        $validated = $request->validate([
            'program_id' => 'required_without:folder_id|nullable|exists:programs,id',
            'folder_id'  => 'required_without:program_id|nullable|exists:folders,id',
            'title'      => 'required|string|max:255',
            'file'       => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $path = $request->file('file')->store('student-docs', 'public');

        Document::create([
            'program_id' => $validated['program_id'] ?? null,
            'folder_id'  => $validated['folder_id'] ?? null,
            'title' => $validated['title'],
            'file_path' => $path,
            'uploaded_by' => $user->id,
            'uploaded_by_role' => $user->role, 
        ]);

        return redirect()->back()->with('success', 'Document uploaded successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $document = Document::findOrFail($id);

            /** @var \App\Models\User $user */
            $user = Auth::user();
            $userRole = $user->role ?? ($user->roles->first()?->name);

            if ($userRole !== 'dean' && $document->uploaded_by !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Delete the physical file from storage
            if ($document->file_path && \Storage::disk('public')->exists($document->file_path)) {
                \Storage::disk('public')->delete($document->file_path);
            }

            $document->delete();

            if (request()->expectsJson() || request()->ajax()) {
                return response()->json(['message' => 'Deleted successfully'], 200);
            }

            return back()->with('success', 'Document deleted.');

        } catch (\Illuminate\Database\QueryException $e) {
            \Log::error('Document delete error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Cannot delete: this document is referenced by another record.',
                'error'   => $e->getMessage(),
            ], 409);
        }
    }
    public function storeForSection(Request $request)
    {
        \Log::info('storeForSection called', $request->except('file'));

        $request->validate([
            'title'      => 'required|string|max:255',
            'file'       => 'required|file|max:51200',
            'section_id' => 'required|exists:sections,id',
        ]);

        $path = $request->file('file')->store('documents', 'public');

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $doc = Document::create([
            'title'            => $request->title,
            'file_path'        => $path,
            'section_id'       => (int) $request->section_id,
            'folder_id'        => null,
            'student_id'       => null,
            'program_id'       => null,
            'uploaded_by'      => $user->id,
            'uploaded_by_role' => $user->role ?? 'dean',
            'type'             => 'Other',
            'visibility'       => 'everyone',
        ]);

        \Log::info('Document created', $doc->toArray());

        return response()->json($doc, 201);
    }
}
