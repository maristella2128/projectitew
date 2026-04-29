<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $fillable = ['code', 'name', 'department', 'curriculum_version', 'total_units', 'active_curriculum_id', 'is_seeded'];

    public function activeCurriculum()
    {
        return $this->belongsTo(Curriculum::class, 'active_curriculum_id');
    }

    public function sections()
    {
        return $this->hasMany(Section::class);
    }
}
