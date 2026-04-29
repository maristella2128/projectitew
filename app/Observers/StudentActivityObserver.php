<?php

namespace App\Observers;

use App\Models\StudentActivity;
use App\Models\ActivityPointLog;
use App\Services\PointsCalculatorService;

class StudentActivityObserver
{
    protected $service;

    public function __construct(PointsCalculatorService $service)
    {
        $this->service = $service;
    }

    /**
     * Handle the StudentActivity "created" event.
     */
    public function created(StudentActivity $studentActivity): void
    {
        $this->handleRecalculation($studentActivity, "Earned points from: " . ($studentActivity->activity?->name ?: 'Activity'));
    }

    /**
     * Handle the StudentActivity "updated" event.
     */
    public function updated(StudentActivity $studentActivity): void
    {
        // Only log if points or status changed significantly, 
        // but prompt says "same as created"
        $this->handleRecalculation($studentActivity, "Updated points for: " . ($studentActivity->activity?->name ?: 'Activity'));
    }

    /**
     * Handle the StudentActivity "deleted" event.
     */
    public function deleted(StudentActivity $studentActivity): void
    {
        if ($studentActivity->student) {
            $this->service->recalculateForStudent($studentActivity->student);
        }
    }

    protected function handleRecalculation(StudentActivity $studentActivity, string $reason): void
    {
        $student = $studentActivity->student;
        if (!$student) return;

        // 1. Recalculate
        $this->service->recalculateForStudent($student);

        // 2. Log entry
        ActivityPointLog::create([
            'student_id' => $student->id,
            'student_activity_id' => $studentActivity->id,
            'points' => $studentActivity->points_awarded,
            'reason' => $reason,
            'academic_year' => $studentActivity->academic_year ?: 'N/A'
        ]);
    }
}
