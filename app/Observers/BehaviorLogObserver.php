<?php

namespace App\Observers;

use App\Models\BehaviorLog;
use App\Services\ConductAlertService;
use App\Services\ConductScoringService;

class BehaviorLogObserver
{
    protected $scoringService;
    protected $alertService;

    public function __construct(ConductScoringService $scoringService, ConductAlertService $alertService)
    {
        $this->scoringService = $scoringService;
        $this->alertService = $alertService;
    }

    public function created(BehaviorLog $log): void
    {
        $this->scoringService->computePointsForLog($log);
        $this->scoringService->recalculateScoreForStudent($log->student);
        $this->alertService->evaluateAlertsForLog($log);
        $this->scoringService->evaluateClearanceForStudent($log->student);
        $this->alertService->evaluateClearanceHoldAlert($log->student);
    }

    public function updated(BehaviorLog $log): void
    {
        $dirty = $log->getDirty();
        $shouldUpdate = false;

        if (array_key_exists('resolution_status', $dirty)) {
            if (in_array($log->resolution_status, ['resolved', 'dismissed'])) {
                $shouldUpdate = true;
            }
        }

        if (array_key_exists('points', $dirty)) {
            $shouldUpdate = true;
        }

        if ($shouldUpdate) {
            $this->scoringService->recalculateScoreForStudent($log->student);
            $this->scoringService->evaluateClearanceForStudent($log->student);
            $this->alertService->evaluateClearanceHoldAlert($log->student);
        }
    }

    public function deleted(BehaviorLog $log): void
    {
        $this->scoringService->recalculateScoreForStudent($log->student);
        $this->scoringService->evaluateClearanceForStudent($log->student);
        $this->alertService->evaluateClearanceHoldAlert($log->student);
    }
}
