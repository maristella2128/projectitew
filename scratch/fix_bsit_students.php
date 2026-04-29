<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Section;
use App\Models\Student;
use App\Models\Program;

$targetSections = [
    'BSIT-1-A', 'BSIT-1-B', 'BSIT-1-C', 'BSIT-1-D', 'BSIT-1-E',
    'BSIT-2-A', 'BSIT-2-B', 'BSIT-2-C',
    'BSIT-3-A', 'BSIT-3-B', 'BSIT-3-C',
    'BSIT-4-A', 'BSIT-4-B', 'BSIT-4-C'
];

$program = Program::firstOrCreate(
    ['code' => 'BSIT'],
    ['name' => 'Bachelor of Science in Information Technology', 'department' => 'CCS', 'is_seeded' => 1]
);

$sectionIds = [];

foreach ($targetSections as $name) {
    preg_match('/BSIT-(\d)-/', $name, $matches);
    $year = $matches[1] ?? 1;
    
    $section = Section::firstOrCreate(
        ['name' => $name],
        [
            'grade_level' => "{$year}st Year", // simplified
            'school_year' => '2024-2025',
            'semester' => 1,
            'program_id' => $program->id,
            'max_capacity' => 50
        ]
    );
    $section->grade_level = $year == 1 ? "1st Year" : ($year == 2 ? "2nd Year" : ($year == 3 ? "3rd Year" : "4th Year"));
    $section->save();
    
    $sectionIds[] = $section->id;
}

echo "Ensured all 14 BSIT sections exist.\n";

// Get all BSCS section IDs to protect them
$bscsSectionIds = Section::where('name', 'like', 'BSCS%')->pluck('id')->toArray();

foreach ($targetSections as $name) {
    $section = Section::where('name', $name)->first();
    
    $currentCount = Student::where('section_id', $section->id)->count();
    
    if ($currentCount > 50) {
        $toRemove = $currentCount - 50;
        $studentsToRemove = Student::where('section_id', $section->id)->take($toRemove)->get();
        foreach ($studentsToRemove as $s) {
            $s->update(['section_id' => null]);
        }
        echo "Removed $toRemove students from $name\n";
    } elseif ($currentCount < 50) {
        $toAdd = 50 - $currentCount;
        
        $protectedIds = array_merge($bscsSectionIds, $sectionIds);
        // Find unassigned students first, or students not in protected sections
        $unassigned = Student::whereNotIn('section_id', $protectedIds)
            ->orWhereNull('section_id')
            ->take($toAdd)->get();
            
        foreach ($unassigned as $s) {
            $s->update(['section_id' => $section->id]);
        }
        
        $stillNeeded = $toAdd - $unassigned->count();
        if ($stillNeeded > 0) {
            echo "WARNING: Still short by $stillNeeded for $name\n";
        } else {
            echo "Added $toAdd students to $name\n";
        }
    } else {
        echo "$name already has 50 students.\n";
    }
}

echo "Done!\n";
