<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'section_id',
        'title',
        'content',
        'type',
        'expires_at',
        'scheduled_at',
        'is_pinned',
        'target_audience',
        'status',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'is_pinned' => 'boolean',
        'target_audience' => 'array',
        'expires_at' => 'datetime',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function reads()
    {
        return $this->belongsToMany(Student::class, 'announcement_reads')
                    ->withPivot('read_at')
                    ->withTimestamps();
    }
}
