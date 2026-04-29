<?php

namespace App\Services;

use App\Models\Student;
use App\Models\ExtracurricularActivity;
use App\Models\StudentActivity;
use Illuminate\Support\Facades\DB;

class RecommendationService
{
    /**
     * Get personalized extracurricular recommendations for a student.
     *
     * @param Student $student
     * @return array
     */
    public function getRecommendationsForStudent(Student $student): array
    {
        // 1. Filter: Only active activities that the student has NOT already joined
        $joinedActivityIds = $student->studentActivities()
            ->where('status', '!=', 'dropped')
            ->pluck('extracurricular_activity_id')
            ->toArray();

        $candidates = ExtracurricularActivity::with('category')
            ->where('is_active', true)
            ->whereNotIn('id', $joinedActivityIds)
            ->get();

        // 2. Prepare context for scoring
        $studentSkills = $student->studentSkills->pluck('skill')->toArray();
        $studentCourse = $student->course;
        
        // Find most frequent category affinity
        $topCategory = $student->studentActivities()
            ->join('extracurricular_activities', 'student_activities.extracurricular_activity_id', '=', 'extracurricular_activities.id')
            ->select('extracurricular_activities.activity_category_id', DB::raw('count(*) as count'))
            ->groupBy('extracurricular_activities.activity_category_id')
            ->orderByDesc('count')
            ->first();
        
        $affinityCategoryId = $topCategory ? $topCategory->activity_category_id : null;
        $affinityCategoryName = $topCategory && $topCategory->activity_category_id 
            ? \App\Models\ActivityCategory::find($topCategory->activity_category_id)?->name 
            : 'Uncategorized';

        // Peer popularity counts (other students in same course + year_level)
        $peerActivityCounts = StudentActivity::join('students', 'student_activities.student_id', '=', 'students.id')
            ->where('students.id', '!=', $student->id)
            ->where('students.course', $student->course)
            ->where('students.year_level', $student->year_level)
            ->select('student_activities.extracurricular_activity_id', DB::raw('count(*) as peer_count'))
            ->groupBy('student_activities.extracurricular_activity_id')
            ->pluck('peer_count', 'extracurricular_activity_id');

        $recommendations = [];

        foreach ($candidates as $activity) {
            $score = 0;
            $reasons = [];

            // COURSE MATCH (+40 points)
            $recCourses = $activity->recommended_for_courses ?: [];
            if (in_array($studentCourse, $recCourses)) {
                $score += 40;
                $reasons[] = "Recommended for {$studentCourse} students";
            }

            // SKILL MATCH (+30 points per matching skill, max +30 total)
            $recSkills = $activity->recommended_for_skills ?: [];
            $matchingSkills = array_intersect($studentSkills, $recSkills);
            if (!empty($matchingSkills)) {
                $score += 30;
                foreach ($matchingSkills as $skill) {
                    $reasons[] = "Matches your skill: {$skill}";
                }
            }

            // CATEGORY AFFINITY (+20 points)
            if ($affinityCategoryId && $activity->activity_category_id === $affinityCategoryId) {
                $score += 20;
                $reasons[] = "You enjoy {$affinityCategoryName} activities";
            }

            // PEER POPULARITY (+10 points)
            $peerCount = $peerActivityCounts[$activity->id] ?? 0;
            if ($peerCount >= 3) {
                $score += 10;
                $reasons[] = "{$peerCount} students from your course joined this";
            }

            // NOVELTY BONUS (+15 points)
            // candidates filtered by not being in joinedActivityIds already, so we just add the bonus
            $score += 15;

            if ($score > 0) {
                $recommendations[] = [
                    'activity_id'    => $activity->id,
                    'name'           => $activity->name,
                    'category_name'  => $activity->category?->name ?: 'Miscellaneous',
                    'category_color' => $activity->category?->color ?: '#94a3b8',
                    'activity_type'  => $activity->activity_type,
                    'match_score'    => min($score, 100), // Cap at 100 as per common practice, though implicit
                    'reasons'        => array_values(array_unique($reasons)),
                    'base_points'    => $activity->base_points,
                ];
            }
        }

        // Sort by match_score descending
        usort($recommendations, function ($a, $b) {
            return $b['match_score'] <=> $a['match_score'];
        });

        // Return top 5
        return array_slice($recommendations, 0, 5);
    }
}
