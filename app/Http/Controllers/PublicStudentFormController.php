<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Helpers\SpaRouting as Inertia;
use Illuminate\Http\JsonResponse; use Illuminate\Http\Response as HttpResponse; use Illuminate\View\View;

class PublicStudentFormController extends Controller
{
    /**
     * Display the public student form.
     */
    public function index()
    {
        return Inertia::render('Form/Index');
    }

    /**
     * Validate the registration code.
     */
    public function validateCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:8',
        ]);

        $student = Student::where('registration_code', strtoupper($request->code))
            ->where('registration_code_used', false)
            ->where(function ($query) {
                $query->whereNull('registration_code_expires_at')
                    ->orWhere('registration_code_expires_at', '>', now());
            })
            ->first();

        if (!$student) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid, expired, or already used registration code.',
            ], 422);
        }

        return response()->json([
            'valid' => true,
            'student' => [
                'first_name' => $student->first_name,
                'last_name' => $student->last_name,
                'email' => $student->user->email,
                'year_level' => $student->year_level,
                'school_year' => $student->school_year,
            ],
            'sections' => \App\Models\Section::where('grade_level', $student->year_level)->get(),
        ]);
    }

    /**
     * Submit the student data.
     */
    public function submit(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:8',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'lrn' => 'nullable|string|size:12',
            'section_id' => 'required|exists:sections,id',
            'birthdate' => 'required|date',
            'gender' => 'required|in:male,female,other',
            'address' => 'required|string',
            'guardian_name' => 'required|string|max:255',
            'guardian_contact' => 'required|string|max:20',
            'guardian_relationship' => 'required|string|max:255',
            'photo' => 'nullable|image|max:2048',
            'skills' => 'nullable|array',
            'activities' => 'nullable|array',
        ]);

        $student = Student::where('registration_code', strtoupper($request->code))
            ->where('registration_code_used', false)
            ->where(function ($query) {
                $query->whereNull('registration_code_expires_at')
                    ->orWhere('registration_code_expires_at', '>', now());
            })
            ->first();

        if (!$student) {
            return back()->withErrors(['code' => 'Invalid or expired registration code.']);
        }

        try {
            DB::transaction(function () use ($request, $student) {
                // Update Student Photo
                $photoPath = $student->photo;
                if ($request->hasFile('photo')) {
                    if ($photoPath) {
                        Storage::disk('public')->delete($photoPath);
                    }
                    $photoPath = $request->file('photo')->store('photos', 'public');
                }

                // Update Student record
                $student->update([
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'middle_name' => $request->middle_name,
                    'lrn' => $request->lrn,
                    'section_id' => $request->section_id,
                    'birthdate' => $request->birthdate,
                    'gender' => $request->gender,
                    'address' => $request->address,
                    'guardian_name' => $request->guardian_name,
                    'guardian_contact' => $request->guardian_contact,
                    'guardian_relationship' => $request->guardian_relationship,
                    'photo' => $photoPath,
                    'skills' => $request->skills,
                    'activities' => $request->activities,
                    'registration_code_used' => true,
                ]);

                // Update User record name if it changed
                $student->user->update([
                    'name' => "{$request->first_name} {$request->last_name}",
                ]);
            });

            return Inertia::render('Form/Index', [
                'success' => true,
                'message' => 'Your profile has been successfully updated. You can now login with your email.',
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['submission' => 'Failed to save student data: ' . $e->getMessage()]);
        }
    }
}
