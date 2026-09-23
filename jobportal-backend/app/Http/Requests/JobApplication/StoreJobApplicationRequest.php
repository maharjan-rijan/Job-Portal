<?php

namespace App\Http\Requests\JobApplication;

use App\Http\Requests\ApiFormRequest;

class StoreJobApplicationRequest extends ApiFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function rules(): array
    {
        return [
            'fullName' => 'required|string|min:2',
            'email' => 'required|email',
            'resumeUrl' => 'required|url',
            'coverNote' => 'nullable|string|max:500',
        ];
    }
}
