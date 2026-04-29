<?php

namespace App\Helpers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Request;

class SpaRouting
{
    public static function render(string $component, array $props = [])
    {
        // If the request wants JSON (e.g. from axios/fetch)
        if (Request::wantsJson() || Request::header('X-SPA')) {
            return new JsonResponse([
                'component' => $component,
                'props' => static::resolveProps($props),
            ]);
        }

        // For direct browser hits, return the root view.
        // We inject the page data into a global javascript variable for hydration,
        // similar to what Inertia does, but we'll read it locally.
        $page = [
            'component' => $component,
            'props' => static::resolveProps($props),
            'url' => Request::getRequestUri(),
            'version' => null,
        ];

        return view('app', ['page' => $page]);
    }

    public static function location($url)
    {
        if (Request::wantsJson() || Request::header('X-SPA')) {
            return response()->json(['location' => $url], 409, ['X-SPA-Location' => $url]);
        }
        return redirect()->away($url);
    }

    private static function resolveProps(array $props): array
    {
        $resolved = [];
        foreach ($props as $key => $value) {
            if ($value instanceof \Closure) {
                // To avoid serializing closures directly, we evaluate them now.
                // Inertia allows passing closures for lazy evaluation.
                $resolved[$key] = app()->call($value);
            } elseif ($value instanceof \Illuminate\Contracts\Support\Arrayable) {
                $resolved[$key] = $value->toArray();
            } else {
                $resolved[$key] = $value;
            }
        }
        
        
        $request = request();
        $shared = [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => method_exists($request->user(), 'getRoleNames') ? $request->user()->getRoleNames()->first() : null, // Using Spatie role
                ] : null,
            ],
            'notifications_count' => $request->user() ? $request->user()->unreadNotifications->count() : 0,
            'unresolved_alerts_count' => \App\Models\ConductAlert::where('is_resolved', false)->count(),
            'customization' => \App\Models\WebCustomization::first()?->settings ?? \App\Http\Controllers\WebCustomizationController::getDefaults(),
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'registration_code' => $request->session()->get('registration_code'),
            ],
        ];

        return array_merge($shared, $resolved);
    }
}
