<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthAllergy extends Model
{
    use HasFactory;

    protected $fillable = [
        'health_record_id', 'allergy_type', 'allergen', 'severity',
        'chronic_illness', 'emergency_medication', 'emergency_contact_name',
        'emergency_contact_phone', 'show_alert_to_professors',
    ];

    protected $casts = [
        'show_alert_to_professors' => 'boolean',
    ];

    public function healthRecord()
    {
        return $this->belongsTo(HealthRecord::class);
    }
}
