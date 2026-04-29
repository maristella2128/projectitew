<?php

namespace App\Services;

use App\Models\BehaviorLog;
use App\Models\ConductAlert;
use App\Models\Student;
use App\Models\StudentConductScore;
use App\Models\User;
use Illuminate\Support\Collection;

class ConductAlertService
{
    public const ALERT_RULES = [
        'immediate' => [
            'type' => 'immediate',
            'severity' => 'critical'
        ],
        'warning_3' => [
            'type' => 'warning',
            'severity' => 'medium'
        ],
        'warning_5' => [
            'type' => 'escalation',
            'severity' => 'high'
        ],
        'warning_10' => [
            'type' => 'probation',
            'severity' => 'critical'
        ],
        'clearance_hold' => [
            'type' => 'clearance_hold',
            'severity' => 'high'
        ],
        'score_drop_70' => [
            'type' => 'warning',
            'severity' => 'medium'
        ],
        'score_drop_50' => [
            'type' => 'escalation',
            'severity' => 'high'
        ]
    ];

    public function evaluateAlertsForLog(BehaviorLog $log): array
    {
        $createdAlerts = [];
        $student = $log->student;
        $scoringService = app(ConductScoringService::class);

        // Requirements mention to call recalculateScoreForStudent first before Rule 4 & 2 since those depend on it
        $score = $scoringService->recalculateScoreForStudent($student);

        // Rule 1 — IMMEDIATE
        if ($log->type === 'violation' && $log->severity === 'high') {
            $createdAlerts[] = ConductAlert::create([
                'student_id' => $student->id,
                'behavior_log_id' => $log->id,
                'alert_type' => self::ALERT_RULES['immediate']['type'],
                'severity' => self::ALERT_RULES['immediate']['severity'],
                'message' => "Immediate attention required: {$student->name} has a high-severity violation — {$log->category_label} logged on {$log->date}.",
            ]);
        }

        // Rule 2 — WARNING
        $violationCount = $score->violation_count;
        $alertType = null;
        $severity = null;

        if ($violationCount >= 10) {
            $alertType = self::ALERT_RULES['warning_10']['type'];
            $severity = self::ALERT_RULES['warning_10']['severity'];
        } elseif ($violationCount >= 5) {
            $alertType = self::ALERT_RULES['warning_5']['type'];
            $severity = self::ALERT_RULES['warning_5']['severity'];
        } elseif ($violationCount >= 3) {
            $alertType = self::ALERT_RULES['warning_3']['type'];
            $severity = self::ALERT_RULES['warning_3']['severity'];
        }

        if ($alertType) {
            $existing = ConductAlert::where('student_id', $student->id)
                ->where('alert_type', $alertType)
                ->unresolved()
                ->exists();

            if (!$existing) {
                $createdAlerts[] = ConductAlert::create([
                    'student_id' => $student->id,
                    'behavior_log_id' => $log->id,
                    'alert_type' => $alertType,
                    'severity' => $severity,
                    'message' => "{$student->name} has accumulated {$violationCount} violations (Behavior Score: {$score->total_score}).",
                ]);
            }
        }

        // Rule 4 — SCORE DROP
        $scoreType = null;
        $scoreSeverity = null;

        if ($score->total_score < 50) {
            $scoreType = self::ALERT_RULES['score_drop_50']['type'];
            $scoreSeverity = self::ALERT_RULES['score_drop_50']['severity'];
        } elseif ($score->total_score < 70) {
            $scoreType = self::ALERT_RULES['score_drop_70']['type'];
            $scoreSeverity = self::ALERT_RULES['score_drop_70']['severity'];
        }

        if ($scoreType) {
            $existingScoreAlert = ConductAlert::where('student_id', $student->id)
                ->where('alert_type', $scoreType)
                ->where('message', 'like', "%behavior score has dropped to%")
                ->unresolved()
                ->exists();

            if (!$existingScoreAlert) {
                $createdAlerts[] = ConductAlert::create([
                    'student_id' => $student->id,
                    'behavior_log_id' => $log->id,
                    'alert_type' => $scoreType,
                    'severity' => $scoreSeverity,
                    'message' => "{$student->name}'s behavior score has dropped to {$score->total_score}.",
                ]);
            }
        }

        return $createdAlerts;
    }

    public function evaluateAlertsAfterRecalculation(Student $student, StudentConductScore $score): void
    {
        // Rule 2 — WARNING
        $violationCount = $score->violation_count;
        $alertType = null;
        $severity = null;

        if ($violationCount >= 10) {
            $alertType = self::ALERT_RULES['warning_10']['type'];
            $severity = self::ALERT_RULES['warning_10']['severity'];
        } elseif ($violationCount >= 5) {
            $alertType = self::ALERT_RULES['warning_5']['type'];
            $severity = self::ALERT_RULES['warning_5']['severity'];
        } elseif ($violationCount >= 3) {
            $alertType = self::ALERT_RULES['warning_3']['type'];
            $severity = self::ALERT_RULES['warning_3']['severity'];
        }

        if ($alertType) {
            $existing = ConductAlert::where('student_id', $student->id)
                ->where('alert_type', $alertType)
                ->unresolved()
                ->exists();

            if (!$existing) {
                ConductAlert::create([
                    'student_id' => $student->id,
                    'alert_type' => $alertType,
                    'severity' => $severity,
                    'message' => "{$student->name} has accumulated {$violationCount} violations (Behavior Score: {$score->total_score}).",
                ]);
            }
        }

        // Rule 4 — SCORE DROP
        $scoreType = null;
        $scoreSeverity = null;

        if ($score->total_score < 50) {
            $scoreType = self::ALERT_RULES['score_drop_50']['type'];
            $scoreSeverity = self::ALERT_RULES['score_drop_50']['severity'];
        } elseif ($score->total_score < 70) {
            $scoreType = self::ALERT_RULES['score_drop_70']['type'];
            $scoreSeverity = self::ALERT_RULES['score_drop_70']['severity'];
        }

        if ($scoreType) {
            $existingScoreAlert = ConductAlert::where('student_id', $student->id)
                ->where('alert_type', $scoreType)
                ->where('message', 'like', "%behavior score has dropped to%")
                ->unresolved()
                ->exists();

            if (!$existingScoreAlert) {
                ConductAlert::create([
                    'student_id' => $student->id,
                    'alert_type' => $scoreType,
                    'severity' => $scoreSeverity,
                    'message' => "{$student->name}'s behavior score has dropped to {$score->total_score}.",
                ]);
            }
        }
        
        $this->evaluateClearanceHoldAlert($student);
    }
    
    public function evaluateClearanceHoldAlert(Student $student): void 
    {
        $clearance = $student->clearance;
        if ($clearance && in_array($clearance->status, ['hold', 'under_disciplinary_action'])) {
            $existingHold = ConductAlert::where('student_id', $student->id)
                ->where('alert_type', 'clearance_hold')
                ->unresolved()
                ->exists();

            if (!$existingHold) {
                ConductAlert::create([
                    'student_id' => $student->id,
                    'alert_type' => self::ALERT_RULES['clearance_hold']['type'],
                    'severity' => self::ALERT_RULES['clearance_hold']['severity'],
                    'message' => "{$student->name}'s clearance status is now '{$clearance->status_label}'. Manual review required.",
                ]);
            }
        }
    }

    public function getUnresolvedAlertsForStudent(Student $student): Collection
    {
        return ConductAlert::where('student_id', $student->id)
            ->unresolved()
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function resolveAlert(ConductAlert $alert, User $resolver): void
    {
        $alert->is_resolved = true;
        $alert->resolved_by = $resolver->id;
        $alert->resolved_at = now();
        $alert->save();
    }
}
