<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'code', 'name', 'description',
        'lec_units', 'lab_units',
        'type', 'department',
        'pre_requisite_id', 'is_active',
    ];

    public function preRequisite()
    {
        return $this->belongsTo(Course::class, 'pre_requisite_id');
    }

    public function curricula()
    {
        return $this->belongsToMany(Curriculum::class, 'curriculum_courses')
            ->withPivot('year_level', 'semester', 'order')
            ->withTimestamps();
    }

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }
}
