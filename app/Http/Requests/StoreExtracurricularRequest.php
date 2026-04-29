<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExtracurricularRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Gate-level auth is handled in the controller
    }

    public function rules(): array
    {
        $activityId = $this->route('extracurricular')?->id;

        return [
            'name'                      => 'required|string|max:255',
            'activity_category_id'      => 'required|exists:activity_categories,id',
            'description'               => 'nullable|string|max:1000',
            'activity_type'             => 'required|string|in:Event,Competition,Organization,Workshop,Seminar,Sport,Other',
            'base_points'               => 'required|integer|min:1|max:100',
            'recommended_for_courses'   => 'nullable|array',
            'recommended_for_courses.*' => 'string|max:100',
            'recommended_for_skills'    => 'nullable|array',
            'recommended_for_skills.*'  => 'string|max:100',
            'is_active'                 => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'                    => 'Activity name is required.',
            'activity_category_id.required'    => 'Please select a category.',
            'activity_category_id.exists'      => 'Selected category does not exist.',
            'base_points.min'                  => 'Base points must be at least 1.',
            'base_points.max'                  => 'Base points cannot exceed 100.',
            'activity_type.in'                 => 'Activity type must be one of: Event, Competition, Organization, Workshop, Seminar, Sport, Other.',
        ];
    }
}
