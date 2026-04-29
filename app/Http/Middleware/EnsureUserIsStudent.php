<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureUserIsStudent
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $role = $user->role ?? $user->roles?->first()?->name;

        if ($role !== 'student' && $role !== 'students') {
            // Non-students trying to access student portal → redirect to admin
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
