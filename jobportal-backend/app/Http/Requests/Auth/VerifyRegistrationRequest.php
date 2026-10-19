<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\ApiFormRequest;

class VerifyRegistrationRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'otp' => 'required|digits:6',
        ];
    }
}
