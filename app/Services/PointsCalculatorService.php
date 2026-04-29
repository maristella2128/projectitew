<?php

namespace App\Services;

use App\Models\Student;
use App\Models\StudentActivity;
use Illuminate\Support\Facades\DB;

class PointsCalculatorService
{
    /**
     * Re-computes points_awarded for all student_activities and refreshes engagement_score cache.
     *
     * @param Student $student
     * @return void
     */
    public function recalculateForStudent(Student $student): void
    {
        // 1. Ensure points_awarded are calculated for each activity
        $activities = $student->studentActivities()->where('status', '!=', 'dropped')->get();
        foreach ($activities as $activity) {
            $activity->save(); // Triggers the saving boot method
        }

        // 2. Aggregate stats
        $totalPoints = $activities->sum('points_awarded');
        $activityCount = $activities->count();
        $leadershipCount = $activities->filter(fn($a) => in_array($a->role, ['officer', 'president', 'coach']))->count();
        
        $uniqueCategories = $activities->pluck('activity.activity_category_id')->filter()->unique();
        $engagementScore = $totalPoints + ($uniqueCategories->count() * 5);

        $topCategory = $activities->groupBy('activity.activity_category_id')
            ->map->count()
            ->sortDesc()
            ->keys()
            ->first();

        // 3. Upsert Ranking Cache
        \App\Models\StudentRanking::updateOrCreate(
            ['student_id' => $student->id],
            [
                'total_points'     => $totalPoints,
                'engagement_score' => $engagementScore,
                'activity_count'   => $activityCount,
                'leadership_count' => $leadershipCount,
                'top_category_id'  => $topCategory,
                'last_computed_at' => now(),
            ]
        );

        $student->refresh();
    }

    /**
     * Recalculates ALL student rankings in one pass and sets global/course ranks.
     *
     * @return int Number of records updated
     */
    public function refreshAllRankings(): int
    {
        $students = Student::all();
        
        foreach ($students as $student) {
            $this->recalculateForStudent($student);
        }

        // After all stats are in student_rankings, calculate ranks
        // We do this by retrieving the cache, sorting, and updating
        
        // Global Rank
        $globalRankings = \App\Models\StudentRanking::orderByDesc('total_points')
            ->orderByDesc('engagement_score')
            ->get();

        foreach ($globalRankings as $index => $ranking) {
            $ranking->update(['rank' => $index + 1]);
        }

        // Course Rank
        $courses = Student::distinct()->pluck('course');
        foreach ($courses as $course) {
            $courseRankings = \App\Models\StudentRanking::whereHas('student', function($q) use ($course) {
                $q->where('course', $course);
            })
            ->orderByDesc('total_points')
            ->orderByDesc('engagement_score')
            ->get();

            foreach ($courseRankings as $index => $ranking) {
                $ranking->update(['course_rank' => $index + 1]);
            }
        }

        return $students->count();
    }

    /**
     * Get the global leaderboard for student engagement using the cache table.
     *
     * @param array $filters
     * @return array
     */
    public function getLeaderboardData(array $filters = []): array
    {
        $query = \App\Models\StudentRanking::with(['student.section', 'topCategory']);

        // Apply filters
        if (!empty($filters['course'])) {
            $query->whereHas('student', function($q) use ($filters) {
                $q->where('course', $filters['course']);
            });
        }

        if (!empty($filters['year_level'])) {
            $query->whereHas('student', function($q) use ($filters) {
                $q->where('year_level', $filters['year_level']);
            });
        }

        // Fallback to total_points ordering if rank isn't computed
        $rankings = $query->orderBy('rank')
            ->orderByDesc('total_points')
            ->take(50)
            ->get();

        return $rankings->map(function ($ranking) {
            return [
                'student_id'       => $ranking->student->student_id,
                'full_name'        => $ranking->student->name,
                'course'           => $ranking->student->course,
                'year_level'       => $ranking->student->year_level,
                'section_name'     => $ranking->student->section?->name ?: 'N/A',
                'total_points'     => $ranking->total_points,
                'engagement_score' => $ranking->engagement_score,
                'rank'             => $ranking->rank,
                'course_rank'      => $ranking->course_rank,
                'top_category'     => $ranking->topCategory?->name ?: 'N/A',
                'activity_count'   => $ranking->activity_count,
                'leadership_count' => $ranking->leadership_count,
            ];
        })->toArray();
    }
}
