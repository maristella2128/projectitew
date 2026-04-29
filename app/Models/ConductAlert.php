<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConductAlert extends Model
{
    protected $fillable = [
        'student_id', 'behavior_log_id', 'alert_type', 'severity', 'message',
        'is_read', 'is_resolved', 'resolved_by', 'resolved_at'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function behaviorLog()
    {
        return $this->belongsTo(BehaviorLog::class);
    }

    public function scopeUnresolved($query)
    {
        return $query->where('is_resolved', false);
    }

    public function scopeForStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }
}
