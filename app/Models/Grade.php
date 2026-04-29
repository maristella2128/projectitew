<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id', 'subject', 'semester', 'score', 'remarks', 'recorded_by',
        'curriculum_course_id', 'course_id', 'grade_value', 'status'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function curriculumCourse()
    {
        return $this->belongsTo(CurriculumCourse::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function recorder()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
