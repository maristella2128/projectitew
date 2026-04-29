<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\SpaRouting as Inertia;
use Illuminate\Http\JsonResponse; use Illuminate\Http\Response as HttpResponse; use Illuminate\View\View;

class AnalyticsController extends Controller
{
    public function index()
    {
        $enrollmentData = \App\Models\Student::selectRaw('year_level, count(*) as count')
            ->groupBy('year_level')
            ->get();

        $performanceData = [
            ['subject' => 'Math', 'average' => 85],
            ['subject' => 'English', 'average' => 88],
            ['subject' => 'Science', 'average' => 82],
            ['subject' => 'History', 'average' => 90],
        ];

        $attendanceRate = [
            ['name' => 'Mon', 'rate' => 95],
            ['name' => 'Tue', 'rate' => 92],
            ['name' => 'Wed', 'rate' => 98],
            ['name' => 'Thu', 'rate' => 96],
            ['name' => 'Fri', 'rate' => 94],
        ];

        return Inertia::render('Analytics/Index', [
            'enrollmentData' => $enrollmentData,
            'performanceData' => $performanceData,
            'attendanceRate' => $attendanceRate,
        ]);
    }
}
