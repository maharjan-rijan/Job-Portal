<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JobPost;
use Illuminate\Support\Facades\Validator;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $query = JobPost::query()->where('status', 'Open')->latest();

        if ($request->filled('q')) {
            $query->where('title', 'like', '%' . $request->q . '%');
        }
        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        return response()->json($query->paginate(10));
    }

    public function show(JobPost $job)
    {
        return response()->json($job->load('employer.company'));
    }

    public function mine(Request $request)
    {
        $jobs = $request->user()
            ->jobPosts()
            ->latest()
            ->get()
            ->map(function ($job) {
                $job->applicants_count = 0;
                return $job;
            });

        return response()->json($jobs);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|min:3',
            'type' => 'required|string',
            'location' => 'required|string|min:2',
            'salaryMin' => 'nullable|numeric|min:0',
            'salaryMax' => 'nullable|numeric|min:0',
            'vacancies' => 'required|integer|min:1',
            'experienceLevel' => 'nullable|string',
            'applicationDeadline' => 'nullable|date',
            'description' => 'required|string|min:20',
            'responsibilities' => 'nullable|array',
            'requirements' => 'nullable|array',
            'benefits' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $job = $request->user()->jobPosts()->create([
            'title' => $request->title,
            'type' => $request->type,
            'location' => $request->location,
            'salary_min' => $request->salaryMin,
            'salary_max' => $request->salaryMax,
            'vacancies' => $request->vacancies,
            'experience_level' => $request->experienceLevel,
            'application_deadline' => $request->applicationDeadline,
            'description' => $request->description,
            'responsibilities' => $request->responsibilities ?? [],
            'requirements' => $request->requirements ?? [],
            'benefits' => $request->benefits ?? [],
        ]);

        return response()->json($job, 201);
    }

    public function update(Request $request, JobPost $job)
    {
        if ($job->employer_id !== $request->user()->id) {
            return response()->json(['message' => 'You do not own this job'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|min:3',
            'type' => 'sometimes|string',
            'location' => 'sometimes|string|min:2',
            'salaryMin' => 'nullable|numeric|min:0',
            'salaryMax' => 'nullable|numeric|min:0',
            'vacancies' => 'sometimes|integer|min:1',
            'experienceLevel' => 'nullable|string',
            'applicationDeadline' => 'nullable|date',
            'description' => 'sometimes|string|min:20',
            'responsibilities' => 'nullable|array',
            'requirements' => 'nullable|array',
            'benefits' => 'nullable|array',
            'status' => 'sometimes|in:Open,Closed',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $job->update([
            'title' => $request->title ?? $job->title,
            'type' => $request->type ?? $job->type,
            'location' => $request->location ?? $job->location,
            'salary_min' => $request->salaryMin ?? $job->salary_min,
            'salary_max' => $request->salaryMax ?? $job->salary_max,
            'vacancies' => $request->vacancies ?? $job->vacancies,
            'experience_level' => $request->experienceLevel ?? $job->experience_level,
            'application_deadline' => $request->applicationDeadline ?? $job->application_deadline,
            'description' => $request->description ?? $job->description,
            'responsibilities' => $request->responsibilities ?? $job->responsibilities,
            'requirements' => $request->requirements ?? $job->requirements,
            'benefits' => $request->benefits ?? $job->benefits,
            'status' => $request->status ?? $job->status,
        ]);

        return response()->json($job);
    }

    public function destroy(Request $request, JobPost $job)
    {
        if ($job->employer_id !== $request->user()->id) {
            return response()->json(['message' => 'You do not own this job'], 403);
        }

        $job->delete();

        return response()->json(['message' => 'Job deleted']);
    }
}
