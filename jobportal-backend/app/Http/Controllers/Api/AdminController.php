<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\JobPost;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // There's no "target" concept anywhere in the schema — this is a
    // fixed goal the platform team can adjust, not something computed.
    private const MONTHLY_EMPLOYER_TARGET = 100;

    /** GET /admin/dashboard — everything the admin dashboard renders, in one call. */
    public function dashboard(Request $request)
    {
        return response()->json([
            'stats' => $this->stats(),
            'growth' => $this->monthlyGrowth(),
            'employerOnboarding' => $this->employerOnboarding(),
            'recentActivity' => $this->recentActivity(),
        ]);
    }

    private function stats(): array
    {
        $startOfThisMonth = Carbon::now()->startOfMonth();
        $startOfLastMonth = Carbon::now()->subMonthNoOverflow()->startOfMonth();

        $countSince = fn($query, $since) => (clone $query)->where('created_at', '>=', $since)->count();
        $countBetween = fn($query, $from, $to) => (clone $query)->whereBetween('created_at', [$from, $to])->count();

        // direction is only ever "up"/"down" — that's all StatCard renders.
        $trend = function (int $thisMonth, int $lastMonth): array {
            if ($lastMonth === 0) {
                return $thisMonth > 0
                    ? ['direction' => 'up', 'value' => 'new']
                    : ['direction' => 'up', 'value' => '0%'];
            }
            $change = round((($thisMonth - $lastMonth) / $lastMonth) * 100, 1);
            return [
                'direction' => $change >= 0 ? 'up' : 'down',
                'value' => abs($change) . '%',
            ];
        };

        $seekers = User::where('role', 'seeker');
        $employers = User::where('role', 'employer');
        $jobPosts = JobPost::query();
        $applications = JobApplication::query();

        return [
            'seekers' => [
                'value' => (clone $seekers)->count(),
                'trend' => $trend(
                    $countSince($seekers, $startOfThisMonth),
                    $countBetween($seekers, $startOfLastMonth, $startOfThisMonth)
                ),
            ],
            'employers' => [
                'value' => (clone $employers)->count(),
                'trend' => $trend(
                    $countSince($employers, $startOfThisMonth),
                    $countBetween($employers, $startOfLastMonth, $startOfThisMonth)
                ),
            ],
            'activeJobs' => [
                'value' => (clone $jobPosts)->where('status', 'Open')->count(),
                // Job status can flip after the fact, so it isn't tracked
                // historically — this trend is new-job-post velocity, not
                // a month-over-month open-job count.
                'trend' => $trend(
                    $countSince($jobPosts, $startOfThisMonth),
                    $countBetween($jobPosts, $startOfLastMonth, $startOfThisMonth)
                ),
            ],
            'applications' => [
                'value' => (clone $applications)->count(),
                'trend' => $trend(
                    $countSince($applications, $startOfThisMonth),
                    $countBetween($applications, $startOfLastMonth, $startOfThisMonth)
                ),
            ],
        ];
    }

    /** Last 12 calendar months of signups / job posts / applications. */
    private function monthlyGrowth(): array
    {
        $months = collect(range(11, 0))
            ->map(fn($i) => Carbon::now()->subMonthsNoOverflow($i)->startOfMonth());
        $windowStart = $months->first();

        $bucket = function ($createdAtValues) use ($months) {
            $counts = array_fill_keys($months->map(fn($m) => $m->format('Y-m'))->all(), 0);
            foreach ($createdAtValues as $createdAt) {
                $key = Carbon::parse($createdAt)->format('Y-m');
                if (array_key_exists($key, $counts)) {
                    $counts[$key]++;
                }
            }
            return $months->map(fn($m) => [
                'month' => $m->format('M'),
                'value' => $counts[$m->format('Y-m')],
            ])->values();
        };

        return [
            'signups' => $bucket(User::where('created_at', '>=', $windowStart)->pluck('created_at')),
            'jobsPosted' => $bucket(JobPost::where('created_at', '>=', $windowStart)->pluck('created_at')),
            'applications' => $bucket(JobApplication::where('created_at', '>=', $windowStart)->pluck('created_at')),
        ];
    }

    private function employerOnboarding(): array
    {
        $onboarded = User::where('role', 'employer')
            ->where('created_at', '>=', Carbon::now()->startOfMonth())
            ->count();

        return [
            'onboarded' => $onboarded,
            'target' => self::MONTHLY_EMPLOYER_TARGET,
            'percent' => min(100, (int) round(($onboarded / self::MONTHLY_EMPLOYER_TARGET) * 100)),
        ];
    }

    /**
     * The 6 most recent real events across the platform. The original
     * mock had "employer verified" / "job flagged" entries, but neither
     * verification nor flagging exists anywhere in the schema — rather
     * than fabricate activity for concepts that don't exist yet, this
     * surfaces the real events the schema actually supports.
     */
    private function recentActivity(): array
    {
        $employers = User::where('role', 'employer')->latest()->take(5)->get()
            ->map(fn($user) => [
                'id' => "employer-{$user->id}",
                'type' => 'employer_signup',
                'label' => 'New employer signed up',
                'meta' => $user->name,
                'createdAt' => $user->created_at,
            ]);

        $seekers = User::where('role', 'seeker')->latest()->take(5)->get()
            ->map(fn($user) => [
                'id' => "seeker-{$user->id}",
                'type' => 'seeker_signup',
                'label' => 'New seeker signed up',
                'meta' => $user->email,
                'createdAt' => $user->created_at,
            ]);

        $jobs = JobPost::with('employer')->latest()->take(5)->get()
            ->map(fn($job) => [
                'id' => "job-{$job->id}",
                'type' => 'job_posted',
                'label' => 'New job posted',
                'meta' => $job->employer ? "{$job->title} · {$job->employer->name}" : $job->title,
                'createdAt' => $job->created_at,
            ]);

        $applications = JobApplication::with('job')->latest()->take(5)->get()
            ->map(fn($application) => [
                'id' => "application-{$application->id}",
                'type' => 'application_submitted',
                'label' => 'New application submitted',
                'meta' => $application->job ? "For {$application->job->title}" : $application->full_name,
                'createdAt' => $application->created_at,
            ]);

        return $employers->concat($seekers)->concat($jobs)->concat($applications)
            ->sortByDesc('createdAt')
            ->take(6)
            ->values()
            ->all();
    }
    public function users(Request $request)
    {
        $users = User::query()
            ->with('company') // skip this ->with() if company isn't a real relation on your User model
            ->whereIn('role', ['seeker', 'employer']) // admins never show up in this list
            ->when($request->filled('search'), function ($query) use ($request) {
                $term = '%' . $request->input('search') . '%';
                $query->where(function ($q) use ($term) {
                    $q->where('name', 'like', $term)
                        ->orWhere('email', 'like', $term);
                });
            })
            ->when($request->filled('role'), function ($query) use ($request) {
                $query->where('role', $request->input('role'));
            })
            ->latest()
            ->get();

        return response()->json($users);
    }

    /** PATCH /admin/users/{user}/toggle-block */
    public function toggleUserBlock(Request $request, User $user)
    {
        // Admins aren't listed in Manage Users; refuse here too so an admin
        // can't lock themselves (or another admin) out via a direct API call.
        if ($user->role === 'admin' || $user->is($request->user())) {
            return response()->json(['message' => 'Admin accounts cannot be blocked.'], 422);
        }

        $user->forceFill(['is_blocked' => ! $user->is_blocked])->save();

        // Blocking takes effect on the user's next request: CheckUserBlockUnblock
        // answers 403 ACCOUNT_BLOCKED and revokes their tokens, and the React
        // app sends them to /login. Unblocking just lets them log in again.

        return response()->json($user->fresh());
    }

    public function jobs(Request $request)
    {
        $jobs = JobPost::query()
            ->with('employer.company')
            ->withCount('applications')
            ->when($request->filled('search'), function ($query) use ($request) {
                $term = '%' . $request->input('search') . '%';
                $query->where(function ($q) use ($term) {
                    $q->where('title', 'like', $term)
                        ->orWhereHas('employer.company', fn($c) => $c->where('name', 'like', $term));
                });
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->input('status'));
            })
            ->latest()
            ->get()
            ->map(function ($job) {

                $job->applicants_count = $job->applications_count;
                return $job;
            });

        return response()->json($jobs);
    }


    public function toggleFeaturedJob(JobPost $job)
    {
        $job->update(['is_featured' => ! $job->is_featured]);
        return response()->json($job->load('employer.company'));
    }

    public function reports(Request $request)
    {
        $from = $request->filled('from')
            ? Carbon::parse($request->input('from'))->startOfDay()
            : null;
        $to = $request->filled('to')
            ? Carbon::parse($request->input('to'))->endOfDay()
            : Carbon::now()->endOfDay();

        $jobsQuery = JobPost::query()
            ->when($from, fn($q) => $q->where('created_at', '>=', $from))
            ->where('created_at', '<=', $to);

        $applicationsQuery = JobApplication::query()
            ->when($from, fn($q) => $q->where('created_at', '>=', $from))
            ->where('created_at', '<=', $to);

        $usersQuery = User::query()
            ->when($from, fn($q) => $q->where('created_at', '>=', $from))
            ->where('created_at', '<=', $to);

        return response()->json([
            'summary' => [
                'jobs_posted' => (clone $jobsQuery)->count(),
                'applications' => (clone $applicationsQuery)->count(),
                'new_seekers' => (clone $usersQuery)->where('role', 'seeker')->count(),
                'new_employers' => (clone $usersQuery)->where('role', 'employer')->count(),
            ],

            'jobs_by_status' => (clone $jobsQuery)
                ->selectRaw('status as name, count(*) as value')
                ->groupBy('status')
                ->get(),


            'applications_by_status' => (clone $applicationsQuery)
                ->selectRaw('status as name, count(*) as value')
                ->groupBy('status')
                ->get(),

            'signups_by_role' => (clone $usersQuery)
                ->whereIn('role', ['seeker', 'employer'])
                ->selectRaw('role as name, count(*) as value')
                ->groupBy('role')
                ->get(),
        ]);
    }
}
