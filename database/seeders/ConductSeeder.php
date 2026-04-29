<?php

namespace Database\Seeders;

use App\Models\BehaviorLog;
use App\Models\Student;
use App\Models\User;
use App\Services\ConductScoringService;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ConductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = Student::limit(10)->get();
        if ($students->isEmpty()) {
            return;
        }

        $recorder = User::first();
        if (!$recorder) {
            return;
        }

        $categories = [
            'attendance' => [
                'type' => 'violation',
                'description' => "Student was absent without excuse for 3 consecutive days."
            ],
            'behavioral_misconduct' => [
                'type' => 'violation',
                'description' => "Student was involved in a verbal altercation with a classmate."
            ],
            'academic_misconduct' => [
                'type' => 'violation',
                'description' => "Student found with unauthorized notes during examination."
            ],
            'dress_code' => [
                'type' => 'violation',
                'description' => "Student reported to class wearing non-compliant uniform."
            ],
            'excellence' => [
                'type' => 'commendation',
                'description' => "Student represented the department in the regional programming contest."
            ],
            'leadership' => [
                'type' => 'commendation',
                'description' => "Student served as event coordinator for the department's annual event."
            ],
        ];

        foreach ($students as $student) {
            $logCount = rand(4, 8);

            for ($i = 0; $i < $logCount; $i++) {
                // Determine Type based on 60/40 split requested (but I'll pick from categories which are mapped)
                // Actually user said: Mix of categories, and then separate mix of violations (60%) / commendations (40%)
                $isViolation = rand(1, 100) <= 60;
                $catKey = $this->getRandomCategory($isViolation);
                
                $severity = $this->getRandomSeverity();
                $isResolved = rand(1, 100) <= 70;

                BehaviorLog::create([
                    'student_id' => $student->id,
                    'type' => $isViolation ? 'violation' : 'commendation',
                    'category' => $catKey,
                    'severity' => $severity,
                    'description' => $categories[$catKey]['description'],
                    'date' => Carbon::now()->subDays(rand(1, 365)),
                    'logged_by' => $recorder->id,
                    'resolution_status' => $isResolved ? 'resolved' : 'pending',
                    'resolved_at' => $isResolved ? Carbon::now() : null,
                    'resolved_by' => $isResolved ? $recorder->id : null,
                    'resolution_notes' => $isResolved ? "This case has been documented and discussed with the student." : null,
                ]);
            }
        }

        // Final recalculations
        $service = app(ConductScoringService::class);
        $service->recalculateAllScores();
        $service->evaluateClearanceForAll();
    }

    private function getRandomCategory(bool $isViolation): string
    {
        if ($isViolation) {
            $violationCats = ['attendance', 'attendance', 'behavioral_misconduct', 'academic_misconduct', 'dress_code'];
            return $violationCats[array_rand($violationCats)];
        }
        
        $commendationCats = ['excellence', 'leadership'];
        return $commendationCats[array_rand($commendationCats)];
    }

    private function getRandomSeverity(): string
    {
        $r = rand(1, 100);
        if ($r <= 50) return 'low';
        if ($r <= 85) return 'medium';
        return 'high';
    }
}
