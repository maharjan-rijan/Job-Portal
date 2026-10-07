<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\JobAlertController;
use App\Http\Controllers\Api\JobApplicationController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ResumeController;
use App\Http\Controllers\Api\SavedJobController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/jobs', [JobController::class, 'index']);

Route::get('/blog', [BlogController::class, 'index']);
Route::get('/blog/categories', [BlogController::class, 'categories']);
Route::get('/blog/{blogPost}', [BlogController::class, 'show']);

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
        Route::get('/resumes/me/pdf', [ResumeController::class, 'downloadMyPdf']);

        Route::get('/job-alerts', [JobAlertController::class, 'index']);
        Route::post('/job-alerts', [JobAlertController::class, 'store']);
        Route::delete('/job-alerts/{jobAlert}', [JobAlertController::class, 'destroy']);
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
        Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::patch('/admin/users/{user}/toggle-block', [AdminController::class, 'toggleUserBlock']);
        Route::get('/admin/jobs', [AdminController::class, 'jobs']);

        Route::patch('/admin/jobs/{job}/approve', [AdminController::class, 'approveJob']);
        Route::patch('/admin/jobs/{job}/reject', [AdminController::class, 'rejectJob']);
        Route::patch('/admin/jobs/{job}/toggle-featured', [AdminController::class, 'toggleFeaturedJob']);

        Route::post('/blog', [BlogController::class, 'store']);
        Route::put('/blog/{blogPost}', [BlogController::class, 'update']);
        Route::delete('/blog/{blogPost}', [BlogController::class, 'destroy']);
    });
});

Route::get('/jobs/{job}', [JobController::class, 'show']);
