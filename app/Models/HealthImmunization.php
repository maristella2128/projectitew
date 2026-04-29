<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthImmunization extends Model
{
    use HasFactory;

    protected $fillable = [
        'health_record_id', 'vaccine_name', 'brand', 'dose_number',
        'date_administered', 'next_due_date', 'administered_by', 'lot_number',
    ];

    protected $casts = [
        'date_administered' => 'date',
        'next_due_date'     => 'date',
    ];

    public function healthRecord()
    {
        return $this->belongsTo(HealthRecord::class);
    }
}
