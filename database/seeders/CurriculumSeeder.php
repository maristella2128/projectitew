<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Program;
use App\Models\Curriculum;
use App\Models\Course;
use App\Models\Student;
use Illuminate\Support\Facades\DB;

class CurriculumSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Core Courses
        $courses = [
            ['code' => 'ITP101', 'name' => 'Introduction to Computing', 'lec_units' => 2, 'lab_units' => 1, 'type' => 'Core'],
            ['code' => 'ITP102', 'name' => 'Computer Programming 1', 'lec_units' => 2, 'lab_units' => 1, 'type' => 'Core'],
            ['code' => 'ITP103', 'name' => 'Computer Programming 2', 'lec_units' => 2, 'lab_units' => 1, 'type' => 'Core'],
            ['code' => 'ITP104', 'name' => 'Data Structures and Algorithms', 'lec_units' => 2, 'lab_units' => 1, 'type' => 'Core'],
            ['code' => 'ENG101', 'name' => 'Purposive Communication', 'lec_units' => 3, 'lab_units' => 0, 'type' => 'GE'],
            ['code' => 'MATH101', 'name' => 'Mathematics in the Modern World', 'lec_units' => 3, 'lab_units' => 0, 'type' => 'GE'],
            ['code' => 'NSTP1', 'name' => 'National Service Training Program 1', 'lec_units' => 3, 'lab_units' => 0, 'type' => 'Other'],
            ['code' => 'PED1', 'name' => 'Physical Education 1', 'lec_units' => 2, 'lab_units' => 0, 'type' => 'Other'],
        ];

        foreach ($courses as $c) {
            Course::updateOrCreate(['code' => $c['code']], $c);
        }

        // 2. Seed BSCS Curriculum
        $bscs = Program::find(1);
        if ($bscs) {
            $curr = Curriculum::updateOrCreate(
                ['name' => 'BSCS 2024 Standard', 'program_id' => $bscs->id],
                ['effective_year' => 2024, 'status' => 'Active', 'description' => 'Standard curriculum for BSCS students starting 2024.']
            );

            // Add subjects to BSCS 2024
            $courseIds = Course::whereIn('code', ['ITP101', 'ITP102', 'ENG101', 'MATH101', 'NSTP1', 'PED1'])->pluck('id');
            foreach ($courseIds as $index => $id) {
                DB::table('curriculum_courses')->updateOrInsert(
                    ['curriculum_id' => $curr->id, 'course_id' => $id],
                    ['year_level' => '1st Year', 'semester' => '1st Semester', 'order' => $index]
                );
            }
            
            $bscs->update(['active_curriculum_id' => $curr->id]);
        }

        // 3. Seed BSIT Curriculum
        $bsit = Program::find(2);
        if ($bsit) {
            $curr = Curriculum::updateOrCreate(
                ['name' => 'BSIT 2024 Revised', 'program_id' => $bsit->id],
                ['effective_year' => 2024, 'status' => 'Active', 'description' => 'Revised curriculum for BSIT students with specialized tracks.']
            );

            // Add subjects to BSIT 2024
            $courseIds = Course::whereIn('code', ['ITP101', 'ITP102', 'ENG101', 'MATH101', 'NSTP1', 'PED1'])->pluck('id');
            foreach ($courseIds as $index => $id) {
                DB::table('curriculum_courses')->updateOrInsert(
                    ['curriculum_id' => $curr->id, 'course_id' => $id],
                    ['year_level' => '1st Year', 'semester' => '1st Semester', 'order' => $index]
                );
            }

            $bsit->update(['active_curriculum_id' => $curr->id]);
        }

        // 4. Assign Curricula to Students
        $bscsCurr = Curriculum::where('name', 'BSCS 2024 Standard')->first();
        $bsitCurr = Curriculum::where('name', 'BSIT 2024 Revised')->first();

        // Assign to some students for testing
        Student::find(9)?->update(['curriculum_id' => $bscsCurr?->id, 'course' => 'BSCS']);
        Student::find(10)?->update(['curriculum_id' => $bsitCurr?->id, 'course' => 'BSIT']);
        
        // Broadly assign to others
        Student::where('course', 'BSCS')->update(['curriculum_id' => $bscsCurr?->id]);
        Student::where('course', 'BSIT')->update(['curriculum_id' => $bsitCurr?->id]);
    }
}
