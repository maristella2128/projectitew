<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FolderController extends Controller
{
    // index — return root folders with nested children
    public function index()
    {
        return response()->json(
            Folder::with(['children.documents', 'documents'])
                  ->withCount('documents')
                  ->whereNull('parent_id')
                  ->whereNull('section_id')
                  ->latest()
                  ->get()
        );
    }

    // store — support parent_id for subfolders
    public function store(Request $request)
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'parent_id'  => 'nullable|exists:folders,id',
            'section_id' => 'nullable|exists:sections,id',
        ]);

        $words = explode(' ', $request->name);
        $code  = strtoupper(implode('', array_map(fn($w) => substr($w, 0, 1), $words)));

        $folder = Folder::create([
            'name'       => $request->name,
            'code'       => $code,
            'parent_id'  => $request->parent_id ?? null,
            'section_id' => $request->section_id ?? null,
            'created_by' => Auth::id(),
        ]);

        return response()->json($folder, 201);
    }

    public function sectionFolders($sectionId)
    {
        return response()->json(
            Folder::with(['children', 'documents'])
                  ->withCount('documents')
                  ->where('section_id', $sectionId)
                  ->whereNull('parent_id')
                  ->latest()
                  ->get()
        );
    }

    // FolderController@show:
    public function show(Folder $folder)
    {
        return response()->json(
            $folder->load(['children.documents', 'documents', 'parent'])
        );
    }

    // store documents inside a folder
    public function uploadToFolder(Request $request, $folderId)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'file'  => 'required|file|max:51200', // 50MB
            ]);

            if (!$request->hasFile('file')) {
                return response()->json(['message' => 'No file received'], 422);
            }

            $path = $request->file('file')->store('documents', 'public');

            /** @var \App\Models\User $user */
            $user = Auth::user();

            $doc = Document::create([
                'title'            => $request->title,
                'file_path'        => $path,
                'folder_id'        => $folderId,
                'uploaded_by'      => $user->id,
                'uploaded_by_role' => $user->role ?? 'dean',
                'type'             => 'Other',
                'visibility'       => 'everyone',
            ]);

            return response()->json($doc, 201);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function destroy(Folder $folder)
    {
        $folder->delete();
        return response()->json(['message' => 'Folder deleted successfully']);
    }
}
