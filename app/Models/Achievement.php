<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    use HasFactory;

    protected $fillable = [
        'channel',
        'team_name',
        'group_members',
        'student_id',
        'title',
        'description',
        'category',
        'tier',
        'date_awarded',
        'certificate_path',
    ];

    protected $casts = [
        'group_members' => 'array',
        'date_awarded' => 'date',
    ];

    protected $appends = ['certificate_url'];

    public function getCertificateUrlAttribute()
    {
        return $this->certificate_path ? asset('storage/' . $this->certificate_path) : null;
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
