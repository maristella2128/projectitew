<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CapstoneProject extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'adviser_name', 'status', 'grade', 'academic_year', 'semester'];
    protected $appends = ['status_label', 'status_color'];

    public function members()
    {
        return $this->belongsToMany(Student::class, 'capstone_members')->withPivot('role')->withTimestamps();
    }

    public function getStatusLabelAttribute()
    {
        return ucwords(str_replace('_', ' ', $this->status));
    }

    public function getStatusColorAttribute()
    {
        return match ($this->status) {
            'proposal' => 'blue',
            'development' => 'amber',
            'pre_oral' => 'orange',
            'final_defense' => 'purple',
            'completed' => 'green',
            'failed' => 'red',
            default => 'muted',
        };
    }
}
