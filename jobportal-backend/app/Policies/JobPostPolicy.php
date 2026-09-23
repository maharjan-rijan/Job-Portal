<?php

namespace App\Policies;

use App\Models\JobPost;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class JobPostPolicy
{
    /**
     * Create a new policy instance.
     */
     public function update(User $user, JobPost $job): Response
    {
        return $job->employer_id === $user->id
            ? Response::allow()
            : Response::deny('You do not own this job');
    }

    public function delete(User $user, JobPost $job): Response
    {
        return $this->update($user, $job);
    }
}
