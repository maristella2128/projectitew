<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthScreening extends Model
{
    use HasFactory;

    protected $fillable = [
        'health_record_id', 'school_year', 'semester', 'height_cm', 'weight_kg',
        'bmi', 'vision_result', 'hearing_result', 'blood_type', 'dental_status', 'clearance_status',
    ];

    protected $casts = [
        'height_cm' => 'decimal:2',
        'weight_kg' => 'decimal:2',
        'bmi'       => 'decimal:2',
    ];

    protected static function booted()
    {
        static::saving(function ($screening) {
            if ($screening->height_cm && $screening->weight_kg) {
                $h = $screening->height_cm / 100;
                $screening->bmi = round($screening->weight_kg / ($h * $h), 2);
            }
        });
    }

    public function healthRecord()
    {
        return $this->belongsTo(HealthRecord::class);
    }
}
