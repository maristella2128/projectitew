<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// This script will identify and fix any user passwords that are not Bcrypt-hashed.
// A Bcrypt hash starts with $2y$ (or $2a$ or $2b$).

$users = User::all();
$fixedCount = 0;
$log = "";

foreach ($users as $user) {
    if (!str_starts_with($user->password, '$2y$') && 
        !str_starts_with($user->password, '$2a$') && 
        !str_starts_with($user->password, '$2b$')) {
        
        $msg = "Resetting password for: {$user->email} (Current: " . substr($user->password, 0, 10) . "...)\n";
        echo $msg;
        $log .= $msg;
        $user->password = Hash::make('password');
        $user->save();
        $fixedCount++;
    }
}

$summary = "\nCompleted. Fixed $fixedCount users. All passwords are now 'password'.\n";
echo $summary;
$log .= $summary;

file_put_contents('fix_passwords_results.log', $log);
