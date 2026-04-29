<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExtracurricularActivity extends Model
{
    protected $fillable = [
        'activity_category_id',
        'name',
        'description',
        'recommended_for_courses',
        'recommended_for_skills',
        'activity_type',
        'base_points',
        'is_active'
    ];

    protected $casts = [
        'recommended_for_courses' => 'array',
        'recommended_for_skills' => 'array',
        'is_active' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(ActivityCategory::class, 'activity_category_id');
    }

    public function studentActivities()
    {
        return $this->hasMany(StudentActivity::class);
    }

    public function getRecommendedForCoursesAttribute($value)
    {
        return json_decode($value, true) ?: [];
    }

    public function getRecommendedForSkillsAttribute($value)
    {
        return json_decode($value, true) ?: [];
    }
}
