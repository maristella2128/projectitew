<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CurriculumSubject extends Model
{
    use HasFactory;

    protected $fillable = [
        'course',
        'year_level',
        'semester',
        'subject_code',
        'subject_name',
        'units',
        'is_required',
        'prerequisite_code',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'year_level'  => 'integer',
        'semester'    => 'integer',
        'units'       => 'integer',
    ];

    /**
     * Scope: filter by course program.
     */
    public function scopeForCourse($query, string $course)
    {
        return $query->where('course', $course);
    }
}
