<?php

namespace App\Services;

use App\Models\Student;

class AcademicAlertService
{
    /**
     * Compute array of theoretical academic alerts for a student.
     * 
     * Alert rules:
     * - FAILING_SUBJECT: student has 1+ subjects with status = 'failed' in any semester
     * - LOW_GWA: overall GWA > 2.75 (Philippine scale)
     * - PROBATION_RISK: GWA > 2.5 but <= 2.75
     * - EXCESSIVE_DROPS: total dropped subjects across all semesters >= 3
     * - IRREGULAR_STATUS: student.academic_status = 'irregular' or 'probation'
     * 
     * @param Student $student (needs semesterRecords.subjects eager loaded)
     * @return array
     */
    public function getAlertsForStudent(Student $student): array
    {
        $alerts = [];
        
        // 1. FAILING_SUBJECT and EXCESSIVE_DROPS
        $failedCount = 0;
        $droppedCount = 0;
        
        $totalWeighted = 0;
        $totalUnits = 0;

        foreach ($student->semesterRecords as $record) {
            foreach ($record->subjects as $subject) {
                if ($subject->status === 'failed') {
                    $failedCount++;
                }
                if ($subject->status === 'dropped') {
                    $droppedCount++;
                }

                if (in_array($subject->status, ['passed', 'failed']) && $subject->grade !== null) {
                    $totalWeighted += ($subject->grade * $subject->units);
                    $totalUnits += $subject->units;
                }
            }
        }

        if ($failedCount > 0) {
            $alerts[] = [
                'type' => 'FAILING_SUBJECT',
                'severity' => 'high',
                'message' => "Student has {$failedCount} recorded failed subject(s) in their academic history."
            ];
        }

        if ($droppedCount >= 3) {
            $alerts[] = [
                'type' => 'EXCESSIVE_DROPS',
                'severity' => 'medium',
                'message' => "Student has dropped {$droppedCount} subjects cumulatively, raising course load concern."
            ];
        }

        // 2 & 3. GWA checks
        if ($totalUnits > 0) {
            $overallGwa = round($totalWeighted / $totalUnits, 2);
            
            if ($overallGwa > 2.75) {
                $alerts[] = [
                    'type' => 'LOW_GWA',
                    'severity' => 'high',
                    'message' => "Overall GWA is {$overallGwa}, indicating serious academic performance issues."
                ];
            } elseif ($overallGwa > 2.5) {
                $alerts[] = [
                    'type' => 'PROBATION_RISK',
                    'severity' => 'medium',
                    'message' => "Overall GWA is {$overallGwa}, putting student at risk of academic probation."
                ];
            }
        }

        // 4. IRREGULAR_STATUS
        if (in_array($student->academic_status, ['irregular', 'probation'])) {
            $alerts[] = [
                'type' => 'IRREGULAR_STATUS',
                'severity' => $student->academic_status === 'probation' ? 'high' : 'low',
                'message' => "Student's registrar status is marked as " . strtoupper($student->academic_status) . "."
            ];
        }

        return $alerts;
    }
}
