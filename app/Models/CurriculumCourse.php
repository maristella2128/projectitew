<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CurriculumCourse extends Model
{
    protected $table = 'curriculum_courses';
    
    protected $fillable = [
        'curriculum_id', 'course_id', 'year_level', 'semester', 'order',
    ];

    public function curriculum()
    {
        return $this->belongsTo(Curriculum::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }
}
