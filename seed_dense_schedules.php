<?php

use App\Models\Schedule;
use App\Models\Section;
use App\Models\User;

// 1. Clear existing schedules to avoid conflict errors
Schedule::query()->delete();

// 2. Fetch dependencies
$sections = Section::all();
$teachers = User::role('teacher')->get();

if ($sections->isEmpty() || $teachers->isEmpty()) {
    echo "Requires sections and teachers to seed schedules.\n";
    exit;
}

$itSubjects = [
    'Web Development I (LEC)', 'Web Development I (LAB)', 
    'Networking Fundamentals', 'Database Management', 
    'Information Assurance', 'Mobile App Dev', 
    'IT Project Management', 'Systems Administration',
    'Human Computer Interaction', 'Cloud Computing'
];
$csSubjects = [
    'Data Structures (LEC)', 'Data Structures (LAB)', 
    'Algorithms', 'Discrete Math', 
    'Operating Systems', 'Machine Learning', 
    'Computer Architecture', 'Theory of Computation',
    'Parallel Programming', 'AI/Expert Systems'
];
$genEdSubjects = ['Science & Tech', 'Contemporary World', 'Ethics', 'Physical Education'];

$rooms = ['Lab 101', 'Room 203', 'Lab A', 'Main Hall', 'Room 405', 'Lab B', 'Room 501'];
$days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

$count = 0;

foreach ($sections as $section) {
    // Let's add 8-10 classes per section for a "full" semester feel
    $numClasses = rand(8, 10);
    $usedSlots = []; 

    for ($i = 0; $i < $numClasses; $i++) {
        $program = str_contains($section->name, 'IT') ? 'IT' : 'CS';
        
        // Pick from Gen Ed or Program specific
        if (rand(1, 100) > 80) {
            $subject = $genEdSubjects[array_rand($genEdSubjects)];
        } else {
            $subs = ($program === 'IT') ? $itSubjects : $csSubjects;
            $subject = $subs[array_rand($subs)];
        }
        
        $day = $days[array_rand($days)];
        $hour = rand(8, 16);
        $duration = (str_contains($subject, 'LAB')) ? 3 : 1.5; // Labs are longer
        
        $startTime = sprintf('%02d:00', $hour);
        $endTime = sprintf('%02d:%s', $hour + floor($duration), ($duration - floor($duration) > 0 ? '30' : '00'));

        // Basic conflict prevention for the seeder
        $slotKey = "$day-$startTime";
        if (in_array($slotKey, $usedSlots)) continue;
        $usedSlots[] = $slotKey;

        // Note: Real conflict logic in controller prevents teacher overlap, 
        // but for seeder we'll just pick random and catch any errors.
        try {
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
        } catch (\Exception $e) {
            // Probably a conflict caught by a DB constraint or unique rule (if any)
            continue;
        }
    }
}

echo "DENSE DATA INJECTION COMPLETE:\n";
echo "Successfully injected $count collegiate class schedules across all BSIT/BSCS blocks.\n";
