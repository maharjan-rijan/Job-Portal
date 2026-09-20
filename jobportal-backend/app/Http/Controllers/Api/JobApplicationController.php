<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\JobPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobApplicationController extends Controller
{
    /** POST /jobs/{job}/applications — any authenticated user can apply. */
    public function store(Request $request, JobPost $job)
    {
        $validator = Validator::make($request->all(), [
            'fullName' => 'required|string|min:2',
            'email' => 'required|email',
            'resumeUrl' => 'required|url',
            'coverNote' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $application = $job->applications()->create([
            'seeker_id' => $request->user()->id,
            'full_name' => $request->fullName,
            'email' => $request->email,
            'resume_url' => $request->resumeUrl,
            'cover_note' => $request->coverNote,
        ]);

        return response()->json($application, 201);
    }

    /** GET /applications — employer-only, scoped to their own jobs. */
    public function index(Request $request)
    {
        $query = JobApplication::query()
            ->whereHas('job', fn ($q) => $q->where('employer_id', $request->user()->id))
            ->with('job')
            ->latest();

        if ($request->filled('jobId')) {
            $query->where('job_post_id', $request->jobId);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->get());
    }

    /** PATCH /applications/{application}/status — employer-only, must own the job. */
    public function updateStatus(Request $request, JobApplication $application)
    {
        if ($application->job->employer_id !== $request->user()->id) {
            return response()->json(['message' => 'You do not own this job'], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:applied,shortlisted,interview,rejected,hired',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $application->update(['status' => $request->status]);

        return response()->json($application->load('job'));
    }
}
