<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentConductScore extends Model
{
    protected $fillable = [
        'student_id', 'total_score', 'violation_count', 'commendation_count',
        'high_severity_count', 'medium_severity_count', 'low_severity_count',
        'last_violation_at', 'last_commendation_at', 'last_computed_at'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function getScoreStatusAttribute()
    {
        if ($this->total_score >= 85) return 'good';
        if ($this->total_score >= 70) return 'fair';
        if ($this->total_score >= 50) return 'at_risk';
        return 'critical';
    }

    public function getScoreColorAttribute()
    {
        $status = $this->score_status; // uses the attribute defined above
        return match($status) {
            'good' => '#10b981',
            'fair' => '#f59e0b',
            'at_risk' => '#f97316',
            'critical' => '#ef4444',
            default => '#6b7280',
        };
    }
}
