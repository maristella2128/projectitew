<?php

namespace Database\Seeders;

use App\Models\ActivityCategory;
use App\Models\ExtracurricularActivity;
use App\Models\Student;
use App\Models\StudentActivity;
use App\Models\StudentSkill;
use App\Services\PointsCalculatorService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class ExtracurricularSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(PointsCalculatorService $pointsService): void
    {
        // 1. Seed Categories
        $categories = [
            ['name' => 'Tech', 'color' => '#3b82f6', 'icon' => 'Cpu'],
            ['name' => 'Academic', 'color' => '#8b5cf6', 'icon' => 'Book'],
            ['name' => 'Sports', 'color' => '#ef4444', 'icon' => 'Dribbble'],
            ['name' => 'Leadership', 'color' => '#f59e0b', 'icon' => 'Shield'],
            ['name' => 'Arts', 'color' => '#ec4899', 'icon' => 'Palette'],
            ['name' => 'Civic', 'color' => '#10b981', 'icon' => 'Users'],
            ['name' => 'Health & Wellness', 'color' => '#06b6d4', 'icon' => 'Heart'],
            ['name' => 'Business', 'color' => '#6366f1', 'icon' => 'Briefcase'],
        ];

        $categoryModels = [];
        foreach ($categories as $cat) {
            $categoryModels[$cat['name']] = ActivityCategory::updateOrCreate(['name' => $cat['name']], $cat);
        }

        // 2. Seed Activities
        $activities = [
            [
                'name' => 'Google Developer Student Club',
                'category' => 'Tech',
                'courses' => ['BSIT', 'BSCS'],
                'skills' => ['coding', 'leadership'],
                'points' => 20,
                'type' => 'organization'
            ],
            [
                'name' => 'Programming Contest Team',
                'category' => 'Tech',
                'courses' => ['BSCS', 'BSIT'],
                'skills' => ['coding', 'problem_solving'],
                'points' => 30,
                'type' => 'competition'
            ],
            [
                'name' => 'Student Government',
                'category' => 'Leadership',
                'courses' => ['all'],
                'skills' => ['leadership', 'public_speaking'],
                'points' => 25,
                'type' => 'organization'
            ],
            [
                'name' => 'Math Olympiad Team',
                'category' => 'Academic',
                'courses' => ['BSCS', 'BSECE'],
                'skills' => ['problem_solving', 'analytics'],
                'points' => 25,
                'type' => 'competition'
            ],
            [
                'name' => 'Debate Club',
                'category' => 'Academic',
                'courses' => ['all'],
                'skills' => ['public_speaking', 'critical_thinking'],
                'points' => 15,
                'type' => 'organization'
            ],
            [
                'name' => 'Basketball Varsity',
                'category' => 'Sports',
                'courses' => ['all'],
                'skills' => ['teamwork'],
                'points' => 20,
                'type' => 'sports'
            ],
            [
                'name' => 'Theater Arts Guild',
                'category' => 'Arts',
                'courses' => ['all'],
                'skills' => ['creativity', 'communication'],
                'points' => 15,
                'type' => 'organization'
            ],
            [
                'name' => 'Red Cross Youth',
                'category' => 'Civic',
                'courses' => ['all'],
                'skills' => ['leadership', 'empathy'],
                'points' => 20,
                'type' => 'organization'
            ],
            [
                'name' => 'Robotics Club',
                'category' => 'Tech',
                'courses' => ['BSIT', 'BSCE', 'BSECE'],
                'skills' => ['coding', 'engineering'],
                'points' => 25,
                'type' => 'organization'
            ],
            [
                'name' => 'Entrepreneurship Club',
                'category' => 'Business',
                'courses' => ['all'],
                'skills' => ['leadership', 'analytics'],
                'points' => 20,
                'type' => 'organization'
            ],
            [
                'name' => 'Photography Club',
                'category' => 'Arts',
                'courses' => ['all'],
                'skills' => ['creativity'],
                'points' => 10,
                'type' => 'organization'
            ],
            [
                'name' => 'Hackathon Team',
                'category' => 'Tech',
                'courses' => ['BSIT', 'BSCS'],
                'skills' => ['coding', 'problem_solving', 'teamwork'],
                'points' => 35,
                'type' => 'competition'
            ],
            [
                'name' => 'Environmental Club',
                'category' => 'Civic',
                'courses' => ['all'],
                'skills' => ['leadership'],
                'points' => 15,
                'type' => 'organization'
            ],
            [
                'name' => 'Chess Club',
                'category' => 'Academic',
                'courses' => ['all'],
                'skills' => ['problem_solving', 'analytics'],
                'points' => 10,
                'type' => 'organization'
            ],
            [
                'name' => 'Dance Company',
                'category' => 'Arts',
                'courses' => ['all'],
                'skills' => ['creativity', 'teamwork'],
                'points' => 15,
                'type' => 'organization'
            ],
        ];

        $activityModels = [];
        foreach ($activities as $act) {
            $activityModels[] = ExtracurricularActivity::updateOrCreate(
                ['name' => $act['name']],
                [
                    'activity_category_id' => $categoryModels[$act['category']]->id,
                    'description' => "Official {$act['name']} of the institution.",
                    'recommended_for_courses' => $act['course'] ?? ['all'],
                    'recommended_for_skills' => $act['skills'],
                    'activity_type' => $act['type'],
                    'base_points' => $act['points'],
                    'is_active' => true,
                ]
            );
        }

        // 3. Assign to Students
        $students = Student::all();
        $roles = ['member', 'officer', 'president', 'participant', 'winner'];
        $years = ['2023-2024', '2024-2025'];

        foreach ($students as $student) {
            // Assign 2 to 4 activities
            $studentActivities = collect($activityModels)->random(rand(2, 4));

            foreach ($studentActivities as $activity) {
                $role = collect($roles)->random();
                $academicYear = collect($years)->random();
                
                $multiplier = match ($role) {
                    'member', 'participant' => 1,
                    'officer', 'coach'      => 2,
                    'president', 'winner'   => 3,
                    default                 => 1,
                };

                $sa = StudentActivity::updateOrCreate(
                    [
                        'student_id' => $student->id,
                        'extracurricular_activity_id' => $activity->id,
                        'academic_year' => $academicYear,
                    ],
                    [
                        'role' => $role,
                        'semester' => rand(1, 2),
                        'status' => 'completed',
                        'points_awarded' => $activity->base_points * $multiplier,
                        'achievement' => (in_array($role, ['winner', 'president'])) ? 'Outstanding Performance' : null,
                    ]
                );

                // Add skills based on activity
                foreach ($activity->recommended_for_skills as $skillName) {
                    StudentSkill::updateOrCreate(
                        [
                            'student_id' => $student->id,
                            'skill' => $skillName,
                        ],
                        [
                            'proficiency' => collect(['intermediate', 'advanced'])->random(),
                            'source' => 'activity_derived',
                        ]
                    );
                }
            }

            // Recalculate for student
            $pointsService->recalculateForStudent($student);
        }

        // 4. Final Rankings Refresh
        Artisan::call('rankings:refresh');
    }
}
