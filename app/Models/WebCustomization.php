<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebCustomization extends Model
{
    use HasFactory;

    protected $fillable = ['settings'];

    protected $casts = [
        'settings' => 'array',
    ];
}
