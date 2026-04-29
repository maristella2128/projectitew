<?php

namespace App\Http\Middleware;

use App\Models\ConductAlert;
use App\Models\WebCustomization;
use App\Http\Controllers\WebCustomizationController;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                ] : null,
            ],
            'notifications_count' => $request->user() ? (function() use ($request) {
                $count = $request->user()->unreadNotifications->count();
                if ($request->user()->hasRole(['student'])) {
                    $student = \App\Models\Student::where('user_id', $request->user()->id)->first();
                    if ($student) {
                        $readIds = \DB::table('announcement_reads')->where('student_id', $student->id)->pluck('announcement_id');
                        $count += \App\Models\Announcement::where('status', 'published')
                            ->where(function($q) {
                                $q->whereNull('scheduled_at')->orWhere('scheduled_at', '<=', now());
                            })
                            ->where(function($q) use ($student) {
                                $q->whereNull('section_id')
                                  ->orWhere('section_id', $student->section_id)
                                  ->orWhereNull('target_audience')
                                  ->orWhereJsonContains('target_audience->sections', $student->section_id);
                            })
                            ->whereNotIn('id', $readIds)->count();
                    }
                }
                return $count;
            })() : 0,
            'unresolved_alerts_count' => ConductAlert::where('is_resolved', false)->count(),
            'customization' => WebCustomization::first()?->settings ?? WebCustomizationController::getDefaults(),
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'registration_code' => $request->session()->get('registration_code'),
            ],
        ];
    }
}
