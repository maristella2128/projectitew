<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResolveBehaviorLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'resolution_status' => 'required|in:resolved,dismissed,escalated',
            'resolution_notes'  => 'required|string|min:10|max:1000',
        ];
    }
}
