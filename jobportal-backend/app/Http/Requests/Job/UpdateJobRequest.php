<?php

namespace App\Http\Requests\Job;

use App\Http\Requests\ApiFormRequest;


class UpdateJobRequest extends ApiFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    use HasJobDetailRules;

    public function rules(): array
    {
        return array_merge($this->commonJobRules(), [
            'title' => 'sometimes|string|min:3',
            'type' => 'sometimes|string',
            'location' => 'sometimes|string|min:2',
            'vacancies' => 'sometimes|integer|min:1',
            'description' => 'sometimes|string|min:20',
            'status' => 'sometimes|in:Open,Closed',
        ]);
    }
}
