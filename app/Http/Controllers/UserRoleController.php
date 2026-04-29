<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\SpaRouting as Inertia;
use App\Models\User;
use App\Models\Role;
use App\Models\StaffGroup;

class UserRoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('UserRoles/Index', [
            'users' => \App\Models\User::select([
                    'id', 'name', 'email', 'role', 'is_active',
                    'created_at', 'user_group'
                ])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(fn($u) => [
                    'id'         => $u->id,
                    'name'       => $u->name,
                    'email'      => $u->email,
                    'role'       => ($u->role === 'students' ? 'student' : ($u->role ?? 'viewer')),
                    'is_active'  => (bool) ($u->is_active ?? true),
                    'user_group' => $u->user_group ?? null,
                    'created_at' => $u->created_at?->format('M d, Y'),
                    'student_number' => $u->student?->student_id ?? null,
                ]),
            'roles'  => \Spatie\Permission\Models\Role::all(),
            'groups' => User::whereNotNull('user_group')
                ->select('user_group as name')
                ->selectRaw('count(*) as member_count')
                ->groupBy('user_group')
                ->get()
                ->map(fn($g, $i) => [
                    'id' => $i + 1,
                    'name' => $g->name,
                    'description' => "Group for {$g->name} users",
                    'member_count' => $g->member_count,
                ]),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|exists:roles,name',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'role' => $request->role,
            'department' => $request->department,
            'user_group' => $request->user_group,
        ]);

        $user->assignRole($request->role);

        return redirect()->back()->with('success', 'User account created successfully.');
    }

    public function update(Request $request, User $user)
    {
        \Illuminate\Support\Facades\Log::info('USER UPDATE REQUEST', [
            'user_id'          => $user->id,
            'has_password'     => $request->filled('password'),
            'password_length'  => strlen($request->password ?? ''),
            'fields_sent'      => array_keys($request->all()),
        ]);

        $rules = [
            'name'       => 'sometimes|string|max:255',
            'email'      => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'role'       => 'sometimes|string|exists:roles,name',
            'department' => 'sometimes|nullable|string',
            'user_group' => 'sometimes|nullable|string',
        ];

        // Only validate password if it was provided
        if ($request->filled('password')) {
            $rules['password'] = 'string|min:8';
        }

        $validated = $request->validate($rules);

        // Hash the password if provided
        if ($request->filled('password')) {
            $validated['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
        }

        $user->update($validated);

        if (isset($validated['role'])) {
            $user->syncRoles([$validated['role']]);
        }

        return redirect()->back()->with('success', 'User account updated successfully.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User account deleted successfully.');
    }
}
