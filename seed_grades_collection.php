<?php

use App\Models\Grade;
use App\Models\Student;
use App\Models\User;

// 1. Clear existing grades
Grade::query()->delete();

// 2. Fetch dependencies
$students = Student::with('section')->get();
$teachers = User::role('teacher')->get();

if ($students->isEmpty() || $teachers->isEmpty()) {
    echo "Requires students and teachers to seed grades.\n";
    exit;
}

$recorder = $teachers->first();

$itSubjects = ['Web Development I', 'Networking Fundamentals', 'Database Management', 'Information Assurance', 'Mobile App Dev'];
$csSubjects = ['Data Structures', 'Algorithms', 'Discrete Math', 'Operating Systems', 'Machine Learning'];

$count = 0;

foreach ($students as $student) {
    // Determine program
    $isIT = $student->section && str_contains($student->section->name, 'IT');
    $subs = $isIT ? $itSubjects : $csSubjects;

    // Add 5 subjects per student
    foreach ($subs as $subject) {
        $semester = rand(1, 2); // 1 = 1st Semester, 2 = 2nd Semester
        $score = rand(75, 98);
        
        $remarks = "Good performance.";
        if ($score >= 95) $remarks = "Outstanding academic achievement. Candidate for Dean's List.";
        if ($score >= 90 && $score < 95) $remarks = "Excellent technical understanding of the subject matter.";
        if ($score < 80) $remarks = "Demonstrated passing competency. Needs more focus on lab exercises.";

        Grade::create([
            'student_id'  => $student->id,
            'subject'     => $subject,
            'semester'    => $semester,
            'score'       => $score,
            'remarks'     => $remarks,
            'recorded_by' => $recorder->id,
        ]);
        
        $count++;
    }
}

echo "Successfully injected $count academic grades into the Registry.\n";
