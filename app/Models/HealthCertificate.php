<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthCertificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'health_record_id', 'certificate_type', 'condition_start', 'condition_end',
        'issued_date', 'issued_by', 'pdf_path', 'is_valid',
    ];

    protected $casts = [
        'condition_start' => 'date',
        'condition_end'   => 'date',
        'issued_date'    => 'date',
        'is_valid'       => 'boolean',
    ];

    public function healthRecord()
    {
        return $this->belongsTo(HealthRecord::class);
    }
}
