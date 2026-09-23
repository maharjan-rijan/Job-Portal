<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Job\StoreJobRequest;
use App\Http\Requests\Job\UpdateJobRequest;
use App\Models\JobPost;
use Illuminate\Http\Request;

class JobController extends Controller
{
    /** camelCase request keys that don't match their snake_case DB column. */
    private const FIELD_MAP = [
        'salaryMin' => 'salary_min',
        'salaryMax' => 'salary_max',
        'experienceLevel' => 'experience_level',
        'applicationDeadline' => 'application_deadline',
    ];

    public function index(Request $request)
    {
        $query = JobPost::query()->with('employer.company')->where('status', 'Open')->latest();

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

    public function store(StoreJobRequest $request)
    {
        // Unset fields default to an empty array on create, matching the
        // column defaults (JSON columns) rather than being left out.
        $data = $this->mapJobData($request->validated()) + [
            'responsibilities' => [],
            'requirements' => [],
            'benefits' => [],
        ];

        $job = $request->user()->jobPosts()->create($data);

        return response()->json($job, 201);
    }

    public function update(UpdateJobRequest $request, JobPost $job)
    {
        $this->authorize('update', $job);

        // Only the keys actually present in the (sometimes-validated) input
        // are included here, so omitted fields keep their existing value —
        // no manual "$request->x ?? $job->x" fallback needed per field.
        $job->update($this->mapJobData($request->validated()));

        return response()->json($job);
    }

    public function destroy(Request $request, JobPost $job)
    {
        $this->authorize('delete', $job);

        $job->delete();

        return response()->json(['message' => 'Job deleted']);
    }

    /** Renames the request's camelCase keys to the model's snake_case columns. */
    private function mapJobData(array $validated): array
    {
        $data = [];
        foreach ($validated as $key => $value) {
            $data[self::FIELD_MAP[$key] ?? $key] = $value;
        }
        return $data;
    }
}
