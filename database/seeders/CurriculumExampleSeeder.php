<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Program;
use App\Models\Course;
use App\Models\Curriculum;
use App\Models\CurriculumCourse;

class CurriculumExampleSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure Programs exist
        $it = Program::firstOrCreate(['code' => 'BSIT'], ['name' => 'Bachelor of Science in Information Technology', 'department' => 'College of Computing Studies']);
        $cs = Program::firstOrCreate(['code' => 'BSCS'], ['name' => 'Bachelor of Science in Computer Science', 'department' => 'College of Computing Studies']);

        // 2. Seed Master Courses
        $courses = [
            // IT Courses
            ['code' => 'ITP101', 'name' => 'Introduction to Programming', 'dept' => 'CCS', 'lec' => 2, 'lab' => 1],
            ['code' => 'ITP102', 'name' => 'Computer Hardware and Software', 'dept' => 'CCS', 'lec' => 3, 'lab' => 0],
            ['code' => 'ITP201', 'name' => 'Object-Oriented Programming', 'dept' => 'CCS', 'lec' => 2, 'lab' => 1],
            ['code' => 'ITP202', 'name' => 'Data Structures and Algorithms (IT)', 'dept' => 'CCS', 'lec' => 3, 'lab' => 0],
            ['code' => 'ITP301', 'name' => 'Web Systems and Technologies', 'dept' => 'CCS', 'lec' => 2, 'lab' => 1],
            ['code' => 'ITP302', 'name' => 'Information Management', 'dept' => 'CCS', 'lec' => 3, 'lab' => 0],
            ['code' => 'ITP401', 'name' => 'Systems Integration and Architecture', 'dept' => 'CCS', 'lec' => 2, 'lab' => 1],
            ['code' => 'ITP402', 'name' => 'IT Capstone Project', 'dept' => 'CCS', 'lec' => 3, 'lab' => 0],

            // CS Courses
            ['code' => 'CSC101', 'name' => 'CS Fundamentals', 'dept' => 'CCS', 'lec' => 3, 'lab' => 0],
            ['code' => 'CSC102', 'name' => 'Discrete Structures', 'dept' => 'CCS', 'lec' => 3, 'lab' => 0],
            ['code' => 'CSC201', 'name' => 'Algorithms and Complexity', 'dept' => 'CCS', 'lec' => 3, 'lab' => 0],
            ['code' => 'CSC202', 'name' => 'Operating Systems', 'dept' => 'CCS', 'lec' => 2, 'lab' => 1],
            ['code' => 'CSC301', 'name' => 'Software Engineering', 'dept' => 'CCS', 'lec' => 2, 'lab' => 1],
            ['code' => 'CSC302', 'name' => 'Artificial Intelligence', 'dept' => 'CCS', 'lec' => 3, 'lab' => 0],
            ['code' => 'CSC401', 'name' => 'Parallel and Distributed Computing', 'dept' => 'CCS', 'lec' => 3, 'lab' => 0],
            ['code' => 'CSC402', 'name' => 'CS Thesis', 'dept' => 'CCS', 'lec' => 3, 'lab' => 0],

            // General/Minor
            ['code' => 'GEN101', 'name' => 'Understanding the Self', 'dept' => 'CAS', 'lec' => 3, 'lab' => 0],
            ['code' => 'GEN102', 'name' => 'Contemporary World', 'dept' => 'CAS', 'lec' => 3, 'lab' => 0],
            ['code' => 'MAT101', 'name' => 'Mathematics in the Modern World', 'dept' => 'CAS', 'lec' => 3, 'lab' => 0],
        ];

        $courseMap = [];
        foreach ($courses as $c) {
            $course = Course::firstOrCreate(
                ['code' => $c['code']],
                [
                    'name' => $c['name'],
                    'department' => $c['dept'],
                    'lec_units' => $c['lec'],
                    'lab_units' => $c['lab'],
                    'is_active' => true,
                ]
            );
            $courseMap[$c['code']] = $course->id;
        }

        // 3. Seed Curricula
        $curriculaData = [
            ['name' => 'BSIT 2024 Revised', 'program_id' => $it->id, 'year' => 2024, 'status' => 'Active'],
            ['name' => 'BSCS 2024 Standard', 'program_id' => $cs->id, 'year' => 2024, 'status' => 'Active'],
            ['name' => 'BSIT 2023 Legacy',  'program_id' => $it->id, 'year' => 2023, 'status' => 'Archived'],
        ];

        foreach ($curriculaData as $cd) {
            $curriculum = Curriculum::firstOrCreate(
                ['name' => $cd['name']],
                [
                    'program_id' => $cd['program_id'],
                    'effective_year' => $cd['year'],
                    'status' => $cd['status'],
                    'description' => "Example curriculum for {$cd['name']}",
                ]
            );

            // 4. Assign Courses to slots
            if ($cd['program_id'] === $it->id && $cd['status'] === 'Active') {
                $this->assign($curriculum->id, $courseMap, [
                    '1st Year' => [
                        '1st Semester' => ['ITP101', 'ITP102', 'MAT101'],
                        '2nd Semester' => ['ITP201', 'GEN101'],
                    ],
                    '2nd Year' => [
                        '1st Semester' => ['ITP202', 'GEN102'],
                        '2nd Semester' => ['ITP301'],
                    ],
                ]);
            }
        }
    }

    private function assign($curriculumId, $courseMap, $structure)
    {
        foreach ($structure as $year => $sems) {
            foreach ($sems as $sem => $codes) {
                foreach ($codes as $idx => $code) {
                    if (isset($courseMap[$code])) {
                        CurriculumCourse::create([
                            'curriculum_id' => $curriculumId,
                            'course_id'     => $courseMap[$code],
                            'year_level'    => $year,
                            'semester'      => $sem,
                            'order'         => $idx,
                        ]);
                    }
                }
            }
        }
    }
}
