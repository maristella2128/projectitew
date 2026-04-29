<?php

namespace App\Policies;

use App\Models\Achievement;
use App\Models\User;

class AchievementPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasRole(['dean', 'teacher']);
    }

    public function update(User $user, Achievement $achievement): bool
    {
        return $user->hasRole(['dean', 'teacher']);
    }

    public function delete(User $user, Achievement $achievement): bool
    {
        return $user->hasRole('dean');
    }
}
