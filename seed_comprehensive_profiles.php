<?php

use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

// 1. Fetch Students and Teachers
$students = Student::all();
$teachers = User::role('teacher')->get();

if ($students->isEmpty() || $teachers->isEmpty()) {
    echo "Requires students and teachers to seed profiles.\n";
    exit;
}

$recorder = $teachers->first();

// 2. Clear existing entries to avoid duplicates
DB::table('grades')->delete();
DB::table('attendance')->delete();
DB::table('behavior_logs')->delete();
DB::table('achievements')->delete();
DB::table('extracurriculars')->delete();

$itSubjects = ['Web Development I', 'Networking Fundamentals', 'Database Management', 'Information Assurance', 'Mobile App Dev'];
$csSubjects = ['Data Structures', 'Algorithms', 'Discrete Math', 'Operating Systems', 'Machine Learning'];

$count_grades = 0;
$count_attendance = 0;
$count_behavior = 0;
$count_achievements = 0;
$count_extra = 0;

foreach ($students as $student) {
    // Determine program based on Year Level or ID
    $isIT = (rand(0, 1) === 0);
    $subjects = $isIT ? $itSubjects : $csSubjects;

    // --- SEED GRADES ---
    foreach ($subjects as $sub) {
        DB::table('grades')->insert([
            'student_id' => $student->id,
            'subject'    => $sub,
            'semester'   => rand(1, 2),
            'score'      => rand(78, 98),
            'remarks'    => rand(0, 1) ? 'Excellent performance in technical labs.' : 'Good academic standing.',
            'recorded_by' => $recorder->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $count_grades++;
    }

    // --- SEED ATTENDANCE (Past 2 weeks) ---
    for ($d = 1; $d <= 10; $d++) {
        $date = Carbon::now()->subDays($d);
        if ($date->isWeekend()) continue;

        $status = 'present';
        if (rand(1, 100) > 90) $status = 'absent';
        elseif (rand(1, 100) > 85) $status = 'late';

        DB::table('attendance')->insert([
            'student_id' => $student->id,
            'date'       => $date->toDateString(),
            'status'     => $status,
            'remarks'    => ($status !== 'present') ? 'Notified via email.' : null,
            'recorded_by' => $recorder->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $count_attendance++;
    }

    // --- SEED BEHAVIOR LOGS ---
    if (rand(1, 100) > 40) {
        $isPositive = (rand(1, 100) > 20);
        DB::table('behavior_logs')->insert([
            'student_id' => $student->id,
            'type'       => $isPositive ? 'positive' : 'negative',
            'description' => $isPositive ? 'Consistent leadership during group programming sprints.' : 'Late submission of laboratory exercise 4.',
            'severity'   => $isPositive ? 'low' : 'medium',
            'date'       => Carbon::now()->subDays(rand(1, 30))->toDateString(),
            'logged_by'  => $recorder->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $count_behavior++;
    }

    // --- SEED ACHIEVEMENTS ---
    if (rand(1, 100) > 70) {
        $titles = ['Dean\'s List - First Semester', 'Hackathon Finalist - 4th Region', 'Best in Mobile App Dev Award', 'Coding Challenge - Top 10%'];
        DB::table('achievements')->insert([
            'student_id' => $student->id,
            'title'      => $titles[array_rand($titles)],
            'description' => 'Awarded for academic excellence and technical proficiency in CCS.',
            'category'   => 'academic',
            'date_awarded' => Carbon::now()->subMonths(rand(1, 6))->toDateString(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $count_achievements++;
    }

    // --- SEED EXTRACURRICULARS ---
    if (rand(1, 100) > 60) {
        $clubs = ['IT Society', 'Google Developer Student Club', 'CCS Esports Guild', 'Programming Varsity'];
        DB::table('extracurriculars')->insert([
            'student_id'  => $student->id,
            'activity_name' => $clubs[array_rand($clubs)],
            'category'    => 'club',
            'role'        => rand(0, 1) ? 'Member' : 'Officer (Lead Developer)',
            'description' => 'Active contribution to community coding projects and student events.',
            'start_date'  => Carbon::now()->subYear()->toDateString(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $count_extra++;
    }
}

echo "COMPREHENSIVE DATA INJECTION SUCCESSFUL:\n";
echo "- $count_grades Grades recorded.\n";
echo "- $count_attendance Attendance logs created.\n";
echo "- $count_behavior Behavioral incidents logged.\n";
echo "- $count_achievements Achievements awarded.\n";
echo "- $count_extra Extracurricular memberships registered.\n";
