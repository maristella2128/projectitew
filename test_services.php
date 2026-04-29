<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Student;
use App\Models\ExtracurricularActivity;
use App\Models\ActivityCategory;
use App\Services\RecommendationService;
use App\Services\PointsCalculatorService;

$student = Student::first();
if (!$student) {
    echo "No students found.\n";
    exit;
}

echo "Testing for Student: {$student->name} ({$student->course} Year {$student->year_level})\n";

$recService = new RecommendationService();
$pointsService = new PointsCalculatorService();

// 1. Test Recommendation
echo "\n--- Recommendations ---\n";
$recs = $recService->getRecommendationsForStudent($student);
foreach ($recs as $rec) {
    echo "- Activity: {$rec['name']} | Score: {$rec['match_score']}\n";
    echo "  Reasons: " . implode(", ", $rec['reasons']) . "\n";
}

// 2. Test Point Recalculation
echo "\n--- Recalculating Points ---\n";
$pointsService->recalculateForStudent($student);
echo "Total Points: {$student->total_activity_points}\n";
echo "Engagement Score: {$student->engagement_score}\n";

// 3. Test Leaderboard
echo "\n--- Leaderboard (Top 5) ---\n";
$leaderboard = $pointsService->getLeaderboardData();
foreach (array_slice($leaderboard, 0, 5) as $entry) {
    echo "#{$entry['rank']} {$entry['full_name']} | Points: {$entry['total_points']} | Top Category: {$entry['top_category']}\n";
}

// 4. Test Filtered Leaderboard
echo "\n--- Filtered Leaderboard (Course: {$student->course}) ---\n";
$filtered = $pointsService->getLeaderboardData(['course' => $student->course]);
foreach (array_slice($filtered, 0, 5) as $entry) {
    echo "#{$entry['rank']} {$entry['full_name']} | Course: {$entry['course']} | Points: {$entry['total_points']}\n";
}

echo "\nTest Complete.\n";
