<?php

use App\Models\Schedule;
use App\Models\Section;
use App\Models\User;

// 1. Clear existing schedules
Schedule::query()->delete();

// 2. Fetch dependencies
$sections = Section::all();
$teachers = User::role('teacher')->get();

if ($sections->isEmpty() || $teachers->isEmpty()) {
    echo "Requires sections and teachers to seed schedules.\n";
    exit;
}

$itSubjects = ['Web Development I', 'Networking Fundamentals', 'Database Management', 'Information Assurance', 'Mobile App Dev', 'IT Project Management'];
$csSubjects = ['Data Structures', 'Algorithms', 'Discrete Math', 'Operating Systems', 'Machine Learning', 'Computer Architecture'];
$rooms = ['Lab 101', 'Room 203', 'Lab A', 'Main Hall', 'Room 405'];
$days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

$count = 0;

foreach ($sections as $section) {
    // Let's add 3-4 classes per section
    $numClasses = rand(3, 5);
    $usedSlots = []; // To avoid simple same-day/same-time overlaps in seeder logic

    for ($i = 0; $i < $numClasses; $i++) {
        $program = str_contains($section->name, 'IT') ? 'IT' : 'CS';
        $subs = ($program === 'IT') ? $itSubjects : $csSubjects;
        $subject = $subs[array_rand($subs)];
        
        $day = $days[array_rand($days)];
        $hour = rand(8, 16);
        $startTime = sprintf('%02d:00', $hour);
        $endTime = sprintf('%02d:30', $hour + 1);

        // Simple check to avoid seeding duplicate slots for the SAME SECTION
        $slotKey = "$day-$startTime";
        if (in_array($slotKey, $usedSlots)) continue;
        $usedSlots[] = $slotKey;

        Schedule::create([
            'section_id' => $section->id,
            'teacher_id' => $teachers->random()->id,
            'subject'    => $subject,
            'day'        => $day,
            'start_time' => $startTime,
            'end_time'   => $endTime,
            'room'       => $rooms[array_rand($rooms)],
        ]);
        
        $count++;
    }
}

echo "Successfully injected $count collegiate class schedules into the database.\n";
