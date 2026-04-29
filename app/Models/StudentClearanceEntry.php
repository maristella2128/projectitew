<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentClearanceEntry extends Model
{
    protected $table = 'student_clearance_entries';

    protected $fillable = [
        'student_id', 'department_id', 'academic_year', 'semester',
        'status', 'note', 'hold_reason', 'cleared_by', 'cleared_at',
        'revoked_by', 'revoked_at', 'revoke_reason'
    ];

    public function department()
    {
        return $this->belongsTo(ClearanceDepartment::class, 'department_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
