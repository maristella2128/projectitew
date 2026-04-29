<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use App\Helpers\SpaRouting as Inertia;
use Illuminate\Http\JsonResponse; use Illuminate\Http\Response as HttpResponse; use Illuminate\View\View;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdmissionController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Application::class);

        return Inertia::render('Admissions/Index', [
            'applications' => Application::latest()->paginate(10),
        ]);
    }

    public function search(Request $request)
    {
        $q = $request->query('q', '');

        $query = Application::query()->where('status', 'accepted');

        if (!empty($q)) {
            $query->where(function ($sub) use ($q) {
                $sub->where('first_name', 'like', "%{$q}%")
                    ->orWhere('last_name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            });
        }

        $applicants = $query->limit(15)->get(['id', 'first_name', 'last_name', 'email', 'year_level_applied']);

        return response()->json($applicants);
    }

    public function show(Application $application)
    {
        Gate::authorize('view', $application);

        return Inertia::render('Admissions/Show', [
            'application' => $application,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'         => 'required|string|max:255',
            'last_name'          => 'required|string|max:255',
            'email'              => 'required|email|max:255',
            'phone'              => 'required|string|max:20',
            'year_level_applied' => 'required|string',
        ]);

        Application::create($validated);

        return back()->with('success', 'Your application has been submitted successfully.');
    }

    public function update(Request $request, Application $application)
    {
        Gate::authorize('update', $application);

        $validated = $request->validate([
            'status'  => 'required|in:pending,reviewing,accepted,rejected,enrolled',
            'remarks' => 'nullable|string',
        ]);

        $application->update($validated);

        return back()->with('success', "Application updated to {$validated['status']}.");
    }

    public function enroll(Request $request, Application $application)
    {
        Gate::authorize('update', $application);

        // Guard: only accepted applications can be enrolled
        if ($application->status !== 'accepted') {
            return back()->withErrors(['enrollment' => 'Only accepted applications can be enrolled.']);
        }

        $registrationCode = null;

        try {
            DB::transaction(function () use ($application, &$registrationCode) {
                // Check if a user account already exists for this email
                $existingUser = User::where('email', $application->email)->first();

                if ($existingUser) {
                    // If a student profile is already linked, just mark the application enrolled
                    $existingStudent = Student::where('user_id', $existingUser->id)->first();
                    if ($existingStudent) {
                        $application->update(['status' => 'enrolled']);
                        $registrationCode = $existingStudent->registration_code;
                        return;
                    }
                    // Orphaned user (previous failed attempt) — re-use it
                    $user = $existingUser;
                } else {
                    // 1. Create new User account
                    $user = User::create([
                        'name'     => "{$application->first_name} {$application->last_name}",
                        'email'    => $application->email,
                        'password' => Hash::make('Student123!'),
                        'role'     => 'student',
                    ]);
                    $user->assignRole('student');
                }

                // 2. Generate unique registration code
                do {
                    $registrationCode = Str::upper(Str::random(8));
                } while (Student::where('registration_code', $registrationCode)->exists());

                // 3. Generate unique student ID
                do {
                    $studentId = 'SID-' . Str::upper(Str::random(6));
                } while (Student::where('student_id', $studentId)->exists());

                // 4. Create Student profile (required NOT NULL fields get placeholder defaults)
                Student::create([
                    'user_id'                      => $user->id,
                    'student_id'                   => $studentId,
                    'first_name'                   => $application->first_name,
                    'last_name'                    => $application->last_name,
                    'middle_name'                  => null,
                    'year_level'                   => $application->year_level_applied,
                    'enrollment_status'            => 'enrolled',
                    'school_year'                  => date('Y') . '-' . (date('Y') + 1),
                    'birthdate'                    => '2000-01-01',
                    'gender'                       => 'other',
                    'address'                      => 'To be updated',
                    'guardian_name'                => 'To be updated',
                    'guardian_contact'             => 'To be updated',
                    'guardian_relationship'        => 'To be updated',
                    'registration_code'            => $registrationCode,
                    'registration_code_used'       => false,
                    'registration_code_expires_at' => now()->addDays(7),
                ]);

                // 5. Mark application as enrolled
                $application->update(['status' => 'enrolled']);
            });
        } catch (\Throwable $e) {
            return back()->withErrors(['enrollment' => 'Enrollment failed: ' . $e->getMessage()]);
        }

        return redirect()->route('admissions.show', $application->id)->with([
            'enrollment_success' => 'Student enrolled successfully.',
            'registration_code'  => $registrationCode,
        ]);
    }
}
