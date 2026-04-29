<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\SpaRouting as Inertia;
use App\Services\PointsCalculatorService;
use App\Models\ActivityCategory;
use App\Models\StudentRanking;
use App\Models\Student;
use Illuminate\Pagination\LengthAwarePaginator;

class LeaderboardController extends Controller
{
    public function index(Request $request, PointsCalculatorService $pointsService)
    {
        $filters = $request->only(['course', 'year_level', 'academic_year', 'category_id', 'search']);
        
        // Retrieve top 50 (or all mapped data if getLeaderboardData returns more)
        $leaderboardData = collect($pointsService->getLeaderboardData($filters));
        
        // Handle search filter internally since getLeaderboardData might not handle 'search'
        if (!empty($filters['search'])) {
            $search = strtolower($filters['search']);
            $leaderboardData = $leaderboardData->filter(function ($student) use ($search) {
                return str_contains(strtolower($student['full_name']), $search) || 
                       str_contains(strtolower($student['student_id']), $search);
            })->values(); // Re-index keys
        }

        // Extract Top 3 before pagination
        $topThree = $leaderboardData->take(3)->values();
        
        // Manual Pagination
        $currentPage = LengthAwarePaginator::resolveCurrentPage();
        $perPage = 10;
        $currentPageItems = $leaderboardData->slice(($currentPage - 1) * $perPage, $perPage)->values();
        
        $paginatedLeaderboard = new LengthAwarePaginator($currentPageItems, count($leaderboardData), $perPage, $currentPage, [
            'path' => $request->url(),
            'query' => $request->query(),
        ]);

        // Computing overall stats from the raw table
        $totalParticipants = StudentRanking::where('total_points', '>', 0)->count();
        $averagePoints = StudentRanking::where('total_points', '>', 0)->avg('total_points') ?? 0;
        
        $mostActiveCategory = ActivityCategory::withCount('extracurricularActivities')
            ->orderByDesc('extracurricular_activities_count')
            ->first();

        return Inertia::render('Leaderboard/Index', [
            'leaderboard' => $paginatedLeaderboard,
            'filters' => $filters,
            'categories' => ActivityCategory::all(['id', 'name', 'color']),
            'courses' => Student::distinct()->pluck('course')->filter()->values(),
            'topThree' => $topThree,
            'stats' => [
                'total_participants' => $totalParticipants,
                'average_points' => round($averagePoints, 1),
                'most_active_category' => $mostActiveCategory ? $mostActiveCategory->name : 'N/A'
            ]
        ]);
    }
}
