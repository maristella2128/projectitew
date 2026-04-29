<?php

namespace App\Services;

use App\Models\BehaviorLog;
use App\Models\ConductAlert;
use App\Models\Student;
use App\Models\StudentClearance;
use App\Models\StudentConductScore;

class ConductScoringService
{
    public const POINT_MAP = [
        'violation' => [
            'low' => -5,
            'medium' => -15,
            'high' => -30,
        ],
        'commendation' => [
            'low' => 5,
            'medium' => 10,
            'high' => 20,
        ]
    ];

    /**
     * Compute and save points for a single behavior log.
     */
    public function computePointsForLog(BehaviorLog $log): int
    {
        $points = 0;

        if (isset(self::POINT_MAP[$log->type][$log->severity])) {
            $points = self::POINT_MAP[$log->type][$log->severity];
        }

        $log->points = $points;
        $log->save();

        return $points;
    }

    /**
     * Recalculate score from scratch for a single student.
     */
    public function recalculateScoreForStudent(Student $student): StudentConductScore
    {
        $logs = $student->behaviorLogs()
            ->where('resolution_status', '!=', 'dismissed')
            ->get();

        $totalScore = 100;
        $violationCount = 0;
        $commendationCount = 0;
        $highSeverityCount = 0;
        $mediumSeverityCount = 0;
        $lowSeverityCount = 0;

        $lastViolationAt = null;
        $lastCommendationAt = null;

        foreach ($logs as $log) {
            $totalScore += $log->points ?? 0;

            if ($log->type === 'violation') {
                $violationCount++;
                if ($log->severity === 'high') {
                    $highSeverityCount++;
                } elseif ($log->severity === 'medium') {
                    $mediumSeverityCount++;
                } elseif ($log->severity === 'low') {
                    $lowSeverityCount++;
                }

                if ($lastViolationAt === null || $log->date > $lastViolationAt) {
                    $lastViolationAt = $log->date; // Assumes date/created_at is relevant
                }
            } elseif ($log->type === 'commendation') {
                $commendationCount++;

                if ($lastCommendationAt === null || $log->date > $lastCommendationAt) {
                    $lastCommendationAt = $log->date;
                }
            }
        }

        // Cap score
        $totalScore = max(0, min(150, $totalScore));

        $score = StudentConductScore::updateOrCreate(
            ['student_id' => $student->id],
            [
                'total_score' => $totalScore,
                'violation_count' => $violationCount,
                'commendation_count' => $commendationCount,
                'high_severity_count' => $highSeverityCount,
                'medium_severity_count' => $mediumSeverityCount,
                'low_severity_count' => $lowSeverityCount,
                'last_violation_at' => $lastViolationAt,
                'last_commendation_at' => $lastCommendationAt,
                'last_computed_at' => now(),
            ]
        );

        return $score;
    }

    /**
     * Recalculate scores for all students.
     */
    public function recalculateAllScores(): void
    {
        $count = 0;
        Student::chunk(100, function ($students) use (&$count) {
            foreach ($students as $student) {
                $this->recalculateScoreForStudent($student);
                $count++;
            }
        });

        \Log::info("Recalculated scores for {$count} students");
    }

    /**
     * Evaluate and update clearance status for a single student.
     */
    public function evaluateClearanceForStudent(Student $student): StudentClearance
    {
        $score = $student->conductScore;

        // If score not computed yet, compute it implicitly
        if (!$score) {
            $score = $this->recalculateScoreForStudent($student);
        }

        $hasUdaAlerts = ConductAlert::where('student_id', $student->id)
            ->whereIn('alert_type', ['immediate', 'escalation'])
            ->unresolved()
            ->exists();

        $pendingLogsCount = $student->behaviorLogs()
            ->where('resolution_status', 'pending')
            ->count();

        // Check Departmental Clearance
        $departmentalPending = \App\Models\StudentClearanceEntry::where('student_id', $student->id)
            ->where('status', '!=', 'cleared')
            ->exists();

        // Evaluate Rules
        $status = 'pending_issues';
        $clearedFor = ['enrollment']; // Initial assumption for pending_issues

        if ($hasUdaAlerts) {
            $status = 'under_disciplinary_action';
            $clearedFor = [];
        } elseif ($score->high_severity_count >= 1 || $score->total_score < 50) {
            $status = 'hold';
            $clearedFor = [];
        } elseif ($score->total_score >= 80 && $pendingLogsCount === 0 && !$departmentalPending) {
            $status = 'cleared';
            $clearedFor = ['graduation', 'enrollment', 'ojt'];
        } else {
            $status = 'pending_issues';
            $clearedFor = ['enrollment'];
        }

        $clearance = StudentClearance::updateOrCreate(
            ['student_id' => $student->id],
            [
                'status' => $status,
                'cleared_for' => $clearedFor,
                'last_evaluated_at' => now(),
            ]
        );

        return $clearance;
    }

    /**
     * Evaluate rules for all students.
     */
    public function evaluateClearanceForAll(): void
    {
        Student::chunk(100, function ($students) {
            foreach ($students as $student) {
                $this->evaluateClearanceForStudent($student);
            }
        });
    }
}
