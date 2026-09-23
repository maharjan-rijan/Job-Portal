<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobApplicationController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ResumeController;
use App\Http\Controllers\Api\SavedJobController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/jobs', [JobController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

    // Role-gated example routes, matching the React app's role checks:
    Route::middleware('role:seeker')->group(function () {
        Route::post('/jobs/{job}/applications', [JobApplicationController::class, 'store']);
        Route::get('/applications/mine', [JobApplicationController::class, 'mine']);
        Route::get('/saved-jobs', [SavedJobController::class, 'index']);
        Route::post('/saved-jobs/{job}', [SavedJobController::class, 'store']);
        Route::delete('/saved-jobs/{job}', [SavedJobController::class, 'destroy']);
        Route::get('/resumes/me', [ResumeController::class, 'show']);
        Route::put('/resumes/me', [ResumeController::class, 'update']);
    });
    Route::middleware('role:employer')->group(function () {
        Route::get('/jobs/mine', [JobController::class, 'mine']);
        Route::post('/jobs', [JobController::class, 'store']);
        Route::put('/jobs/{job}', [JobController::class, 'update']);
        Route::delete('/jobs/{job}', [JobController::class, 'destroy']);
        Route::get('/applications', [JobApplicationController::class, 'index']);
        Route::patch('/applications/{application}/status', [JobApplicationController::class, 'updateStatus']);
        Route::get('/resumes', [ResumeController::class, 'index']);
        Route::get('/resumes/{resume}', [ResumeController::class, 'showById']);
        Route::get('/resumes/{resume}/pdf', [ResumeController::class, 'downloadPdf']);


        Route::put('/profile', [ProfileController::class, 'update']);
    });

    Route::middleware('role:admin')->group(function () {
        // admin-only endpoints
    });
});

Route::get('/jobs/{job}', [JobController::class, 'show']);
