<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityEnrollment extends Model
{
    use HasFactory;

    protected $fillable = ['activity_id', 'student_id', 'status', 'joined_at', 'completed_at'];

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
