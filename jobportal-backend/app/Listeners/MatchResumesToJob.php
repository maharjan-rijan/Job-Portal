<?php

namespace App\Listeners;

use App\Events\JobPosted;
use App\Jobs\ProcessJobMatch;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Listens for JobPosted and hands off to ProcessJobMatch, which does
 * the actual resume-scoring work. Kept thin on purpose — the listener's
 * only job is "a job was posted, go score it", not the scoring itself.
 *
 * Laravel 11 auto-discovers this listener for JobPosted because its
 * handle() method is type-hinted to that event — no manual registration
 * needed (no EventServiceProvider in this project, which is normal for
 * a Laravel 11 slim skeleton). If you ever want to double-check it's
 * wired up: `php artisan event:list` should show JobPosted →
 * MatchResumesToJob. If it doesn't, see the explicit fallback
 * registration in AppServiceProvider_boot_snippet.php.
 */
class MatchResumesToJob implements ShouldQueue
{
    public function handle(JobPosted $event): void
    {
        ProcessJobMatch::dispatch($event->jobPost);
    }
}
