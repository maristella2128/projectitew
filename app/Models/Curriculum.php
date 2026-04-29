<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Curriculum extends Model
{
    protected $fillable = [
        'name', 'program_id', 'effective_year', 'status', 'description',
    ];

    protected $appends = ['total_units'];

    public function getTotalUnitsAttribute()
    {
        return $this->courses->sum(function($c) {
            return ($c->lec_units ?? 0) + ($c->lab_units ?? 0);
        });
    }

    public function program()
    {
        return $this->belongsTo(\App\Models\Program::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'curriculum_courses')
            ->withPivot('year_level', 'semester', 'order')
            ->withTimestamps()
            ->orderBy('curriculum_courses.year_level')
            ->orderBy('curriculum_courses.semester')
            ->orderBy('curriculum_courses.order');
    }

    // Get courses grouped by year level then semester
    public function getGroupedCoursesAttribute()
    {
        return $this->courses->groupBy('pivot.year_level')
            ->map(fn($yearGroup) => $yearGroup->groupBy('pivot.semester'));
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }
}
