<?php

namespace App\Http\Requests\JobApplication;

use App\Http\Requests\ApiFormRequest;

class StoreJobApplicationRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'fullName' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            // Both optional on their own — the withValidator() check below
            // requires at least one.
            'resumeUrl' => ['nullable', 'url'],
            'resumeFile' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'], // 5MB
            'coverNote' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if (! $this->filled('resumeUrl') && ! $this->hasFile('resumeFile')) {
                $validator->errors()->add(
                    'resumeFile',
                    'Upload a resume file or paste a link to your resume.',
                );
            }
        });
    }
}
