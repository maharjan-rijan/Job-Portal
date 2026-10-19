<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\ApiFormRequest;

class VerifyOtpRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'otp' => 'required|digits:6',
        ];
    }

    public function messages(): array
    {
        return ['otp.digits' => 'Enter the 6-digit code from your email'];
    }
}
