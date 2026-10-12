<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;


Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('job-alerts:digest Daily')->dailyAt('08:00');
Schedule::command('job-alerts:digest Weekly')->weeklyOn(1, '08:00'); // Monday
Schedule::command('job-alerts:digest Monthly')->monthlyOn(1, '08:00'); // 1st of the month
