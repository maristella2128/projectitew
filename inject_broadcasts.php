<?php

use App\Models\Announcement;
use App\Models\User;
use App\Models\Section;
use Illuminate\Support\Facades\DB;

// Bootstrap Laravel if needed, but we will run this via tinker --execute
// or just as a standalone script called via php artisan tinker

$dean = User::where('email', 'dean@example.com')->first();
if (!$dean) {
    echo "Dean user not found.\n";
    exit;
}

$sections = Section::all();

$data = [
    [
        'user_id' => $dean->id,
        'title' => 'Midterm Examination Clearance Protocol',
        'content' => "Attention all students: The clearance window for the 1st Semester Midterm Examinations is now open. \n\nPlease ensure all laboratory fees and library returns are settled by Friday. Failure to comply will result in automated permit withholding. \n\nCheck your student portals for specific departmental requirements.",
        'type' => 'urgent',
        'section_id' => null,
    ],
    [
        'user_id' => $dean->id,
        'title' => 'Academic Residency & Thesis Defense Schedules',
        'content' => "The final schedule for Thesis Proposal Defenses has been released. \n\nCandidates are expected to be in formal attire and present 30 minutes before their allotted time. Technical dry runs will be conducted in Lab 4 on Wednesday afternoon. \n\nGood luck to all researchers.",
        'type' => 'academic',
        'section_id' => $sections->first()?->id,
    ],
    [
        'user_id' => $dean->id,
        'title' => 'Campus Health & Safety: Seasonal Flu Advisory',
        'content' => "Due to the recent surge in seasonal flu cases, the University Health Service recommends mandatory mask-wearing in high-density areas (Cafeteria, Library, Gym). \n\nFree flu vaccinations are available at the Health Center from 8 AM to 4 PM throughout the week.",
        'type' => 'health',
        'section_id' => null,
    ],
    [
        'user_id' => $dean->id,
        'title' => 'CCS Foundation Day: Call for Volunteers',
        'content' => "The College of Computing Studies is looking for enthusiastic volunteers for the upcoming Foundation Day festivities. \n\nJoin the Technical, Logistics, or Documentation committees. Certificates and community service hours will be credited to all active participants. \n\nSign up at the Dean's Office.",
        'type' => 'general',
        'section_id' => null,
    ],
    [
        'user_id' => $dean->id,
        'title' => 'Mandatory Internship Orientation (SIEP 2025)',
        'content' => "All 4th-year students enrolled in the Student Internship Program are required to attend the orientation on March 30, 2025. \n\nFailure to attend will result in a 20-hour penalty on your total internship hours. Industry partners will be present for early recruitment.",
        'type' => 'academic',
        'section_id' => $sections->last()?->id,
    ]
];

foreach ($data as $item) {
    Announcement::create($item);
}

echo "Broadcast signals successfully injected into the registry.\n";
