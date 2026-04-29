<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\SemesterRecord;
use App\Models\SemesterSubject;
use App\Models\CurriculumSubject;
use App\Models\CapstoneProject;
use App\Models\StudentDocument;
use App\Models\User;
use App\Models\Grade;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AcademicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure at least one user exists to attach to students/documents
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
            ]);
        }

        // 1. Seed Programs
        $courseData = [
            ['code' => 'BSIT', 'name' => 'Bachelor of Science in Information Technology', 'dept' => 'College of Computing Studies'],
            ['code' => 'BSCS', 'name' => 'Bachelor of Science in Computer Science', 'dept' => 'College of Computing Studies'],
            ['code' => 'BSECE', 'name' => 'Bachelor of Science in Electronics Engineering', 'dept' => 'College of Engineering']
        ];

        foreach ($courseData as $c) {
            \App\Models\Program::firstOrCreate(
                ['code' => $c['code']],
                [
                    'name' => $c['name'],
                    'department' => $c['dept'],
                    'is_seeded' => true
                ]
            );
        }

        // 2. Seed Curriculum Subjects
        $courses = ['BSIT', 'BSCS', 'BSECE'];
        $courseNames = [
            'BSIT' => 'Bachelor of Science in Information Technology',
            'BSCS' => 'Bachelor of Science in Computer Science',
            'BSECE' => 'Bachelor of Science in Electronics Engineering'
        ];

        foreach ($courses as $course) {
            for ($year = 1; $year <= 4; $year++) {
                for ($sem = 1; $sem <= 2; $sem++) {
                    // Seed 5 subjects per semester per year
                    for ($subj = 1; $subj <= 5; $subj++) {
                        CurriculumSubject::create([
                            'course' => $course,
                            'year_level' => $year,
                            'semester' => $sem,
                            'subject_code' => $course . $year . '0' . $subj,
                            'subject_name' => "Sample Core Subject $subj for $course Year $year Sem $sem",
                            'units' => 3,
                            'is_required' => true,
                        ]);
                    }
                }
            }
        }

        // 2. Seed 50 Students with Semester Records and Subjects
        $createdStudents = [];
        for ($i = 1; $i <= 50; $i++) {
            $course = $courses[array_rand($courses)];
            $yearLevel = rand(1, 4);

            // Create a unique user per student
            $studentUser = User::create([
                'name' => 'StudentFirstName' . $i . ' StudentLastName' . $i,
                'email' => 'student' . $i . '@academic.test',
                'password' => Hash::make('password'),
            ]);

            $student = Student::create([
                'user_id' => $studentUser->id,
                'student_id' => '2026' . str_pad($i, 5, '0', STR_PAD_LEFT),
                'first_name' => 'StudentFirstName' . $i,
                'last_name' => 'StudentLastName' . $i,
                'birthdate' => '2000-01-01',
                'gender' => 'male',
                'address' => 'Sample Address',
                'guardian_name' => 'Sample Guardian',
                'guardian_contact' => '09123456789',
                'guardian_relationship' => 'Parent',
                'enrollment_status' => 'enrolled',
                'school_year' => '2025-2026',
                'course' => $course,
                'year_level' => $yearLevel,
                'academic_status' => (rand(1, 10) > 8) ? 'irregular' : 'regular',
            ]);

            $createdStudents[] = $student;

            // Seed 2 semesters of records per student
            for ($sem = 1; $sem <= 2; $sem++) {
                $record = SemesterRecord::create([
                    'student_id' => $student->id,
                    'academic_year' => '2025-2026',
                    'semester' => $sem,
                    'computed_gwa' => 0,
                ]);

                // 4 Subjects per semester
                $totalGrade = 0;
                for ($j = 1; $j <= 4; $j++) {
                    $grade = [1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 5.0][rand(0, 9)];
                    $subjectName = "Sample Core Subject $j for $course Year $yearLevel Sem $sem";
                    
                    SemesterSubject::create([
                        'semester_record_id' => $record->id,
                        'subject_code' => $course . $yearLevel . '0' . $j,
                        'subject_name' => $subjectName,
                        'units' => 3,
                        'grade' => $grade,
                        'status' => $grade == 5.0 ? 'failed' : 'passed',
                        'is_retake' => false,
                    ]);

                    // AS REQUESTED: Inject data for Academic Registry (Grade Table)
                    Grade::create([
                        'student_id' => $student->id,
                        'subject' => $subjectName,
                        'semester' => $sem,
                        'score' => rand(65, 99), // Raw score for the registry
                        'remarks' => null, // Let the model/controller handle if needed
                        'recorded_by' => $user->id,
                    ]);

                    $totalGrade += $grade;
                }

                $record->update(['computed_gwa' => $totalGrade / 4]);
            }

            // Seed sample document attachments
            $docTypes = ['transcript', 'cor', 'internship_certificate'];
            foreach ($docTypes as $docType) {
                if (rand(0, 2) > 0) { // Randomize document existence
                    StudentDocument::create([
                        'student_id' => $student->id,
                        'document_type' => $docType,
                        'file_name' => ucfirst($docType) . '_Sample.pdf',
                        'file_path' => "student-docs/{$student->id}/sample_{$docType}.pdf",
                        'file_size' => rand(512000, 2048000), // Random size between 0.5mb - 2.0mb
                        'uploaded_by' => $user->id,
                        'academic_year' => '2025-2026',
                        'semester' => rand(1, 2),
                    ]);
                }
            }
        }

        // 3. Seed 2 Capstone Projects
        if (count($createdStudents) >= 6) {
            // Capstone 1: In Development
            $cap1 = CapstoneProject::create([
                'title' => 'Next-Gen Registry Architecture',
                'adviser_name' => 'Prof. Alan Turing',
                'status' => 'development',
                'academic_year' => '2025-2026',
                'semester' => 2,
            ]);
            $cap1->members()->attach([
                $createdStudents[0]->id => ['role' => 'Leader'],
                $createdStudents[1]->id => ['role' => 'Lead Developer'],
                $createdStudents[2]->id => ['role' => 'QA Analyst'],
            ]);

            // Capstone 2: Completed Successfully
            $cap2 = CapstoneProject::create([
                'title' => 'Automated Smart Alert System for Students',
                'adviser_name' => 'Dr. Grace Hopper',
                'status' => 'completed',
                'grade' => 1.25,
                'academic_year' => '2025-2026',
                'semester' => 1,
            ]);
            $cap2->members()->attach([
                $createdStudents[3]->id => ['role' => 'Leader'],
                $createdStudents[4]->id => ['role' => 'Researcher'],
                $createdStudents[5]->id => ['role' => 'System Architect'],
            ]);
        }
    }
}
