<?php

namespace App\Services;

use App\Models\Student;
use App\Models\Section;
use App\Models\SemesterRecord;
use App\Models\SemesterSubject;
use App\Models\CurriculumCourse;
use Illuminate\Support\Facades\DB;

class AcademicService
{
    /**
     * Step 1-5: Semester-Locked Enrollment Logic
     */
    public function enrollStudent(Student $student, Section $section)
    {
        return DB::transaction(function () use ($student, $section) {
            $programCode = $section->program_code;
            $yearLevel = (int) filter_var($section->grade_level, FILTER_SANITIZE_NUMBER_INT);
            $semester = (int) $section->semester;
            $academicYear = $section->school_year;

            // 1. Create or fetch Semester Record
            $record = SemesterRecord::firstOrCreate([
                'student_id' => $student->id,
                'academic_year' => $academicYear,
                'semester' => $semester,
            ], [
                'year_level' => $yearLevel,
                'status' => 'ongoing',
            ]);

            // 2. Identify active curriculum for the student's program
            $curriculumId = $section->curriculum_id ?? ($section->program ? $section->program->active_curriculum_id : null);
            if (!$curriculumId) return false;

            // 3. Pull ONLY the subjects for that exact combination
            $query = CurriculumCourse::where('curriculum_id', $curriculumId)
                ->where('year_level', $yearLevel)
                ->where('semester', $semester);

            // Special rule for Summer: Only summer offerings
            if ($semester == 3) {
                $query->where('is_summer_offering', true);
            }

            $subjects = $query->get();

            foreach ($subjects as $subject) {
                // If summer, check if student actually needs to retake it (failed)
                if ($semester == 3) {
                    $hasFailed = SemesterSubject::whereHas('semesterRecord', function($q) use ($student) {
                            $q->where('student_id', $student->id);
                        })
                        ->where('curriculum_course_id', $subject->id)
                        ->where('status', 'failed')
                        ->exists();
                    if (!$hasFailed) continue; // Don't auto-enroll summer subjects unless failed
                }
                // Validate prerequisites
                $isBlocked = !$this->checkPrerequisites($student, $subject);
                
                // Check for retake
                $isRetake = SemesterSubject::whereHas('semesterRecord', function($q) use ($student) {
                        $q->where('student_id', $student->id);
                    })
                    ->where('curriculum_course_id', $subject->id)
                    ->where('status', 'failed')
                    ->exists();

                SemesterSubject::updateOrCreate([
                    'semester_record_id' => $record->id,
                    'curriculum_course_id' => $subject->id,
                ], [
                    'subject_code' => $subject->course->code ?? $subject->subject_code,
                    'subject_name' => $subject->course->name ?? $subject->subject_name,
                    'units' => ($subject->course->lec_units ?? 0) + ($subject->course->lab_units ?? 0),
                    'enrolled_semester' => $semester,
                    'enrolled_year_level' => $yearLevel,
                    'is_retake' => $isRetake,
                    'status' => $isBlocked ? 'prerequisite_blocked' : 'ongoing',
                ]);
            }

            return $record;
        });
    }

    /**
     * Prerequisite Validation Logic
     */
    public function checkPrerequisites(Student $student, CurriculumCourse $subject)
    {
        $prereqIds = is_array($subject->prerequisite_ids) 
            ? $subject->prerequisite_ids 
            : json_decode($subject->prerequisite_ids, true);
            
        if (empty($prereqIds)) return true;

        foreach ($prereqIds as $prereqId) {
            $passed = SemesterSubject::whereHas('semesterRecord', function($q) use ($student) {
                    $q->where('student_id', $student->id);
                })
                ->where('curriculum_course_id', $prereqId)
                ->where('status', 'passed')
                ->exists();
                
            if (!$passed) return false;
        }

        return true;
    }

    /**
     * Grade Computation Logic
     * Standard 3-period (30/30/40)
     */
    public function computeGrade($prelim, $midterm, $final)
    {
        if ($prelim === null || $midterm === null || $final === null) return null;
        
        // Default 3-period: 30/30/40
        return round(($prelim * 0.30) + ($midterm * 0.30) + ($final * 0.40), 1);
    }

    /**
     * Map numeric grade to GWA scale
     */
    public function mapToGwaScale($computed)
    {
        if ($computed === null) return 5.00;

        $gwaScale = [
            [97, 100, 1.00], [94, 96, 1.25], [91, 93, 1.50],
            [88, 90, 1.75],  [85, 87, 2.00], [82, 84, 2.25],
            [79, 81, 2.50],  [76, 78, 2.75], [75, 75, 3.00],
            [65, 74, 4.00],  [0,  64, 5.00],
        ];

        foreach ($gwaScale as $s) {
            if ($computed >= $s[0] && $computed <= $s[1]) return $s[2];
        }

        return 5.00;
    }

    /**
     * Recompute Semester GWA and Honors
     */
    public function finalizeSemester(SemesterRecord $record)
    {
        $enrollments = $record->subjects;
        $gradedSubjects = $enrollments->whereIn('status', ['passed', 'failed']);

        if ($gradedSubjects->isEmpty()) {
            $record->computed_gwa = 0;
        } else {
            $totalWeighted = $gradedSubjects->sum(fn($e) => $e->gwa_equivalent * $e->units);
            $totalUnits = $gradedSubjects->sum('units');
            $record->computed_gwa = round($totalWeighted / max($totalUnits, 1), 2);
        }

        // Dean's List check
        $hasFailures = $enrollments->where('status', 'failed')->isNotEmpty();
        $hasDrops = $enrollments->where('status', 'dropped')->isNotEmpty();
        // Assuming Student has a method for conduct check
        $hasConductViolation = $record->student->conductAlerts()->where('is_resolved', false)->exists();

        $record->honors_eligibility = ($record->computed_gwa <= 1.75 && $record->computed_gwa > 0 && !$hasFailures && !$hasDrops && !$hasConductViolation);
        
        $record->save();
        
        // Progression Logic
        $this->evaluateProgression($record->student);
    }

    /**
     * Year Level Progression Rules
     */
    public function evaluateProgression(Student $student)
    {
        // 1. Regular Progression
        // Check if all required subjects for current year/sem are passed
        // This is complex, but the gist is: if current year's sems are all 'passed', advance student->grade_level
        
        // 2. Probation Flag
        $lastTwoRecords = SemesterRecord::where('student_id', $student->id)
            ->whereNotNull('computed_gwa')
            ->orderBy('created_at', 'desc')
            ->limit(2)
            ->get();

        if ($lastTwoRecords->count() === 2 && $lastTwoRecords->every(fn($r) => $r->computed_gwa > 3.0)) {
            $student->academic_status = 'probation';
            $student->save();
        }
    }
}
