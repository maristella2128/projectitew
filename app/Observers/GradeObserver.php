<?php

namespace App\Observers;

use App\Models\Grade;
use App\Notifications\GradeWarning;

class GradeObserver
{
    public function created(Grade $grade): void
    {
        $this->checkGrade($grade);
    }

    public function updated(Grade $grade): void
    {
        $this->checkGrade($grade);
    }

    protected function checkGrade(Grade $grade): void
    {
        if ($grade->score < 75) {
            $student = $grade->student;
            if ($student && $student->user) {
                $student->user->notify(new GradeWarning($grade));
            }
            
            // Also notify the section teacher if any
            if ($student->section && $student->section->teacher_id) {
                // Assuming we want to notify the teacher too
                // $student->section->teacher->notify(new GradeWarning($grade));
            }
        }
    }
}
