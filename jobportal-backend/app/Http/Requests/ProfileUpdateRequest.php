<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends ApiFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|min:2',
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($this->user()->id),
            ],
            'company' => 'sometimes|array',
            'company.name' => 'required_with:company|string|min:2',
            'company.website' => 'nullable|string',
            'company.industry' => 'nullable|string',
            'company.location' => 'nullable|string',
            'company.description' => 'nullable|string|max:1000',
           
            'company.logo_url' => 'nullable|string|max:5000000',
        ];
    }
}
