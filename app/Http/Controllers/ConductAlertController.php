<?php

namespace App\Http\Controllers;

use App\Models\ConductAlert;
use App\Services\ConductAlertService;
use Illuminate\Http\Request;

class ConductAlertController extends Controller
{
    /**
     * Resolve a specific conduct alert.
     */
    public function resolve(ConductAlert $alert, ConductAlertService $service)
    {
        $service->resolveAlert($alert, auth()->user());

        return back()->with('success', 'Alert marked as resolved.');
    }

    /**
     * Return a list of unresolved conduct alerts.
     */
    public function unresolved(Request $request)
    {
        $query = ConductAlert::with('student')->unresolved();

        if ($request->filled('student_id')) {
            $query->forStudent($request->student_id);
        }

        if ($request->filled('alert_type')) {
            $query->where('alert_type', $request->alert_type);
        }

        return response()->json($query->latest()->get());
    }
}
