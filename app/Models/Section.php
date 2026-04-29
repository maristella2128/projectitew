<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'grade_level', 'school_year', 'semester', 'max_capacity', 
        'adviser_id', 'program_id', 'curriculum_id', 'schedule_approved', 'has_suggested_schedule'
    ];

    public function curriculum()
    {
        return $this->belongsTo(Curriculum::class);
    }

    public function adviser()
    {
        return $this->belongsTo(User::class, 'adviser_id');
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
