<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dean = User::where('role', 'dean')->first();
        if (!$dean) {
            $dean = User::factory()->create(['role' => 'dean', 'email' => 'dean@test.com']);
        }

        $activities = [
            ['name' => 'Google Developer Student Club', 'type' => 'Organization', 'category' => 'Tech',      'points' => 20, 'status' => 'active', 'is_recurring' => true, 'description' => 'A community for students interested in Google developer technologies.'],
            ['name' => 'Programming Contest Team',       'type' => 'Competition',  'category' => 'Tech',      'points' => 30, 'status' => 'active', 'is_recurring' => false, 'description' => 'Competitive programming team representing the college.'],
            ['name' => 'Student Government',             'type' => 'Organization', 'category' => 'Leadership','points' => 25, 'status' => 'active', 'is_recurring' => true, 'description' => 'The official student representative body of the college.'],
            ['name' => 'Math Olympiad Team',             'type' => 'Competition',  'category' => 'Academic',  'points' => 25, 'status' => 'active', 'is_recurring' => false, 'description' => 'Team specializing in advanced mathematical problem solving.'],
            ['name' => 'Debate Club',                    'type' => 'Organization', 'category' => 'Academic',  'points' => 15, 'status' => 'active', 'is_recurring' => true, 'description' => 'Honing critical thinking and public speaking skills.'],
            ['name' => 'Basketball Varsity',             'type' => 'Sports',       'category' => 'Sports',    'points' => 20, 'status' => 'active', 'is_recurring' => true, 'description' => 'The official basketball team of the college.'],
        ];

        foreach ($activities as $data) {
            Activity::create([...$data, 'created_by' => $dean->id]);
        }
    }
}
