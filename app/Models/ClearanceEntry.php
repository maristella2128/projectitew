<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClearanceEntry extends Model
{
    protected $fillable = [
        'student_id', 'semester_record_id', 'department_id',
        'status', 'note', 'cleared_by', 'cleared_at'
    ];

    public function department()
    {
        return $this->belongsTo(ClearanceDepartment::class, 'department_id');
    }

    public function clearedBy()
    {
        return $this->belongsTo(User::class, 'cleared_by');
    }
}
