<?php

namespace App\Http\Requests\Job;

use App\Http\Requests\ApiFormRequest;

class StoreJobAlertRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'keywords' => ['required', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:50'],
            'frequency' => ['required', 'string', 'in:Daily,Weekly,Monthly'],
        ];
    }
}
