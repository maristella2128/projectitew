<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Program;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Helpers\SpaRouting as Inertia;
use Illuminate\Http\JsonResponse; use Illuminate\Http\Response as HttpResponse; use Illuminate\View\View;

class CandidateController extends Controller
{
    // -------------------------------------------------------------------------
    // 1. INDEX
    // -------------------------------------------------------------------------

    /**
     * Return paginated candidates and per-status counts to Inertia.
     */
    public function index()
    {
        $candidates = Candidate::latest()->paginate(10);
        $programs = Program::all(['id', 'code', 'name']);
        $credentials = session()->pull('new_student_credentials'); // pull = get and delete

        // Counts for stat cards
        $counts = Candidate::query()
            ->selectRaw("
                COUNT(*) AS total,
                SUM(status = 'pending')        AS pending,
                SUM(status = 'form_submitted') AS form_submitted,
                SUM(status = 'accepted')       AS accepted,
                SUM(status = 'rejected')       AS rejected,
                SUM(status = 'enrolled')       AS enrolled
            ")
            ->first();

        return Inertia::render('Candidates/Index', [
            'candidates'     => $candidates,
            'counts'         => $counts,
            'programs'       => $programs,
            'newCredentials' => $credentials, // ← pass to frontend
        ]);
    }

    // -------------------------------------------------------------------------
    // 2. STORE
    // -------------------------------------------------------------------------

    /**
     * Validate, generate a unique REG-XXXX code, and persist a new candidate.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'         => 'required|string|max:255',
            'last_name'          => 'required|string|max:255',
            'email'              => 'nullable|email|max:255',
            'phone'              => 'nullable|string|max:30',
            'year_level_applied' => 'required|string|max:100',
            'strand'             => 'nullable|string|max:100',
        ]);

        // Generate a unique REG-XXXX code
        do {
            $code = 'REG-' . rand(1000, 9999);
        } while (Candidate::where('registration_code', $code)->exists());

        $candidate = Candidate::create([
            ...$validated,
            'registration_code'            => $code,
            'registration_code_used'       => false,
            'registration_code_expires_at' => now()->addDays(30),
            'status'                       => 'pending',
        ]);

        return back()->with([
            'success' => 'Candidate added.',
            'code'    => $candidate->registration_code,
        ]);
    }

    // -------------------------------------------------------------------------
    // 3. SHOW
    // -------------------------------------------------------------------------

    /**
     * Return a single candidate and their linked student profile (if any).
     */
    public function show(int $id)
    {
        $candidate = Candidate::findOrFail($id);

        // Attempt to find a Student that was created from this candidate's
        // registration code (the code is stored on the Student row after enroll)
        $student = Student::with(['user', 'section'])
            ->where('registration_code', $candidate->registration_code)
            ->first();

        return Inertia::render('Candidates/Show', [
            'candidate' => $candidate,
            'student'   => $student,
        ]);
    }

    // -------------------------------------------------------------------------
    // 4. UPDATE STATUS
    // -------------------------------------------------------------------------

    /**
     * Accept or reject a candidate, optionally adding remarks.
     */
    public function updateStatus(Request $request, Candidate $candidate)
    {
        \Log::info('updateStatus called', [
            'candidate_id' => $candidate->id,
            'current_status' => $candidate->status,
            'new_status' => $request->status,
            'request_all' => $request->all(),
        ]);

        try {
            $validated = $request->validate([
                'status'  => 'required|in:pending,form_submitted,accepted,rejected,enrolled',
                'remarks' => 'nullable|string|max:1000',
            ]);

            \Log::info('Validation passed', $validated);

            $candidate->update($validated);

            \Log::info('Update result', ['new_status' => $candidate->fresh()->status]);

            return back()->with('success', 'Candidate status updated successfully.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Candidate status validation error: ', $e->errors());
            return back()->withErrors($e->errors());

        } catch (\Exception $e) {
            \Log::error('Candidate status update error: ' . $e->getMessage() . ' | ' . $e->getTraceAsString());

            return back()->withErrors([
                'status' => 'Failed to update status: ' . $e->getMessage()
            ])->withInput();
        }
    }

    // -------------------------------------------------------------------------
    // 5. ENROLL
    // -------------------------------------------------------------------------

    /**
     * Convert an accepted candidate into a User + Student record.
     */
    public function enroll(Candidate $candidate)
    {
        \Log::info('Enroll called for candidate', [
            'id'     => $candidate->id,
            'status' => $candidate->status,
            'email'  => $candidate->email,
        ]);

        // ── Guard: must be accepted ──
        if ($candidate->status !== 'accepted') {
            \Log::warning('Enroll blocked: candidate not accepted', ['status' => $candidate->status]);
            return response()->json([
                'message' => "Candidate must be in 'accepted' status before enrollment. Current status: {$candidate->status}"
            ], 422);
        }

        // ── Guard: already enrolled ──
        if ($candidate->status === 'enrolled') {
            return response()->json([
                'message' => 'This candidate has already been enrolled.'
            ], 422);
        }

        // ── Guard: email required ──
        if (empty($candidate->email)) {
            return response()->json([
                'message' => 'Candidate has no email address. Please add an email before enrolling.'
            ], 422);
        }

        // ── Guard: user with this email already exists ──
        $existingUser = \App\Models\User::where('email', $candidate->email)->first();
        if ($existingUser) {
            \Log::warning('Enroll blocked: email already taken', ['email' => $candidate->email]);
            return response()->json([
                'message' => "A user account with email '{$candidate->email}' already exists. The student may already be enrolled."
            ], 422);
        }

        try {
            DB::transaction(function () use ($candidate) {

                // ── Generate student number ──
                $year        = date('Y');
                $lastStudent = \App\Models\Student::whereYear('created_at', $year)
                                   ->orderBy('id', 'desc')->first();
                $nextNumber    = $lastStudent
                    ? (intval(substr($lastStudent->student_id ?? '00000', -5)) + 1)
                    : 1;
                $studentNumber = $year . '-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);

                // ── Generate random password ──
                $randomPassword = $this->generatePassword();

                // ── Create User ──
                $user = \App\Models\User::create([
                    'name'              => trim($candidate->first_name . ' ' . $candidate->last_name),
                    'email'             => $candidate->email,
                    'password'          => \Hash::make($randomPassword),
                    'email_verified_at' => now(),
                    'role'              => 'students',
                    'is_active'         => true,
                ]);

                if (method_exists($user, 'assignRole')) {
                    try { $user->assignRole('students'); } catch (\Exception $e) {
                        \Log::warning('Could not assign role: ' . $e->getMessage());
                    }
                }

                // ── Build student data — only include columns that exist ──
                $studentData = [
                    'user_id'    => $user->id,
                    'first_name' => $candidate->first_name,
                    'last_name'  => $candidate->last_name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                // ── Map form data if available ──
                $fd = $candidate->form_data ?? [];

                // Conditionally add columns only if they exist in the table:
                $studentColumns = \Illuminate\Support\Facades\Schema::getColumnListing('students');

                if (in_array('email',             $studentColumns)) $studentData['email']             = $candidate->email;
                if (in_array('student_id',        $studentColumns)) $studentData['student_id']        = $studentNumber;
                
                // Map year level string to integer
                $yearLevelMap = ['1st Year' => 1, '2nd Year' => 2, '3rd Year' => 3, '4th Year' => 4];
                $ylStr = $candidate->year_level_applied ?? $fd['year_level'] ?? '';
                $ylInt = $yearLevelMap[$ylStr] ?? (intval(preg_replace('/[^0-9]/', '', $ylStr)) ?: null);

                if (in_array('first_name',        $studentColumns)) $studentData['first_name']        = $fd['first_name'] ?? $candidate->first_name;
                if (in_array('last_name',         $studentColumns)) $studentData['last_name']         = $fd['last_name']  ?? $candidate->last_name;
                if (in_array('middle_name',        $studentColumns)) $studentData['middle_name']        = $fd['middle_name'] ?? null;
                if (in_array('birthdate',          $studentColumns)) $studentData['birthdate']          = $fd['birthdate']   ?? null;
                if (in_array('gender',             $studentColumns)) $studentData['gender']             = $fd['gender']      ?? null;
                if (in_array('address',            $studentColumns)) $studentData['address']            = $fd['address']     ?? null;
                if (in_array('guardian_name',      $studentColumns)) $studentData['guardian_name']      = $fd['guardian_name'] ?? null;
                if (in_array('guardian_contact',   $studentColumns)) $studentData['guardian_contact']   = $fd['guardian_contact'] ?? null;
                if (in_array('guardian_relationship', $studentColumns)) $studentData['guardian_relationship'] = $fd['guardian_relationship'] ?? null;
                if (in_array('course',             $studentColumns)) $studentData['course']             = $candidate->strand ?? $fd['strand'] ?? null;
                if (in_array('year_level',         $studentColumns)) $studentData['year_level']         = $ylInt;
                if (in_array('section_id',         $studentColumns)) $studentData['section_id']         = $fd['section_id'] ?? null;
                if (in_array('enrollment_status',  $studentColumns)) $studentData['enrollment_status']  = 'enrolled';
                if (in_array('status',             $studentColumns)) $studentData['status']             = 'enrolled';
                if (in_array('registration_code',  $studentColumns)) $studentData['registration_code']  = $candidate->registration_code ?? null;
                if (in_array('candidate_id',       $studentColumns)) $studentData['candidate_id']       = $candidate->id;
                if (in_array('program_id',         $studentColumns)) $studentData['program_id']         = $candidate->program_id ?? null;
                if (in_array('school_year',        $studentColumns)) $studentData['school_year']        = date('Y') . '-' . (date('Y') + 1);
                if (in_array('skills',             $studentColumns)) $studentData['skills']             = $fd['skills']     ?? [];
                if (in_array('activities',         $studentColumns)) $studentData['activities']         = $fd['activities'] ?? [];

                $student = \App\Models\Student::create($studentData);

                \Log::info('Student record created from form_data', [
                    'student_id' => $student->id,
                    'mapping_used' => !empty($fd)
                ]);

                // ── Update candidate ──
                $candidateData = ['status' => 'enrolled'];
                $candidateColumns = \Illuminate\Support\Facades\Schema::getColumnListing('candidates');
                if (in_array('student_id', $candidateColumns)) {
                    $candidateData['student_id'] = $student->id;
                }
                $candidate->update($candidateData);

                // ── Store credentials in session ──
                session([
                    'new_student_credentials' => [
                        'student_name'   => trim($candidate->first_name . ' ' . $candidate->last_name),
                        'student_number' => $studentNumber,
                        'email'          => $candidate->email,
                        'password'       => $randomPassword,
                        'student_id'     => $student->id,
                    ],
                ]);

                \Log::info('Enrollment successful', [
                    'student_id'     => $student->id,
                    'student_number' => $studentNumber,
                    'user_id'        => $user->id,
                ]);
            });

            return response()->json([
                'message'  => 'Enrollment successful.',
                'redirect' => route('candidates.index'),
            ], 200);

        } catch (\Illuminate\Database\QueryException $e) {
            \Log::error('Enrollment DB error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Database error during enrollment: ' . $e->getMessage(),
            ], 422);

        } catch (\Exception $e) {
            \Log::error('Enrollment general error: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json(['message' => 'Enrollment failed: ' . $e->getMessage()], 422);
        }
    }

    /**
     * Generate a secure random password for new student accounts.
     */
    private function generatePassword(): string
    {
        $upper   = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        $lower   = 'abcdefghjkmnpqrstuvwxyz';
        $numbers = '23456789';
        $special = '@#$!';

        return substr(str_shuffle($upper),   0, 2)
             . substr(str_shuffle($lower),   0, 3)
             . substr(str_shuffle($numbers), 0, 2)
             . substr(str_shuffle($special), 0, 1);
    }

}
