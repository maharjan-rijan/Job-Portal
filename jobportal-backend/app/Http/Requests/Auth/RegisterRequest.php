<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\ApiFormRequest;
class RegisterRequest extends ApiFormRequest
{
   public function rules(): array
    {
        return [
            'name' => 'required|string|min:2',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:seeker,employer',
            'company_name' => 'required_if:role,employer|string|nullable',
        ];
    }
}
