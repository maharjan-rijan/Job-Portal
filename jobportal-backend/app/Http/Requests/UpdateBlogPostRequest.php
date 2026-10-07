<?php

namespace App\Http\Requests;

use App\Http\Requests\ApiFormRequest;

/** Same rules as creating one — a PUT replaces the whole post. */
class UpdateBlogPostRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'category' => ['required', 'string', 'min:2', 'max:100'],
            'author' => ['required', 'string', 'min:2', 'max:255'],
            'excerpt' => ['required', 'string', 'min:10', 'max:300'],
            'content' => ['required', 'string', 'min:50'],
        ];
    }
}
