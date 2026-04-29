<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SemesterRecord extends Model
{
    use HasFactory;

    protected $fillable = ['student_id', 'academic_year', 'semester', 'computed_gwa'];

    protected $appends = ['gwa', 'honors_eligibility'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function subjects()
    {
        return $this->hasMany(SemesterSubject::class);
    }

    /**
     * Compute GWA: sum(grade * units) / sum(units)
     */
    public function getGwaAttribute()
    {
        $subjects = $this->subjects()
            ->whereNotNull('grade')
            ->whereIn('status', ['passed', 'failed']) // Only completed subjects contribute to GWA
            ->get();
        
        if ($subjects->isEmpty()) {
            return null;
        }

        $totalWeightedGrades = $subjects->sum(fn($s) => $s->grade * $s->units);
        $totalUnits = $subjects->sum('units');

        return $totalUnits > 0 ? round($totalWeightedGrades / $totalUnits, 2) : 0;
    }

    /**
     * Scope for filtering by student
     */
    public function scopeForStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    public function getHonorsEligibilityAttribute()
    {
        $gwa = $this->gwa;
        if ($gwa === null) return null;

        $subjects = $this->subjects;

        // No failed or dropped subjects
        $hasFailedOrDropped = $subjects->contains(fn($s) => in_array($s->status, ['failed', 'dropped']));
        if ($hasFailedOrDropped) return null;

        // Must have >= 15 units enrolled (we exclude dropped subjects just to be safe, though handled above)
        $totalUnitsEnrolled = $subjects->where('status', '!=', 'dropped')->sum('units');

        if ($gwa <= 1.75 && $totalUnitsEnrolled >= 15) {
            return 'deans_list';
        }

        return null;
    }
}
