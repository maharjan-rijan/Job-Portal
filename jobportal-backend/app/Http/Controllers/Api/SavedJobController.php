<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPost;
use Illuminate\Http\Request;

class SavedJobController extends Controller
{
    public function index(Request $request)
    {
        $jobs = $request->user()
            ->savedJobs()
            ->with('employer.company')
            ->orderByDesc('saved_jobs.created_at')
            ->get();

        return response()->json($jobs);
    }

    public function store(Request $request, JobPost $job)
    {
        $request->user()->savedJobs()->syncWithoutDetaching([$job->id]);

        return response()->json(['message' => 'Job saved'], 201);
    }

    public function destroy(Request $request, JobPost $job)
    {
        $request->user()->savedJobs()->detach($job->id);

        return response()->json(['message' => 'Job removed from saved jobs']);
    }
}
