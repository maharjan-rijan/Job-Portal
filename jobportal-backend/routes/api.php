<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Role-gated example routes, matching the React app's role checks:
    Route::middleware('role:seeker')->group(function () {
        // seeker-only endpoints
    });
    Route::middleware('role:employer')->group(function () {
        // employer-only endpoints
    });
    Route::middleware('role:admin')->group(function () {
        // admin-only endpoints
    });
});
