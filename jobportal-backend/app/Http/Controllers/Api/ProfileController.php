<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;

class ProfileController extends Controller
{
    public function update(ProfileUpdateRequest $request)
    {
        $user = $request->user();

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'avatar_url' => $request->has('avatar_url') ? $request->avatar_url : $user->avatar_url,
        ]);

        if ($user->role === 'employer' && $request->has('company')) {
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
