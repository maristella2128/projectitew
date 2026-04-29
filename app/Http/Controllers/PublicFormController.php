<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Helpers\SpaRouting as Inertia;
use Illuminate\Http\JsonResponse; use Illuminate\Http\Response as HttpResponse; use Illuminate\View\View;

class PublicFormController extends Controller
{
    // -------------------------------------------------------------------------
    // show()  —  GET /form
    // -------------------------------------------------------------------------

    /**
     * Render the public-facing student self-registration form.
     */
    public function show()
    {
        return Inertia::render('Form/Index');
    }

    // -------------------------------------------------------------------------
    // validateCode()  —  POST /form/validate
    // -------------------------------------------------------------------------

    /**
     * Accept a REG-XXXX code and return the candidate's pre-filled data +
     * matching sections if the code is valid and still usable.
     */
    public function validateCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $code = strtoupper(trim($request->code));

        $candidate = Candidate::where('registration_code', $code)
            ->where('registration_code_used', false)
            ->where('registration_code_expires_at', '>', now())
            ->whereNotIn('status', ['enrolled'])
            ->first();

        if (! $candidate) {
            return response()->json([
                'valid'   => false,
                'message' => 'Invalid, already used, or expired code.',
            ], 422);
        }

        // Sections that match the candidate's year level
        $sections = Section::where('grade_level', $candidate->year_level_applied)
            ->get(['id', 'name']);

        return response()->json([
            'valid'   => true,
            'student' => [
                'first_name'         => $candidate->first_name,
                'last_name'          => $candidate->last_name,
                'email'              => $candidate->email,
                'year_level_applied' => $candidate->year_level_applied,
            ],
            'sections' => $sections,
        ]);
    }

    // -------------------------------------------------------------------------
    // submit()  —  POST /form/submit
    // -------------------------------------------------------------------------

    /**
     * Persist the student's self-submitted profile into candidates.form_data,
     * advance the candidate status to 'form_submitted', and mark the code used.
     *
     * NOTE: No User or Student record is created here.
     *       The registrar creates those later via CandidateController@enroll()
     *       once they decide to accept the candidate.
     */
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'code'                 => 'required|string',
            'first_name'           => 'required|string|max:255',
            'last_name'            => 'required|string|max:255',
            'middle_name'          => 'nullable|string|max:255',
            'lrn'                  => 'nullable|string|max:20',
            'birthdate'            => 'required|date',
            'gender'               => 'required|in:male,female,other',
            'address'              => 'required|string|max:1000',
            'guardian_name'        => 'required|string|max:255',
            'guardian_contact'     => 'required|string|max:30',
            'guardian_relationship'=> 'required|string|max:255',
            'section_id'           => 'nullable|exists:sections,id',
            'skills'               => 'nullable|array',
            'skills.*'             => 'string|max:255',
            'activities'           => 'nullable|array',
            'activities.*'         => 'string|max:255',
            'photo'                => 'nullable|image|max:3072',   // 3 MB
        ]);

        $code = strtoupper(trim($validated['code']));

        // Re-check validity (race-condition guard)
        $candidate = Candidate::where('registration_code', $code)
            ->where('registration_code_used', false)
            ->where('registration_code_expires_at', '>', now())
            ->whereNotIn('status', ['enrolled'])
            ->first();

        if (! $candidate) {
            return back()->withErrors([
                'code' => 'Invalid, already used, or expired registration code.',
            ]);
        }

        // Handle optional photo upload
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('candidate-photos', 'public');
        }

        // Build the form_data payload — everything the registrar needs to
        // pre-fill the Student record when they click "Enroll".
        $formData = [
            'first_name'            => $validated['first_name'],
            'last_name'             => $validated['last_name'],
            'middle_name'           => $validated['middle_name']   ?? null,
            'lrn'                   => $validated['lrn']           ?? null,
            'birthdate'             => $validated['birthdate'],
            'gender'                => $validated['gender'],
            'address'               => $validated['address'],
            'guardian_name'         => $validated['guardian_name'],
            'guardian_contact'      => $validated['guardian_contact'],
            'guardian_relationship' => $validated['guardian_relationship'],
            'section_id'            => $validated['section_id']    ?? null,
            'skills'                => $validated['skills']        ?? [],
            'activities'            => $validated['activities']    ?? [],
            'photo'                 => $photoPath,
            'submitted_at'          => now()->toISOString(),
        ];

        $candidate->update([
            'status'                 => 'form_submitted',
            'form_submitted_at'      => now(),
            'registration_code_used' => true,
            'form_data'              => $formData,
        ]);

        return redirect()->route('public.form.show')
            ->with('success', 'Your profile has been submitted successfully. The registrar will review your application shortly.');
    }
}
