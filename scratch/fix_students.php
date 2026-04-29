<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Section;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

$sections = Section::where('name', 'like', 'BSCS%')->orderBy('name')->get();

echo "Found " . $sections->count() . " BSCS sections.\n";

foreach ($sections as $section) {
    $currentCount = Student::where('section_id', $section->id)->count();
    
    if ($currentCount > 50) {
        $toRemove = $currentCount - 50;
        $studentsToRemove = Student::where('section_id', $section->id)->take($toRemove)->get();
        foreach ($studentsToRemove as $s) {
            $s->update(['section_id' => null]);
        }
        echo "Removed $toRemove students from $section->name\n";
    } elseif ($currentCount < 50) {
        $toAdd = 50 - $currentCount;
        
        // Find unassigned students
        $unassigned = Student::whereNull('section_id')->take($toAdd)->get();
        
        foreach ($unassigned as $s) {
            $s->update(['section_id' => $section->id]);
        }
        
        $stillNeeded = $toAdd - $unassigned->count();
        
        if ($stillNeeded > 0) {
            // Need to create more students
            for ($i = 0; $i < $stillNeeded; $i++) {
                $uid = User::insertGetId([
                    'name' => "Student {$section->name} " . uniqid(),
                    'email' => uniqid() . "@example.com",
                    'password' => Hash::make('password'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                
                Student::insert([
                    'user_id' => $uid,
                    'section_id' => $section->id,
                    'student_id' => '2026' . rand(10000000, 99999999),
                    'first_name' => "First" . uniqid(),
                    'last_name' => "Last" . uniqid(),
                    'course' => 'BSCS',
                    'year_level' => (int) substr($section->grade_level, 0, 1),
                    'school_year' => '2024-2025',
                    'enrollment_status' => 'enrolled',
                    'academic_status' => 'regular',
                    'gender' => 'male',
                    'birthdate' => '2000-01-01',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
        echo "Added $toAdd students to $section->name\n";
    } else {
        echo "$section->name already has 50 students.\n";
    }
}

echo "Done!\n";
