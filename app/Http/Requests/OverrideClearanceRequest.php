<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OverrideClearanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:cleared,pending_issues,under_disciplinary_action,hold',
            'override_note' => 'required|string|min:10|max:500',
        ];
    }
}
