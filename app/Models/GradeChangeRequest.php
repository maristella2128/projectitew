<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GradeChangeRequest extends Model
{
    protected $fillable = [
        'grade_entry_id', 'requested_by', 'reason', 'attachment_path',
        'status', 'reviewed_by', 'reviewed_at'
    ];

    public function gradeEntry()
    {
        return $this->belongsTo(GradeEntry::class);
    }

    public function requestedBy()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }
}
