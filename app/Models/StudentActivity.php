<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentActivity extends Model
{
    protected $fillable = [
        'student_id',
        'extracurricular_activity_id',
        'role',
        'academic_year',
        'semester',
        'status',
        'achievement',
        'points_awarded'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function activity()
    {
        return $this->belongsTo(ExtracurricularActivity::class, 'extracurricular_activity_id');
    }

    public function getRoleMultiplierAttribute()
    {
        return match ($this->role) {
            'member', 'participant' => 1,
            'officer', 'coach'      => 2,
            'president', 'winner'   => 3,
            default                 => 1,
        };
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($studentActivity) {
            if ($studentActivity->activity) {
                $studentActivity->points_awarded = $studentActivity->activity->base_points * $studentActivity->role_multiplier;
            } elseif ($studentActivity->extracurricular_activity_id) {
                $activity = ExtracurricularActivity::find($studentActivity->extracurricular_activity_id);
                if ($activity) {
                    $studentActivity->points_awarded = $activity->base_points * $studentActivity->role_multiplier;
                }
            }
        });
    }
}
