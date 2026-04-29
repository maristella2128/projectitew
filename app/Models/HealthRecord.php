<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HealthRecord extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id', 'created_by', 'record_type', 'status',
        'academic_block', 'notes', 'record_date', 'follow_up_date',
    ];

    protected $casts = [
        'record_date'     => 'date',
        'follow_up_date'  => 'date',
    ];

    // Relationships
    public function student()      { return $this->belongsTo(Student::class); }
    public function creator()      { return $this->belongsTo(User::class, 'created_by'); }
    public function consultation() { return $this->hasOne(HealthConsultation::class); }
    public function certificate()  { return $this->hasOne(HealthCertificate::class); }
    public function immunization() { return $this->hasOne(HealthImmunization::class); }
    public function incident()     { return $this->hasOne(HealthIncident::class); }
    public function screening()    { return $this->hasOne(HealthScreening::class); }
    public function allergy()      { return $this->hasOne(HealthAllergy::class); }

    // Helper: get the specific sub-record based on type
    public function detail()
    {
        return match($this->record_type) {
            'consultation'       => $this->consultation,
            'medical_certificate'=> $this->certificate,
            'immunization'       => $this->immunization,
            'incident'           => $this->incident,
            'health_screening'   => $this->screening,
            'allergy_condition'  => $this->allergy,
        };
    }

    // Scope: visible to professors (only allergy alerts)
    public function scopeForProfessor($query)
    {
        return $query->where('record_type', 'allergy_condition')
                     ->whereHas('allergy', fn($q) =>
                         $q->where('show_alert_to_professors', true)
                     );
    }

    // Scope: visible to students (own records only)
    public function scopeForStudent($query, int $studentId)
    {
        return $query->where('student_id', $studentId);
    }
}
