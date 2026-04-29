<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleAndPermissionSeeder::class,
            AcademicSeeder::class,
            ExtracurricularSeeder::class,
            ConductSeeder::class,
        ]);

        // Sample Dean
        \App\Models\User::factory()->create([
            'name' => 'Dean Admin',
            'email' => 'dean@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'dean',
        ])->assignRole('dean');

        // Sample Teacher
        \App\Models\User::factory()->create([
            'name' => 'Teacher One',
            'email' => 'teacher1@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'teacher',
        ])->assignRole('teacher');

        // More seeders will be added later for sections and students
    }
}
