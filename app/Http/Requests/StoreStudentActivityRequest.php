<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_id'                    => 'required|exists:students,id',
            'extracurricular_activity_id'   => 'required|exists:extracurricular_activities,id',
            'role'                          => 'required|string|in:member,participant,officer,coach,president,winner',
            'academic_year'                 => ['required', 'string', 'regex:/^\d{4}-\d{4}$/'],
            'semester'                      => 'nullable|integer|in:1,2,3',
            'status'                        => 'nullable|string|in:ongoing,completed,withdrawn',
            'achievement'                   => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'student_id.required'                   => 'A student must be selected.',
            'student_id.exists'                     => 'Selected student does not exist.',
            'extracurricular_activity_id.required'  => 'An activity must be selected.',
            'extracurricular_activity_id.exists'    => 'Selected activity does not exist.',
            'role.in'                               => 'Role must be: member, participant, officer, coach, president, or winner.',
            'academic_year.regex'                   => 'Academic year must be in format YYYY-YYYY (e.g. 2024-2025).',
        ];
    }
}
