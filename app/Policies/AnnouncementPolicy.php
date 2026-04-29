<?php

namespace App\Policies;

use App\Models\Announcement;
use App\Models\User;

class AnnouncementPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasRole(['dean', 'teacher']);
    }

    public function delete(User $user, Announcement $announcement): bool
    {
        return $user->id === $announcement->user_id || $user->hasRole('dean');
    }
}
