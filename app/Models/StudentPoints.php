<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentPoints extends Model
{
    use HasFactory;

    protected $fillable = ['student_id', 'activity_id', 'points_awarded', 'reason', 'awarded_at'];

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
