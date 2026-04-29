<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- TABLES ---" . PHP_EOL;
$tables = \Illuminate\Support\Facades\DB::select('SHOW TABLES');
foreach ($tables as $t) {
    echo array_values((array)$t)[0] . ', ';
}
echo PHP_EOL . PHP_EOL;

echo "--- CHECKING ENROLLMENT TABLES ---" . PHP_EOL;
$toCheck = ['enrollments', 'subjects', 'courses', 'schedules', 'class_schedules', 'enrolled_subjects', 'enrollment_subjects', 'semester_records'];
foreach ($toCheck as $table) {
    if (\Illuminate\Support\Facades\Schema::hasTable($table)) {
        $cols = \Illuminate\Support\Facades\Schema::getColumnListing($table);
        echo $table . ': ' . implode(', ', $cols) . PHP_EOL;
    } else {
        echo $table . ': NOT FOUND' . PHP_EOL;
    }
}
echo PHP_EOL;

echo "--- STUDENT DATA ---" . PHP_EOL;
$user = \App\Models\User::where('email', 'puadajamesmarc316@gmail.com')->first();
$student = clone \App\Models\Student::where('user_id', $user->id)
    ->with(['section', 'section.program'])
    ->first();

echo 'Student ID: ' . $student?->id . PHP_EOL;
echo 'Section: ' . $student?->section?->name . PHP_EOL;
echo 'Program: ' . $student?->section?->program?->name . PHP_EOL;

if (\Illuminate\Support\Facades\Schema::hasTable('enrollments')) {
    $enrollments = \Illuminate\Support\Facades\DB::table('enrollments')
        ->where('student_id', $student->id)
        ->get();
    echo 'Enrollments found: ' . $enrollments->count() . PHP_EOL;
}
if (\Illuminate\Support\Facades\Schema::hasTable('semester_records')) {
    $sem_records = \Illuminate\Support\Facades\DB::table('semester_records')
        ->where('student_id', $student->id)
        ->get();
    echo 'Semester records found: ' . $sem_records->count() . PHP_EOL;
}

echo PHP_EOL . "--- SUBJECTS LINKED ---" . PHP_EOL;
foreach (['subjects', 'courses', 'class_schedules', 'schedules', 'semester_subjects'] as $table) {
    if (\Illuminate\Support\Facades\Schema::hasTable($table)) {
        $cols = \Illuminate\Support\Facades\Schema::getColumnListing($table);
        if (in_array('section_id', $cols)) {
            $rows = \Illuminate\Support\Facades\DB::table($table)
                ->where('section_id', $student->section_id)
                ->get();
            echo $table . ' records for student section: ' . $rows->count() . PHP_EOL;
            if ($rows->count() > 0) {
                echo json_encode($rows->first(), JSON_PRETTY_PRINT) . PHP_EOL;
            }
        }
    }
}
