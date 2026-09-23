<?php

namespace App\Http\Requests;

class ResumeUpdateRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'title' => 'nullable|string',
            'location' => 'nullable|string',
            'website' => 'nullable|string',
            'expectedSalary' => 'nullable|string',

            'education' => 'required|array|min:1',
            'education.*.degree' => 'required|string',
            'education.*.fieldOfStudy' => 'required|string',
            'education.*.school' => 'required|string',
            'education.*.from' => 'required|string',
            'education.*.to' => 'required|string',
            'education.*.description' => 'nullable|string',

            'experience' => 'nullable|array',
            'experience.*.companyName' => 'required_with:experience|string',
            'experience.*.jobTitle' => 'required_with:experience|string',
            'experience.*.from' => 'required_with:experience|string',
            'experience.*.to' => 'required_with:experience|string',
            'experience.*.description' => 'nullable|string',

            'socialLinks' => 'nullable|array',
            'socialLinks.*.platform' => 'required_with:socialLinks|string',
            'socialLinks.*.url' => 'required_with:socialLinks|url',

            'achievements' => 'nullable|array',
            'achievements.*.title' => 'required_with:achievements|string',
            'achievements.*.issuer' => 'nullable|string',
            'achievements.*.date' => 'nullable|string',
            'achievements.*.description' => 'nullable|string',
        ];
    }
}
