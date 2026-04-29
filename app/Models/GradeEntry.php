<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GradeEntry extends Model
{
    protected $fillable = [
        'student_id', 'section_id', 'curriculum_course_id', 'subject_code', 'subject_name', 'units', 'academic_year', 'semester',
        'prelim', 'midterm', 'final', 'computed_grade', 'gwa_equivalent',
        'status', 'encoded_by', 'submitted_at', 'approved_by', 'approved_at', 'locked_by', 'locked_at'
    ];

    public function curriculumCourse()
    {
        return $this->belongsTo(CurriculumCourse::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function encodedBy()
    {
        return $this->belongsTo(User::class, 'encoded_by');
    }
}
