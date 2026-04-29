<?php

use App\Models\Section;
use App\Models\User;

$adviser = User::first();

$sections = [
    // BSIT Sections
    ['name' => 'BSIT-1A', 'grade_level' => '1st Year', 'program' => 'BSIT'],
    ['name' => 'BSIT-1B', 'grade_level' => '1st Year', 'program' => 'BSIT'],
    ['name' => 'BSIT-2A', 'grade_level' => '2nd Year', 'program' => 'BSIT'],
    ['name' => 'BSIT-2B', 'grade_level' => '2nd Year', 'program' => 'BSIT'],
    ['name' => 'BSIT-3A', 'grade_level' => '3rd Year', 'program' => 'BSIT'],
    ['name' => 'BSIT-3B', 'grade_level' => '3rd Year', 'program' => 'BSIT'],
    ['name' => 'BSIT-4A', 'grade_level' => '4th Year', 'program' => 'BSIT'],
    ['name' => 'BSIT-4B', 'grade_level' => '4th Year', 'program' => 'BSIT'],

    // BSCS Sections
    ['name' => 'BSCS-1A', 'grade_level' => '1st Year', 'program' => 'BSCS'],
    ['name' => 'BSCS-1B', 'grade_level' => '1st Year', 'program' => 'BSCS'],
    ['name' => 'BSCS-2A', 'grade_level' => '2nd Year', 'program' => 'BSCS'],
    ['name' => 'BSCS-2B', 'grade_level' => '2nd Year', 'program' => 'BSCS'],
    ['name' => 'BSCS-3A', 'grade_level' => '3rd Year', 'program' => 'BSCS'],
    ['name' => 'BSCS-3B', 'grade_level' => '3rd Year', 'program' => 'BSCS'],
    ['name' => 'BSCS-4A', 'grade_level' => '4th Year', 'program' => 'BSCS'],
    ['name' => 'BSCS-4B', 'grade_level' => '4th Year', 'program' => 'BSCS'],
];

$count = 0;
foreach ($sections as $s) {
    Section::create([
        'name'        => $s['name'],
        'grade_level' => $s['grade_level'],
        'school_year' => '2025-2026',
        'adviser_id'  => $adviser ? $adviser->id : null,
    ]);
    $count++;
}

echo "Successfully injected $count college sections (BSIT & BSCS) into the database.\n";
