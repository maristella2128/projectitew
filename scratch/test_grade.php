<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\GradeEntry;
use App\Models\Student;

try {
    $student = Student::first();
    if (!$student) {
        echo "Error: No students found in database\n";
        exit;
    }
    
    echo "Testing with Student ID: " . $student->id . " and Section ID: " . ($student->section_id ?? 'NULL') . "\n";
    
    if (!$student->section_id) {
        echo "Error: Student has no section assigned\n";
        exit;
    }

    $entry = GradeEntry::updateOrCreate(
        [
            'student_id' => $student->id,
            'subject_code' => 'TEST-' . time(),
            'semester' => 1,
            'academic_year' => '2024-2025'
        ],
        [
            'section_id' => $student->section_id,
            'subject_name' => 'Test Subject',
            'units' => 3,
            'status' => 'draft'
        ]
    );
    echo "Success: Created ID " . $entry->id . "\n";
} catch (\Exception $e) {
    echo "Error (" . get_class($e) . "): " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
