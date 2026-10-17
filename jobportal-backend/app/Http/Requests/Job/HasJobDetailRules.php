<?php

namespace App\Http\Requests\Job;

use App\Models\JobPost;

trait HasJobDetailRules
{
    /**
     * Rules shared by StoreJobRequest and UpdateJobRequest.
     */
    protected function commonJobRules(): array
    {
        // Max salary can't be below min — only checked when a min was sent
        // (gte against an empty field would always fail).
        $salaryMaxRules = ['nullable', 'numeric', 'min:0'];
        if ($this->filled('salaryMin')) {
            $salaryMaxRules[] = 'gte:salaryMin';
        }

        // Deadline can't be in the past. When editing, keeping the job's
        // existing deadline is allowed even if it has passed, so an
        // employer can still fix other fields on an expired listing.
        $deadlineRules = ['nullable', 'date'];
        $job = $this->route('job');
        $unchanged = $job instanceof JobPost
            && $job->application_deadline
            && $this->input('applicationDeadline')
            && $job->application_deadline->toDateString() === date('Y-m-d', strtotime($this->input('applicationDeadline')));

        if (! $unchanged) {
            $deadlineRules[] = 'after_or_equal:today';
        }

        return [
            'salaryMin' => 'nullable|numeric|min:0',
            'salaryMax' => $salaryMaxRules,
            'experienceLevel' => 'nullable|string',
            'applicationDeadline' => $deadlineRules,
            'responsibilities' => 'nullable|array',
            'requirements' => 'nullable|array',
            'benefits' => 'nullable|array',
        ];
    }

    public function messages(): array
    {
        return [
            'salaryMax.gte' => "Max salary can't be less than min salary.",
            'applicationDeadline.after_or_equal' => "Deadline can't be before today's date.",
        ];
    }
}
