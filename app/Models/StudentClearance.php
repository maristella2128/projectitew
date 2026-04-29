<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentClearance extends Model
{
    protected $fillable = [
        'student_id', 'status', 'cleared_for', 'hold_reason',
        'last_evaluated_at', 'evaluated_by', 'override_note'
    ];

    protected $casts = [
        'cleared_for' => 'array',
        'last_evaluated_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function getClearedForAttribute($value)
    {
        $decoded = json_decode($value, true);
        return is_array($decoded) ? $decoded : [];
    }

    public function getStatusLabelAttribute()
    {
        return match($this->status) {
            'cleared' => 'Cleared',
            'pending_issues' => 'With Pending Issues',
            'under_disciplinary_action' => 'Under Disciplinary Action',
            'hold' => 'Hold',
            default => 'Unknown',
        };
    }

    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'cleared' => '#10b981',
            'pending_issues' => '#f59e0b',
            'under_disciplinary_action' => '#ef4444',
            'hold' => '#f97316',
            default => '#6b7280',
        };
    }
}
