<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'section_id',
        'teacher_id',
        'subject',
        'course_code',
        'lec_units',
        'lab_units',
        'day',
        'lec_day',
        'lab_day',
        'start_time',
        'end_time',
        'lec_start_time',
        'lec_end_time',
        'lab_start_time',
        'lab_end_time',
        'room',
        'lec_room',
        'lab_room',
        'is_manual',
        'schedule_approved',
    ];

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}
