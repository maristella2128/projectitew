<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BehaviorLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id', 'type', 'description', 'severity', 'date', 'logged_by',
        'category', 'points', 'resolution_status', 'resolved_at', 'resolved_by', 'resolution_notes'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function recorder()
    {
        return $this->belongsTo(User::class, 'logged_by');
    }

    public function resolver()
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    public function getCategoryLabelAttribute()
    {
        return ucwords(str_replace('_', ' ', $this->category));
    }

    public function getPointsColorAttribute()
    {
        if ($this->points > 0) {
            return '#10b981'; // positive
        } elseif ($this->points < 0) {
            return '#ef4444'; // negative
        }
        return '#6b7280'; // zero
    }

    public function getCategoryColorAttribute()
    {
        return match ($this->category) {
            'academic_misconduct' => '#ef4444', // red
            'behavioral_misconduct' => '#f97316', // orange
            'attendance' => '#f59e0b', // amber
            'dress_code' => '#8b5cf6', // purple
            'excellence' => '#10b981', // green
            'leadership' => '#14b8a6', // teal
            'community' => '#3b82f6', // blue
            default => '#6b7280', // gray
        };
    }
}
