<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'student_id', 
        'program_id',
        'folder_id',
        'section_id',
        'title', 
        'type', 
        'file_path', 
        'uploaded_by', 
        'visibility', 
        'uploaded_by_role'
    ];

    /**
     * Scope a query to only include documents visible to the user.
     */
    public function scopeVisibleTo($query, $user)
    {
        // Deans see everything
        if ($user->hasRole('dean')) {
            return $query;
        }

        return $query->where(function ($q) use ($user) {
            $q->where('visibility', 'everyone')
              ->orWhere(function ($q) use ($user) {
                  $q->where('visibility', 'professors')
                    ->whereRaw('? = ?', [$user->role, 'professor']); // Assuming 'role' column or check via Spatie
              })
              ->orWhere(function ($q) use ($user) {
                  $q->where('visibility', 'students')
                    ->whereRaw('? = ?', [$user->role, 'student']);
              })
              ->orWhere(function ($q) use ($user) {
                  $q->where('visibility', 'specific')
                    ->whereHas('permissions', function ($q) use ($user) {
                        $q->where('user_id', $user->id);
                    });
              })
              // Professors always see their own uploads
              ->orWhere('uploaded_by', $user->id);
        });
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function permissions()
    {
        return $this->belongsToMany(User::class, 'document_permissions', 'document_id', 'user_id')->withTimestamps();
    }

    public function folder()
    {
        return $this->belongsTo(Folder::class);
    }
}
