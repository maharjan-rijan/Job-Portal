<?php

namespace App\Console\Commands;

use App\Models\JobAlert;
use App\Models\JobPost;
use App\Models\Notification;
use App\Services\JobMatchingService;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class SendJobAlertDigests extends Command
{
    protected $signature = 'job-alerts:digest {frequency : Daily|Weekly|Monthly — matches JobAlert.frequency exactly}';

    protected $description = 'Score recent jobs against each seeker\'s resume for alerts due on this frequency, and notify above-threshold matches.';

    public function handle(JobMatchingService $matcher): int
    {
        $frequency = $this->argument('frequency');

        $since = match ($frequency) {
            'Daily' => Carbon::now()->subDay(),
            'Weekly' => Carbon::now()->subWeek(),
            'Monthly' => Carbon::now()->subMonth(),
            default => Carbon::now()->subDay(),
        };

        $recentJobs = JobPost::query()
            ->with('employer.company')
            ->where('status', 'Open')
            ->where('created_at', '>=', $since)
            ->get();

        if ($recentJobs->isEmpty()) {
            $this->info("No jobs posted since {$since->toDateString()} — nothing to digest.");
            return self::SUCCESS;
        }

        $alerts = JobAlert::where('frequency', $frequency)->with('seeker.resume')->get();
        $notified = 0;

        foreach ($alerts as $alert) {
            $resume = $alert->seeker?->resume;
            if (! $resume) {
                continue; // can't score without a resume
            }

            $resumeText = $matcher->resumeText($resume->toArray());


            $candidates = $recentJobs->filter(function ($job) use ($alert) {
                $matchesType = ! $alert->type || $job->type === $alert->type;
                $matchesKeywords = ! $alert->keywords || str_contains(
                    strtolower($job->title . ' ' . $job->description),
                    strtolower($alert->keywords)
                );
                return $matchesType && $matchesKeywords;
            });

            foreach ($candidates as $job) {
                $score = $matcher->score($resumeText, $matcher->jobText($job->toArray()));
                if ($score < JobMatchingService::NOTIFY_THRESHOLD) {
                    continue;
                }

                $alreadyNotified = Notification::where('user_id', $alert->seeker_id)
                    ->where('type', 'job_match')
                    ->whereJsonContains('data->job_id', $job->id)
                    ->exists();

                if ($alreadyNotified) {
                    continue;
                }

                Notification::create([
                    'user_id' => $alert->seeker_id,
                    'type' => 'job_match',
                    'data' => [
                        'job_id' => $job->id,
                        'job_title' => $job->title,
                        'company' => $job->employer?->company?->name
                            ?? $job->employer?->name
                            ?? null,
                        'score' => round($score, 2),
                        'source' => 'alert_digest',
                        'alert_name' => $alert->name,
                    ],
                ]);

                $notified++;
            }
        }

        $this->info("{$frequency} digest: sent {$notified} notification(s) across {$alerts->count()} alert(s).");
        return self::SUCCESS;
    }
}
