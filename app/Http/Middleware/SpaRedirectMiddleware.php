<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\RedirectResponse;

class SpaRedirectMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // If the request was from our custom SPA via Axios
        if ($request->header('X-SPA')) {
            // Check if the response is a redirect
            if ($response instanceof RedirectResponse) {
                // Return a special 409 Conflict with the redirect location
                // so the Axios interceptor in inertia-adapter.jsx can follow it explicitly via visit()
                // instead of the browser following it transparently and breaking HTTP methods.
                return response()->json([
                    'location' => $response->headers->get('Location')
                ], 409, [
                    'X-SPA-Location' => $response->headers->get('Location')
                ]);
            }
        }

        return $response;
    }
}
