<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('email', 'puadajamesmarc316@gmail.com')->first();
$student = \App\Models\Student::where('user_id', $user->id)->first();

if ($student) {
    echo 'Section ID column: ' . ($student->section_id ?? 'NULL') . PHP_EOL;
    try {
        $section = clone $student->section;
        if ($section) {
            echo 'Section found: ' . PHP_EOL;
            echo json_encode($section->toArray(), JSON_PRETTY_PRINT) . PHP_EOL;
        } else {
            echo 'No section linked to this student' . PHP_EOL;
        }
    } catch (\Exception $e) {
        echo 'Section relation error: ' . $e->getMessage() . PHP_EOL;
    }
} else {
    echo 'No student record found' . PHP_EOL;
}

$cols = \Illuminate\Support\Facades\Schema::getColumnListing('sections');
echo 'Sections columns: ' . implode(', ', $cols) . PHP_EOL;

if (\Illuminate\Support\Facades\Schema::hasTable('programs')) {
    $pcols = \Illuminate\Support\Facades\Schema::getColumnListing('programs');
    echo 'Programs columns: ' . implode(', ', $pcols) . PHP_EOL;
}
