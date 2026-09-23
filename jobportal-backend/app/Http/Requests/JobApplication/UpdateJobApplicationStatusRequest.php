<?php

namespace App\Http\Requests\JobApplication;

use App\Http\Requests\ApiFormRequest;

class UpdateJobApplicationStatusRequest extends ApiFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function rules(): array
    {
        return [
            'status' => 'required|in:applied,shortlisted,interview,rejected,hired',
        ];
    }
}
