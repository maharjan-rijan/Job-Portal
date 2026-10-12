<?php

namespace App\Jobs;

use App\Models\JobPost;
use App\Models\Notification;
use App\Models\Resume;
use App\Services\JobMatchingService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Scores one job post against every seeker's resume and notifies the
 * ones above JobMatchingService::NOTIFY_THRESHOLD. Dispatched by
 * MatchResumesToJob in response to the JobPosted event.
 *
 * Runs queued — if you don't have a queue worker running
 * (`php artisan queue:work`) and don't want to set one up for a student
 * demo, either call `ProcessJobMatch::dispatchSync($jobPost)` instead
 * of `dispatch()` wherever JobPosted fires, or drop `implements
 * ShouldQueue` here so it always runs inline.
 */
class ProcessJobMatch implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public JobPost $jobPost)
    {
    }

    public function handle(JobMatchingService $matcher): void
    {
        $jobText = $matcher->jobText($this->jobPost->toArray());

        // Chunked so this doesn't load every resume into memory at once
        // on a larger dataset.
        Resume::query()->chunk(50, function ($resumes) use ($matcher, $jobText) {
            foreach ($resumes as $resume) {
                $score = $matcher->score(
                    $matcher->resumeText($resume->toArray()),
                    $jobText
                );

                if ($score >= JobMatchingService::NOTIFY_THRESHOLD) {
                    Notification::create([
                        // Resume's FK to its owner is `user_id`, not
                        // `seeker_id` — matches your actual Resume model.
                        'user_id' => $resume->user_id,
                        'type' => 'job_match',
                        'data' => [
                            'job_id' => $this->jobPost->id,
                            'job_title' => $this->jobPost->title,
                            // employer is a User; the registered company
                            // name lives on the related Company model,
                            // not directly on User — falls back to the
                            // employer's own name if they haven't set
                            // up a company profile.
                            'company' => $this->jobPost->employer?->company?->name
                                ?? $this->jobPost->employer?->name
                                ?? null,
                            'score' => round($score, 2),
                        ],
                    ]);
                }
            }
        });
    }
}
