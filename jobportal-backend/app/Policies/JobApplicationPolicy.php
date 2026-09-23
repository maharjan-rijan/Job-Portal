<?php

namespace App\Policies;

use App\Models\JobApplication;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class JobApplicationPolicy
{
    /**
     * Create a new policy instance.
     */
    public function updateStatus(User $user, JobApplication $application): Response
    {

        return $application->job->employer_id === $user->id
            ? Response::allow()
            : Response::deny('You do not own this job');
    }
}
