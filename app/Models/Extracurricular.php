<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Extracurricular extends Model
{
    protected $fillable = [
        'student_id',
        'activity_name',
        'category',
        'role',
        'start_date',
        'end_date',
        'description',
        'achievements'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
