<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use App\Helpers\SpaRouting as Inertia;
use Illuminate\Http\JsonResponse; use Illuminate\Http\Response as HttpResponse; use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. Basic validation
        $request->validate([
            'registration_code' => 'required|string',
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // 2. Find the Student record with active registration code (case-insensitive check)
        $student = Student::whereRaw('LOWER(registration_code) = ?', [strtolower($request->registration_code)])
            ->where('registration_code_used', false)
            ->where('registration_code_expires_at', '>', now())
            ->first();

        if (!$student) {
            throw ValidationException::withMessages([
                'registration_code' => 'This registration code is invalid, already used, or has expired.',
            ]);
        }

        // 3. Get the linked User
        $user = $student->user;

        if (!$user) {
            throw ValidationException::withMessages([
                'registration_code' => 'This registration code is valid but no user record is linked. Please contact admin.',
            ]);
        }

        // 4. Update the User record with new name, email, and password
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // 5. Mark the registration code as used
        $student->update([
            'registration_code' => null,
            'registration_code_used' => true,
        ]);

        // 6. Fire Registered event
        event(new Registered($user));

        // 7. Log the user in
        Auth::login($user);

        // 8. Redirect to the dashboard
        return redirect(route('dashboard', absolute: false));
    }
}
