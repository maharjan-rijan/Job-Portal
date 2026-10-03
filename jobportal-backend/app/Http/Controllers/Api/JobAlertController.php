<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Job\StoreJobAlertRequest;
use App\Models\JobAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class JobAlertController extends Controller
{
    /** The logged-in seeker's own alerts. */
    public function index(Request $request)
    {
        return $request->user()
            ->jobAlerts() // add this hasMany to User.php — see note below
            ->latest()
            ->get();
    }

    public function store(StoreJobAlertRequest $request)
    {
        $alert = $request->user()->jobAlerts()->create($request->validated());

        return response()->json($alert, 201);
    }

    public function destroy(Request $request, JobAlert $jobAlert)
    {

        abort_if($jobAlert->seeker_id !== $request->user()->id, 403);

        $jobAlert->delete();

        return response()->json(['message' => 'Alert removed']);
    }
}
