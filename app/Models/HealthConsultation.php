<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthConsultation extends Model
{
    use HasFactory;

    protected $fillable = [
        'health_record_id', 'chief_complaint', 'symptoms', 'vital_signs',
        'diagnosis', 'icd_code', 'prescribed_medication', 'attending_physician',
    ];

    protected $casts = [
        'vital_signs' => 'array',
    ];

    public function healthRecord()
    {
        return $this->belongsTo(HealthRecord::class);
    }
}
