<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobApplication\StoreJobApplicationRequest;
use App\Http\Requests\JobApplication\UpdateJobApplicationStatusRequest;
use Illuminate\Support\Facades\Storage;
use App\Models\JobApplication;
use App\Models\JobPost;
use App\Models\Notification;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    /** POST /jobs/{job}/applications — any authenticated user can apply. */
    public function store(StoreJobApplicationRequest $request, JobPost $jobPost)
    {
        // ...your existing authorization / duplicate-application checks here...

        $resumeUrl = $request->resumeUrl;

        if ($request->hasFile('resumeFile')) {
            $path = $request->file('resumeFile')->store('resumes', 'public');
            $resumeUrl = Storage::url($path);
        }

        $application = $jobPost->applications()->create([
            'seeker_id' => $request->user()->id,
            'full_name' => $request->fullName,
            'email' => $request->email,
            'resume_url' => $resumeUrl,
            'cover_note' => $request->coverNote,
            'status' => 'applied',
        ]);

        Notification::create([
            'user_id' => $jobPost->employer_id,
            'type' => 'job_application',
            'data' => [
                'job_id' => $jobPost->id,
                'job_title' => $jobPost->title,
                'applicant_name' => $request->fullName,
                'application_id' => $application->id,
            ],
        ]);

        return response()->json($application->fresh());
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
        $validated = $request->validate([
            'status' => 'required|in:applied,shortlisted,interview,rejected,hired',
            'scheduled_at' => 'required_if:status,interview|nullable|date'
        ]);


        abort_if(
            $request->user()->id !== $application->job->employer_id
                && $request->user()->role !== 'admin',
            403
        );

        $application->update([
            'status' => $validated['status'],

            'scheduled_at' => $validated['status'] === 'interview'
                ? $validated['scheduled_at']
                : $application->scheduled_at,
        ]);



        if (in_array($validated['status'], ['shortlisted', 'interview', 'rejected', 'hired'])) {
            Notification::create([
                'user_id' => $application->seeker_id,
                'type' => 'application_status_changed',
                'data' => [
                    'application_id' => $application->id,
                    'job_id' => $application->job->id,
                    'job_title' => $application->job->title,

                    'company' => $application->job->employer?->company_name
                        ?? $application->job->employer?->name
                        ?? null,
                    'status' => $validated['status'],

                    'scheduled_at' => $validated['status'] === 'interview'
                        ? $validated['scheduled_at']
                        : null,
                ],
            ]);
        }

        return response()->json($application->fresh());
    }
}
