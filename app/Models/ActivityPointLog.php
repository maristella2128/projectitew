<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityPointLog extends Model
{
    protected $fillable = [
        'student_id',
        'student_activity_id',
        'points',
        'reason',
        'academic_year'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function studentActivity()
    {
        return $this->belongsTo(StudentActivity::class);
    }
}
