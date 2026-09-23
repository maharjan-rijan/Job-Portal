<?php

namespace App\Http\Requests\Job;

use App\Http\Requests\ApiFormRequest;

class StoreJobRequest extends ApiFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    use HasJobDetailRules;

    public function rules(): array
    {
        return array_merge($this->commonJobRules(), [
            'title' => 'required|string|min:3',
            'type' => 'required|string',
            'location' => 'required|string|min:2',
            'vacancies' => 'required|integer|min:1',
            'description' => 'required|string|min:20',
        ]);
    }
}
