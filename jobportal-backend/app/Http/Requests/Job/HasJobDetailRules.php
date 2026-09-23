<?php

namespace App\Http\Requests\Job;

trait HasJobDetailRules
{
    /**
     * Determine if the user is authorized to make this request.
     */
    protected function commonJobRules(): array
    {
        return [
            'salaryMin' => 'nullable|numeric|min:0',
            'salaryMax' => 'nullable|numeric|min:0',
            'experienceLevel' => 'nullable|string',
            'applicationDeadline' => 'nullable|date',
            'responsibilities' => 'nullable|array',
            'requirements' => 'nullable|array',
            'benefits' => 'nullable|array',
        ];
    }
}
