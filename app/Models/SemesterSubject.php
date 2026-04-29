<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SemesterSubject extends Model
{
    use HasFactory;

    protected $fillable = [
        'semester_record_id', 'curriculum_course_id', 'subject_code', 'subject_name', 
        'units', 'prelim_grade', 'midterm_grade', 'final_grade',
        'grade', 'gwa_equivalent', 'status', 'is_retake', 'grading_status', 'is_locked'
    ];

    public function semesterRecord()
    {
        return $this->belongsTo(SemesterRecord::class);
    }
}
