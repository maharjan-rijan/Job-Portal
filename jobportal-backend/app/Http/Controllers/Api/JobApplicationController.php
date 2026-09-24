<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobApplication\StoreJobApplicationRequest;
use App\Http\Requests\JobApplication\UpdateJobApplicationStatusRequest;
use App\Models\JobApplication;
use App\Models\JobPost;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    /** POST /jobs/{job}/applications — any authenticated user can apply. */
    public function store(StoreJobApplicationRequest $request, JobPost $job)
    {
        $alreadyApplied = $job->applications()
            ->where('seeker_id', $request->user()->id)
            ->exists();

        if ($alreadyApplied) {
            return response()->json(['message' => 'You have already applied to this job'], 422);
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
            ->whereHas('job', fn($q) => $q->where('employer_id', $request->user()->id))
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

    public function mine(Request $request)
    {
        $applications = JobApplication::query()
            ->where('seeker_id', $request->user()->id)
            ->with('job.employer.company')
            ->latest()
            ->get();

        return response()->json($applications);
    }


    /** PATCH /applications/{application}/status — employer-only, must own the job. */
    public function updateStatus(UpdateJobApplicationStatusRequest $request, JobApplication $application)
    {
        $this->authorize('updateStatus', $application);

        $application->update(['status' => $request->status]);

        return response()->json($application->load('job'));
    }
}
