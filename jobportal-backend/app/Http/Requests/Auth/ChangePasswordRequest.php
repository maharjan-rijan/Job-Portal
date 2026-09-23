<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\ApiFormRequest;
class ChangePasswordRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'currentPassword' => 'required|string',
            'newPassword' => 'required|string|min:6',
            'confirmNewPassword' => 'required|string',
        ];
    }
}
