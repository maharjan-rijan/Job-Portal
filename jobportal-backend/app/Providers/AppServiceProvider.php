<?php

namespace App\Providers;

use App\Models\JobApplication;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use App\Models\JobPost;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Route::model('job', JobPost::class);
        Route::model('application', JobApplication::class);
    }
}
