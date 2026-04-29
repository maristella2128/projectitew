<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthIncident extends Model
{
    use HasFactory;

    protected $fillable = [
        'health_record_id', 'incident_type', 'location_on_campus', 'first_aid_given',
        'referred_to_hospital', 'hospital_name', 'witness_name', 'severity',
    ];

    protected $casts = [
        'referred_to_hospital' => 'boolean',
    ];

    public function healthRecord()
    {
        return $this->belongsTo(HealthRecord::class);
    }
}
