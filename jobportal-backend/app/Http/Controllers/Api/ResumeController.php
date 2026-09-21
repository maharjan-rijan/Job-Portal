<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resume;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ResumeController extends Controller
{

    public function show(Request $request)
    {
        $resume = $request->user()->resume;

        if (!$resume) {
            return response()->json(['message' => 'No resume yet'], 404);
        }

        return response()->json($resume);
    }


    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string',
            'location' => 'nullable|string',
            'website' => 'nullable|string',
            'expectedSalary' => 'nullable|string',

            'education' => 'required|array|min:1',
            'education.*.degree' => 'required|string',
            'education.*.fieldOfStudy' => 'required|string',
            'education.*.school' => 'required|string',
            'education.*.from' => 'required|string',
            'education.*.to' => 'required|string',
            'education.*.description' => 'nullable|string',

            'experience' => 'nullable|array',
            'experience.*.companyName' => 'required_with:experience|string',
            'experience.*.jobTitle' => 'required_with:experience|string',
            'experience.*.from' => 'required_with:experience|string',
            'experience.*.to' => 'required_with:experience|string',
            'experience.*.description' => 'nullable|string',

            'socialLinks' => 'nullable|array',
            'socialLinks.*.platform' => 'required_with:socialLinks|string',
            'socialLinks.*.url' => 'required_with:socialLinks|url',

            'achievements' => 'nullable|array',
            'achievements.*.title' => 'required_with:achievements|string',
            'achievements.*.issuer' => 'nullable|string',
            'achievements.*.date' => 'nullable|string',
            'achievements.*.description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $resume = $request->user()->resume()->updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'title' => $request->title,
                'location' => $request->location,
                'website' => $request->website,
                'expected_salary' => $request->expectedSalary,
                'education' => $request->education,
                'experience' => $request->experience ?? [],
                'social_links' => $request->socialLinks ?? [],
                'achievements' => $request->achievements ?? [],
            ]
        );

        return response()->json($resume->fresh());
    }


    public function index(Request $request)
    {
        $query = Resume::query()->with('user')->latest();

        if ($request->filled('q')) {
            $keyword = $request->q;
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                  ->orWhere('location', 'like', "%{$keyword}%");
            });
        }

        return response()->json($query->get());
    }

    public function showById(Resume $resume)
    {
        return response()->json($resume);
    }
}
