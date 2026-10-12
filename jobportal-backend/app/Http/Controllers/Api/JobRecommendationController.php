<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPost;
use App\Services\JobMatchingService;
use Illuminate\Http\Request;

/**
 * Powers the seeker dashboard's "Recommended for you" section — scores
 * every open job against the current seeker's resume and returns the
 * best matches, highest score first. Same JobMatchingService that
 * ProcessJobMatch uses for instant notifications, just run on demand.
 */
class JobRecommendationController extends Controller
{
    public function index(Request $request)
    {
        $resume = $request->user()->resume;

        // No resume yet — nothing to score against, so just return an
        // empty list rather than erroring. The frontend already handles
        // "no recommendations yet" as a normal empty state.
        if (! $resume) {
            return response()->json([]);
        }

        $matcher = app(JobMatchingService::class);
        $resumeText = $matcher->resumeText($resume->toArray());

        // Jobs go live immediately in this schema (no approval_status
        // column), so "open" is the only gate — matches JobController::index().
        $jobs = JobPost::query()
            ->with('employer.company')
            ->where('status', 'Open')
            ->get();

        $scored = $jobs
            ->map(function ($job) use ($matcher, $resumeText) {
                $job->match_score = round(
                    $matcher->score($resumeText, $matcher->jobText($job->toArray())),
                    2
                );
                return $job;
            })
            ->filter(fn ($job) => $job->match_score > 0)
            ->sortByDesc('match_score')
            ->take(10)
            ->values();

        return response()->json($scored);
    }
}
