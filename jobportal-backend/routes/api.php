<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobApplicationController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\ProfileController;
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

    });
    Route::middleware('role:employer')->group(function () {
        Route::get('/jobs/mine', [JobController::class, 'mine']);
        Route::post('/jobs', [JobController::class, 'store']);
        Route::put('/jobs/{job}', [JobController::class, 'update']);
        Route::delete('/jobs/{job}', [JobController::class, 'destroy']);
        Route::get('/applications', [JobApplicationController::class, 'index']);
        Route::patch('/applications/{application}/status', [JobApplicationController::class, 'updateStatus']);


        Route::put('/profile', [ProfileController::class, 'update']);
    });

    Route::middleware('role:admin')->group(function () {
        // admin-only endpoints
    });
});

Route::get('/jobs/{job}', [JobController::class, 'show']);
