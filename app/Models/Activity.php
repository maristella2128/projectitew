<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'type', 'category', 'description',
        'points', 'max_slots', 'status', 'is_recurring',
        'start_date', 'end_date', 'created_by', 'advisor_id',
    ];

    protected $casts = [
        'is_recurring' => 'boolean',
        'start_date'   => 'date',
        'end_date'     => 'date',
    ];

    // Relationships
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function advisor()
    {
        return $this->belongsTo(User::class, 'advisor_id');
    }

    public function enrollments()
    {
        return $this->hasMany(ActivityEnrollment::class);
    }

    public function points()
    {
        return $this->hasMany(StudentPoints::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeVisible($query)
    {
        return $query->whereIn('status', ['active', 'completed']);
    }

    // Helpers
    public function isFull(): bool
    {
        if (!$this->max_slots) return false;
        return $this->enrollments()->whereIn('status', ['enrolled', 'attended', 'completed'])->count() >= $this->max_slots;
    }

    public function currentSlots(): int
    {
        return $this->enrollments()->whereIn('status', ['enrolled', 'attended', 'completed'])->count();
    }

    public function isEnrolled(int $studentId): bool
    {
        return $this->enrollments()->where('student_id', $studentId)->exists();
    }
}
