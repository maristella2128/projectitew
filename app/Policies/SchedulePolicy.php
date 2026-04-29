<?php

namespace App\Policies;

use App\Models\Schedule;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SchedulePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Schedule $schedule): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasRole(['dean', 'teacher']);
    }

    public function update(User $user, Schedule $schedule): bool
    {
        return $user->hasRole(['dean', 'teacher']);
    }

    public function delete(User $user, Schedule $schedule): bool
    {
        return $user->hasRole('dean');
    }
}
