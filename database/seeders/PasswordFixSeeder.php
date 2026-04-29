<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PasswordFixSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        foreach ($users as $user) {
            $user->password = Hash::make('password');
            $user->save();
            $this->command->info("Hashed password for: " . $user->email);
        }
    }
}
