<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'candidate_id', 'section_id', 'student_id', 'first_name', 'last_name', 'middle_name',
        'email', 'birthdate', 'gender', 'address', 'photo', 'guardian_name',
        'guardian_contact', 'guardian_relationship', 'course', 'major', 'year_level', 'academic_status',
        'enrollment_status', 'status', 'school_year', 'skills', 'activities',
        'registration_code', 'registration_code_used', 'registration_code_expires_at', 'program_id', 'curriculum_id'
    ];

    protected $appends = ['name', 'registration_status', 'academic_status_color', 'latin_honors', 'total_activity_points', 'engagement_score'];

    protected $casts = [
        'skills'     => 'array',
        'activities' => 'array',
        'registration_code_expires_at' => 'datetime',
        'registration_code_used' => 'boolean',
    ];

    public function getNameAttribute()
    {
        return trim("{$this->first_name} " . ($this->middle_name ? $this->middle_name . ' ' : '') . "{$this->last_name}");
    }

    public function getRegistrationStatusAttribute()
    {
        if ($this->registration_code_used || is_null($this->registration_code)) {
            return 'registered';
        }

        if ($this->registration_code_expires_at && $this->registration_code_expires_at->isPast()) {
            return 'expired';
        }

        return 'pending';
    }

    public function getAcademicStatusColorAttribute()
    {
        return match ($this->academic_status) {
            'regular'    => 'green',
            'irregular'  => 'amber',
            'probation'  => 'red',
            'graduated'  => 'teal',
            default      => 'muted',
        };
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    public function curriculum()
    {
        return $this->belongsTo(Curriculum::class);
    }

    public function attendance()
    {
        return $this->hasMany(Attendance::class);
    }

    public function behaviorLogs()
    {
        return $this->hasMany(BehaviorLog::class);
    }

    public function conductScore()
    {
        return $this->hasOne(StudentConductScore::class);
    }

    public function clearance()
    {
        return $this->hasOne(StudentClearance::class);
    }

    public function clearanceEntries()
    {
        return $this->hasMany(StudentClearanceEntry::class);
    }

    public function conductAlerts()
    {
        return $this->hasMany(ConductAlert::class);
    }

    public function healthRecords()
    {
        return $this->hasMany(HealthRecord::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function studentDocuments()
    {
        return $this->hasMany(StudentDocument::class);
    }

    public function achievements()
    {
        return $this->hasMany(Achievement::class);
    }

    public function semesterRecords()
    {
        return $this->hasMany(SemesterRecord::class);
    }

    public function getLatinHonorsAttribute()
    {
        $records = $this->semesterRecords;
        if ($records->isEmpty()) return null;

        $totalWeighted = 0;
        $totalUnits = 0;

        foreach ($records as $record) {
            $relevantSubjects = $record->subjects->whereIn('status', ['passed', 'failed']);
            foreach ($relevantSubjects as $subject) {
                if ($subject->grade !== null) {
                    $totalWeighted += ($subject->grade * $subject->units);
                    $totalUnits += $subject->units;
                }
            }
        }

        if ($totalUnits == 0) return null;

        $overallGwa = round($totalWeighted / $totalUnits, 2);

        if ($overallGwa <= 1.25) return 'Summa Cum Laude';
        if ($overallGwa <= 1.50) return 'Magna Cum Laude';
        if ($overallGwa <= 1.75) return 'Cum Laude';

        return null;
    }

    public function capstoneProjects()
    {
        return $this->belongsToMany(CapstoneProject::class, 'capstone_members')->withPivot('role')->withTimestamps();
    }

    public function studentActivities()
    {
        return $this->hasMany(StudentActivity::class);
    }

    public function studentSkills()
    {
        return $this->hasMany(StudentSkill::class);
    }

    public function ranking()
    {
        return $this->hasOne(StudentRanking::class);
    }

    public function pointLogs()
    {
        return $this->hasMany(ActivityPointLog::class);
    }

    public function getTotalActivityPointsAttribute()
    {
        return $this->studentActivities()->where('status', '!=', 'dropped')->sum('points_awarded');
    }

    public function getEngagementScoreAttribute()
    {
        $totalPoints = $this->total_activity_points;
        $uniqueCategories = $this->studentActivities()
            ->where('status', '!=', 'dropped')
            ->join('extracurricular_activities', 'student_activities.extracurricular_activity_id', '=', 'extracurricular_activities.id')
            ->distinct()
            ->count('extracurricular_activities.activity_category_id');

        return $totalPoints + ($uniqueCategories * 5);
    }

    public function readAnnouncements()
    {
        return $this->belongsToMany(Announcement::class, 'announcement_reads')
                    ->withPivot('read_at')
                    ->withTimestamps();
    }
}
