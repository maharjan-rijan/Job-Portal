<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:2',
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'company' => 'sometimes|array',
            'company.name' => 'required_with:company|string|min:2',
            'company.website' => 'nullable|string',
            'company.industry' => 'nullable|string',
            'company.location' => 'nullable|string',
            'company.description' => 'nullable|string|max:1000',
            // base64 data URI, not a URL — validated as a plain string,
            // sized generously since it can legitimately be a few hundred KB
            'company.logo_url' => 'nullable|string|max:5000000',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if ($request->has('company')) {
            $companyData = collect($request->input('company'))
                ->only(['name', 'website', 'industry', 'location', 'description', 'logo_url'])
                ->toArray();

            $user->company()->updateOrCreate(
                ['user_id' => $user->id],
                $companyData
            );
        }

        return response()->json($user->fresh()->load('company'));
    }
}
