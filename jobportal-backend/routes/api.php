<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\JobAlertController;
use App\Http\Controllers\Api\JobApplicationController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\JobRecommendationController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\RegistrationController;
use App\Http\Controllers\Api\ResumeController;
use App\Http\Controllers\Api\SavedJobController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [PasswordResetController::class, 'forgot'])->middleware('throttle:5,1,pwd-forgot');
Route::post('/auth/verify-otp', [PasswordResetController::class, 'verifyOtp'])->middleware('throttle:10,1,pwd-verify');
Route::post('/auth/reset-password', [PasswordResetController::class, 'reset'])->middleware('throttle:10,1,pwd-reset');


Route::post('/auth/register', [RegistrationController::class, 'start'])->middleware('throttle:10,1,reg-start');
Route::post('/auth/register/verify', [RegistrationController::class, 'verify'])->middleware('throttle:10,1,reg-verify');
Route::post('/auth/register/resend', [RegistrationController::class, 'resend'])->middleware('throttle:5,1,reg-resend');

Route::get('/jobs', [JobController::class, 'index']);

Route::get('/blog', [BlogController::class, 'index']);
Route::get('/blog/categories', [BlogController::class, 'categories']);
Route::get('/blog/{blogPost}', [BlogController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllRead']);

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

        Route::get('/jobs/recommended', [JobRecommendationController::class, 'index']);
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
    });

    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::patch('/admin/users/{user}/toggle-block', [AdminController::class, 'toggleUserBlock']);
        Route::get('/admin/jobs', [AdminController::class, 'jobs']);

        Route::patch('/admin/jobs/{job}/approve', [AdminController::class, 'approveJob']);
        Route::patch('/admin/jobs/{job}/reject', [AdminController::class, 'rejectJob']);
        Route::patch('/admin/jobs/{job}/toggle-featured', [AdminController::class, 'toggleFeaturedJob']);

        Route::get('/admin/reports', [AdminController::class, 'reports']);

        Route::post('/admin/blog', [BlogController::class, 'store']);
        Route::put('/admin/blog/{blogPost}', [BlogController::class, 'update']);
        Route::delete('/admin/blog/{blogPost}', [BlogController::class, 'destroy']);
    });
});

Route::get('/jobs/{job}', [JobController::class, 'show']);
