<?php

use App\Models\User;
use App\Models\Student;
use App\Models\Section;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

$skillsPool = ['Java','Python','React','Laravel','Cloud Computing','Cybersecurity','Data Science','AI/ML'];
$activitiesPool = ['IT Society','Google Developer Student Club','Cyber Sentinels','Esports Club','Programming Varsity'];
$firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'William', 'Emma', 'David', 'Olivia', 'James', 'Ava', 'Robert', 'Isabella', 'Joseph', 'Sophia', 'Charles'];
$lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];

// Fetch all college sections we just created
$sections = Section::all();
if ($sections->isEmpty()) {
    echo "No sections found. Please run seed_sections.php first.\n";
    exit;
}

$count = 0;

for ($i = 0; $i < 30; $i++) {
    shuffle($firstNames);
    $firstName = $firstNames[0];
    shuffle($lastNames);
    $lastName = $lastNames[0];
    
    $uniqueId = rand(1000, 9999);
    $programSuffix = rand(0, 1) ? 'IT' : 'CS';
    $studentId = date('Y') . '-' . str_pad((string)($i + 1001), 4, '0', STR_PAD_LEFT) . '-' . $programSuffix;

    $user = User::create([
        'name' => $firstName . ' ' . $lastName,
        'email' => strtolower($firstName . '.' . $lastName . $uniqueId . '@ccs-academy.edu.ph'),
        'password' => Hash::make('password123'),
        'role' => 'student',
    ]);

    try {
        $user->assignRole('student');
    } catch (\Exception $e) {}

    $numSkills = rand(2, 4);
    $skillsKeys = array_rand($skillsPool, $numSkills);
    $skills = is_array($skillsKeys) ? array_intersect_key($skillsPool, array_flip($skillsKeys)) : [$skillsPool[$skillsKeys]];

    $numActs = rand(1, 2);
    $actsKeys = array_rand($activitiesPool, $numActs);
    $activities = is_array($actsKeys) ? array_intersect_key($activitiesPool, array_flip($actsKeys)) : [$activitiesPool[$actsKeys]];

    // Pick a random section
    $section = $sections->random();

    Student::create([
        'user_id' => $user->id,
        'student_id' => $studentId, // We use student_id field here, but front-end might look for lrn? 
        'lrn' => str_pad((string)rand(100000000000, 999999999999), 12, '0', STR_PAD_LEFT), // Keep LRN for mapping if needed
        'first_name' => $firstName,
        'last_name' => $lastName,
        'middle_name' => chr(rand(65, 90)), 
        'birthdate' => '20' . str_pad((string)rand(3, 6), 2, '0', STR_PAD_LEFT) . '-' . str_pad((string)rand(1, 12), 2, '0', STR_PAD_LEFT) . '-' . str_pad((string)rand(1, 28), 2, '0', STR_PAD_LEFT),
        'gender' => rand(0, 1) ? 'male' : 'female',
        'address' => 'Student Residence Block ' . rand(1, 50),
        'guardian_name' => 'Guardian ' . $firstName,
        'guardian_contact' => '09' . str_pad((string)rand(1, 999999999), 9, '0', STR_PAD_LEFT),
        'guardian_relationship' => 'Parent',
        'year_level' => $section->grade_level,
        'section_id' => $section->id,
        'enrollment_status' => 'enrolled',
        'school_year' => '2025-2026',
        'skills' => array_values($skills),
        'activities' => array_values($activities),
    ]);
    
    $count++;
}

echo "Successfully injected $count college students (BSIT & BSCS) into the database.\n";
