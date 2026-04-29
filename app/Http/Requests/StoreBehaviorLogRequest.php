<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreBehaviorLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Gates used in controller
    }

    public function rules(): array
    {
        return [
            'student_id'  => 'required|exists:students,id',
            'type'        => 'required|in:violation,commendation',
            'severity'    => 'required|in:low,medium,high',
            'category'    => 'required|in:academic_misconduct,behavioral_misconduct,attendance,dress_code,excellence,leadership,community,other',
            'description' => 'required|string|min:10|max:2000',
            'logged_at'   => 'required|date|before_or_equal:now',
        ];
    }
}
