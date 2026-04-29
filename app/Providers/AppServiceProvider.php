<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

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
        if (env('APP_ENV') !== 'local') {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        \App\Models\Grade::observe(\App\Observers\GradeObserver::class);
        \App\Models\StudentActivity::observe(\App\Observers\StudentActivityObserver::class);
        \App\Models\BehaviorLog::observe(\App\Observers\BehaviorLogObserver::class);
        Vite::prefetch(concurrency: 3);

        RateLimiter::for('register', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip())->response(function (Request $request, array $headers) {
                return response('Too many registration attempts. Please try again in a minute.', 429, $headers);
            });
        });
    }
}
