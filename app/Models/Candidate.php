<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name', 'last_name', 'email', 'phone',
        'year_level_applied', 'strand', 'program_id',
        'registration_code', 'status', 'remarks',
        'student_id', 'registration_code_used',
        'registration_code_expires_at', 'form_submitted_at',
        'form_data',
    ];

    protected $casts = [
        'registration_code_used'       => 'boolean',
        'registration_code_expires_at' => 'datetime',
        'form_submitted_at'            => 'datetime',
        'form_data'                    => 'array',
    ];

    /**
     * Returns true if the candidate has already submitted their enrollment form
     * (i.e. they are past the initial pending stage).
     */
    public function isFormSubmitted(): bool
    {
        return in_array($this->status, ['form_submitted', 'accepted', 'enrolled']);
    }

    /**
     * Returns true only when the candidate has been formally accepted and is
     * eligible to proceed with enrollment.
     */
    public function canEnroll(): bool
    {
        return $this->status === 'accepted';
    }

    /**
     * Relationship to the Student record created upon enrollment.
     */
    public function student()
    {
        return $this->hasOne(Student::class);
    }
}
