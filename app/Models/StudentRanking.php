<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentRanking extends Model
{
    protected $fillable = [
        'student_id',
        'total_points',
        'engagement_score',
        'activity_count',
        'leadership_count',
        'rank',
        'course_rank',
        'top_category_id',
        'last_computed_at'
    ];

    protected $casts = [
        'last_computed_at' => 'datetime',
        'engagement_score' => 'decimal:2',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function topCategory()
    {
        return $this->belongsTo(ActivityCategory::class, 'top_category_id');
    }
}
