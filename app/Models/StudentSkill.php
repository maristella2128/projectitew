<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentSkill extends Model
{
    protected $fillable = ['student_id', 'skill', 'proficiency', 'source'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
