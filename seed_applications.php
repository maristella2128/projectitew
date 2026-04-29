<?php

use App\Models\Application;

$firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Charlie', 'Drew', 'Avery', 'Cameron', 'Peyton', 'Quinn', 'Skyler', 'Finley'];
$lastNames = ['Adams', 'Baker', 'Clark', 'Diaz', 'Evans', 'Flores', 'Gomez', 'Hill', 'Ito', 'Jones', 'King', 'Lee', 'Moore', 'Nelson', 'Ortiz'];
$programsApplied = ['BSIT', 'BSCS'];
$statuses = ['pending', 'pending', 'reviewing', 'reviewing', 'accepted', 'rejected'];

$count = 0;

// Clear old applications
Application::query()->delete();

for ($i = 0; $i < 15; $i++) {
    shuffle($firstNames);
    $firstName = reset($firstNames);
    
    shuffle($lastNames);
    $lastName = reset($lastNames);
    
    Application::create([
        'first_name' => $firstName,
        'last_name' => $lastName,
        'email' => strtolower($firstName . '.' . $lastName . rand(100, 999) . '@prospect.com'),
        'phone' => '09' . str_pad((string)rand(1, 999999999), 9, '0', STR_PAD_LEFT),
        'year_level_applied' => $programsApplied[array_rand($programsApplied)], // Program name here
        'status' => $statuses[array_rand($statuses)],
        'remarks' => rand(0, 1) ? 'Prospective candidate for the CCS program. Scholastic records verified.' : null,
    ]);
    
    $count++;
}

echo "Successfully injected $count college applications into the Admission Pipeline.\n";
