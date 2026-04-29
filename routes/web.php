<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Helpers\SpaRouting as Inertia;

Route::get('/debug-db', function () {
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        $tables = \Illuminate\Support\Facades\DB::select('SHOW TABLES');
        return response()->json([
            'status' => 'success',
            'message' => 'Database connection is working!',
            'tables' => count($tables),
            'session_driver' => config('session.driver'),
            'app_env' => config('app.env'),
            'app_url' => config('app.url'),
            'ca_path' => env('MYSQL_ATTR_SSL_CA'),
            'ca_exists' => file_exists(base_path(env('MYSQL_ATTR_SSL_CA'))),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
});

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

// ── AUTH ROUTES ──

// Login page (GET) — renders Welcome.jsx
Route::get('/', [AuthenticatedSessionController::class, 'create'])
     ->name('login')
     ->middleware('guest');

// Login submit (POST) — MUST be a separate POST route
Route::post('/login', [AuthenticatedSessionController::class, 'store'])
     ->middleware('guest');

// Register submit (POST)
Route::post('/register', [RegisteredUserController::class, 'store'])
     ->middleware('guest');

// Logout
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
     ->name('logout')
     ->middleware('auth');

// Public-facing Candidate Self-Registration Form (no auth)
use App\Http\Controllers\PublicFormController;
Route::get('/form', [PublicFormController::class, 'show'])->name('public.form.show');
Route::post('/form/validate', [PublicFormController::class, 'validateCode'])->name('public.form.validate');
Route::post('/form/submit', [PublicFormController::class, 'submit'])->name('public.form.submit');

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AchievementController;
use App\Http\Controllers\AdmissionController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ActivityEnrollmentController;
use App\Http\Controllers\ActivityAttendanceController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CurriculumController;

Route::get('/dashboard', [DashboardController::class, 'index'])
     ->middleware(['auth'])
     ->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    // Schedules
    Route::resource('schedules', ScheduleController::class);
    Route::post('schedules/sections/{section}/generate', [ScheduleController::class, 'generateSuggested'])->name('schedules.generate');
    Route::post('schedules/sections/{section}/approve', [ScheduleController::class, 'approve'])->name('schedules.approve');

    // Announcements
    Route::get('announcements/latest', [AnnouncementController::class, 'latest'])->name('announcements.latest');
    Route::resource('announcements', AnnouncementController::class);
    Route::post('announcements/{announcement}/read', [AnnouncementController::class, 'markAsRead'])->name('announcements.read');
    Route::get('announcements/{announcement}/receipts', [AnnouncementController::class, 'readReceipts'])->name('announcements.receipts');

    // Achievements
    Route::resource('achievements', AchievementController::class);

    // Admissions (legacy)
    Route::get('/admissions', [AdmissionController::class, 'index'])->name('admissions.index');
    Route::get('/admissions/search', [AdmissionController::class, 'search'])->name('admissions.search');
    Route::get('/admissions/{application}', [AdmissionController::class, 'show'])->name('admissions.show');
    Route::patch('/admissions/{application}', [AdmissionController::class, 'update'])->name('admissions.update');
    Route::post('/admissions/{application}/enroll', [AdmissionController::class, 'enroll'])->name('admissions.enroll');

    // Candidates
    Route::get('/candidates', [CandidateController::class, 'index'])->name('candidates.index');
    Route::post('/candidates', [CandidateController::class, 'store'])->name('candidates.store');
    Route::get('/candidates/{id}', [CandidateController::class, 'show'])->name('candidates.show');
    Route::patch('/candidates/{candidate}/status', [CandidateController::class, 'updateStatus'])->name('candidates.updateStatus');
    Route::post('/candidates/{candidate}/enroll', [CandidateController::class, 'enroll'])->name('candidates.enroll');

    // Reports
    Route::get('/reports/student/{student}/profile', [ReportController::class, 'studentProfile'])->name('reports.student.profile');
    Route::get('/reports/student/{student}/report-card', [ReportController::class, 'reportCard'])->name('reports.student.report-card');
    Route::get('/reports/overall/pdf', [ReportController::class, 'overallPdf'])->name('reports.overall.pdf');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Students
    Route::get('/students/search', [\App\Http\Controllers\StudentController::class, 'search'])
        ->name('students.search');
    Route::get('/students/all/report-data', [\App\Http\Controllers\StudentController::class, 'reportData'])
        ->name('students.report-data');
    Route::resource('students', \App\Http\Controllers\StudentController::class);
    
    // Sections
    Route::delete('/sections/program/{course}', [\App\Http\Controllers\SectionController::class, 'destroyProgram'])
        ->name('sections.destroy_program');
    Route::patch('/sections/{section}/assign-student', [\App\Http\Controllers\SectionController::class, 'assignStudent'])
        ->name('sections.assign-student');
    Route::resource('sections', \App\Http\Controllers\SectionController::class);
    
    // Grades
    Route::get('/grades/sections/{section}/encoding-grid', [\App\Http\Controllers\GradeController::class, 'getEncodingGrid'])->name('grades.encoding-grid');
    Route::post('/api/semester-subjects/batch', [\App\Http\Controllers\GradeController::class, 'batchUpsert'])->name('semester-subjects.batch');
    Route::post('/api/semester-subjects/batch-submit', [\App\Http\Controllers\GradeController::class, 'batchSubmit'])->name('semester-subjects.batch-submit');
    Route::get('/api/students/{student}/curriculum-progress', [\App\Http\Controllers\GradeController::class, 'curriculumProgress'])->name('students.curriculum-progress');
    Route::resource('grades', \App\Http\Controllers\GradeController::class);
    
    // ── Curriculum Progress (merged page) ──
    Route::get('/curriculum', [CurriculumController::class, 'index'])->name('curriculum.index');
    
    // Attendance
    Route::get('/attendance/student/{student}', [\App\Http\Controllers\AttendanceController::class, 'studentHistory'])
        ->name('attendance.student-history');
    Route::get('/attendance/export-monthly/{section_id}/{month}', [\App\Http\Controllers\AttendanceController::class, 'exportMonthly'])
        ->name('attendance.export-monthly');
    Route::resource('attendance', \App\Http\Controllers\AttendanceController::class);
    
    // Conduct Management
    Route::redirect('behavior', 'conduct');
    Route::get('conduct', [\App\Http\Controllers\BehaviorLogController::class, 'index'])->name('conduct.index');
    Route::post('conduct', [\App\Http\Controllers\BehaviorLogController::class, 'store'])->name('conduct.store');
    Route::patch('conduct/{behavior}', [\App\Http\Controllers\BehaviorLogController::class, 'update'])->name('conduct.update');
    Route::patch('conduct/{behavior}/resolve', [\App\Http\Controllers\BehaviorLogController::class, 'resolve'])->name('conduct.resolve');
    Route::delete('conduct/{behavior}', [\App\Http\Controllers\BehaviorLogController::class, 'destroy'])->name('conduct.destroy');

    // Student Conduct Timeline
    Route::get('conduct/student/{student}', [\App\Http\Controllers\ConductController::class, 'timeline'])->name('conduct.student');

    // Clearance Management
    Route::get('clearance', [\App\Http\Controllers\ClearanceController::class, 'index'])->name('clearance.index');
    Route::patch('clearance/{clearance}/override', [\App\Http\Controllers\ClearanceController::class, 'override'])->name('clearance.override');
    Route::post('clearance/batch-evaluate', [\App\Http\Controllers\ClearanceController::class, 'batchEvaluate'])->name('clearance.batch-evaluate');
    Route::get('clearance/export', [\App\Http\Controllers\ClearanceController::class, 'exportClearanceList'])->name('clearance.export');

    // Conduct Alerts
    Route::patch('conduct-alerts/{alert}/resolve', [\App\Http\Controllers\ConductAlertController::class, 'resolve'])->name('conduct-alerts.resolve');
    Route::get('conduct-alerts/unresolved', [\App\Http\Controllers\ConductAlertController::class, 'unresolved'])->name('conduct-alerts.unresolved');

    
    // Academic Records Overview
    Route::get('/academic-records', [\App\Http\Controllers\AcademicRecordsController::class, 'index'])->name('academic-records.index');
    
    // Extracurriculars & Engagement
    Route::resource('extracurriculars', \App\Http\Controllers\ExtracurricularController::class);
    Route::resource('student-activities', \App\Http\Controllers\StudentActivityController::class);

    // Activity Catalog
    Route::middleware(['role:dean|professor|students'])->group(function () {
        Route::get('/activities', [ActivityController::class, 'index'])->name('activities.index');
        Route::get('/activities/{activity}', [ActivityController::class, 'show'])->name('activities.show');
    });

    Route::middleware(['role:dean'])->group(function () {
        Route::post('/activities', [ActivityController::class, 'store'])->name('activities.store');
        Route::put('/activities/{activity}', [ActivityController::class, 'update'])->name('activities.update');
        Route::delete('/activities/{activity}', [ActivityController::class, 'destroy'])->name('activities.destroy');
        
        // Admin Student Management for Activities
        Route::post('/activities/{activity}/students/bulk', [ActivityEnrollmentController::class, 'bulkAdd'])->name('activities.students.bulk');
        Route::delete('/activities/{activity}/enrollments/{enrollment}', [ActivityEnrollmentController::class, 'destroy'])->name('activities.enrollments.destroy');
    });

    Route::middleware(['role:students'])->group(function () {
        Route::post('/activities/{activity}/enroll', [ActivityEnrollmentController::class, 'store'])->name('activities.enroll');
        Route::patch('/activities/{activity}/withdraw', [ActivityEnrollmentController::class, 'withdraw'])->name('activities.withdraw');
    });

    Route::middleware(['role:dean|professor'])->group(function () {
        Route::post('/activities/{activity}/attendance', [ActivityAttendanceController::class, 'markAttended'])->name('activities.attendance');
    });
    Route::post('students/{student}/skills', [\App\Http\Controllers\StudentSkillController::class, 'store']);
    Route::delete('skills/{skill}', [\App\Http\Controllers\StudentSkillController::class, 'destroy']);
    Route::get('leaderboard', [\App\Http\Controllers\LeaderboardController::class, 'index'])->name('leaderboard.index');

    // Enrollment History
    Route::resource('enrollment-history', \App\Http\Controllers\EnrollmentController::class);
    
    // Health Records & Clinical Registry
    Route::get('/health', [\App\Http\Controllers\HealthDirectoryController::class, 'index'])->name('health.index');
    Route::get('/health/{healthRecord}/pdf', [\App\Http\Controllers\HealthCertificatePdfController::class, 'generate'])
         ->name('health.certificate.pdf');

    // Health Directory API Routes (Programs -> Sections -> Students)
    Route::get('/api/health/programs/{program}/sections', [\App\Http\Controllers\HealthDirectoryController::class, 'getSections']);
    Route::get('/api/health/sections/{section}/students', [\App\Http\Controllers\HealthDirectoryController::class, 'getStudents']);
    Route::get('/api/health/students/{student}/profile', [\App\Http\Controllers\HealthDirectoryController::class, 'getStudentProfile']);

    // Medical Document Management
    Route::post('/api/health/students/{student}/documents', [\App\Http\Controllers\HealthDirectoryController::class, 'uploadDocument']);
    Route::delete('/api/health/documents/{document}', [\App\Http\Controllers\HealthDirectoryController::class, 'deleteDocument']);
    
    // Documents
    Route::resource('documents', \App\Http\Controllers\DocumentController::class);
    Route::post('/api/section-documents', [\App\Http\Controllers\DocumentController::class, 'storeForSection'])->middleware('auth');

    // Student Documents
    Route::post('/students/{student}/documents', [\App\Http\Controllers\StudentDocumentController::class, 'store'])->name('student-documents.store');
    Route::delete('/student-documents/{document}', [\App\Http\Controllers\StudentDocumentController::class, 'destroy'])->name('student-documents.destroy');
    Route::get('/student-documents/{document}/download', [\App\Http\Controllers\StudentDocumentController::class, 'download'])->name('student-documents.download');
    
    // ── Academic & Curriculum Actions ──
    // /curricula resource index already renders Curriculum/Index.jsx (merged page)
    Route::put('/student-profile/{student}', [\App\Http\Controllers\StudentProfileController::class, 'update'])->name('student-profile.update');

    // Semester Records & Subjects
    Route::post('/students/{student}/semester-records', [\App\Http\Controllers\SemesterRecordController::class, 'storeRecord'])->name('semester-records.store');
    Route::put('/semester-records/{record}', [\App\Http\Controllers\SemesterRecordController::class, 'updateRecord'])->name('semester-records.update');
    Route::delete('/semester-records/{record}', [\App\Http\Controllers\SemesterRecordController::class, 'destroyRecord'])->name('semester-records.destroy');
    
    Route::post('/semester-records/{record}/subjects', [\App\Http\Controllers\SemesterRecordController::class, 'storeSubject'])->name('semester-subjects.store');
    Route::put('/semester-subjects/{subject}', [\App\Http\Controllers\SemesterRecordController::class, 'updateSubject'])->name('semester-subjects.update');
    Route::delete('/semester-subjects/{subject}', [\App\Http\Controllers\SemesterRecordController::class, 'destroySubject'])->name('semester-subjects.destroy');
    
    // Exports
    Route::get('/exports/student-summary/{student}', [\App\Http\Controllers\ExportController::class, 'studentSummaryPdf'])->name('exports.student-summary');
    Route::get('/exports/grade-report', [\App\Http\Controllers\ExportController::class, 'gradeReportExcel'])->name('exports.grade-report');
    Route::get('/exports/profile', [\App\Http\Controllers\ExportController::class, 'exportProfile'])->name('exports.profile');
    Route::get('/students/{student}/portfolio', [\App\Http\Controllers\PortfolioController::class, 'generate'])->name('students.portfolio');
    Route::get('/students/advanced-filter', [\App\Http\Controllers\GradeController::class, 'advancedFilter'])->name('students.advanced-filter');
    
    // Analytics (Dean Only)
    Route::get('/analytics', [\App\Http\Controllers\AnalyticsController::class, 'index'])
        ->middleware('role:dean')
        ->name('analytics.index');

    // Web Customization (Dean Only)
    Route::get('/web-customization', [\App\Http\Controllers\WebCustomizationController::class, 'index'])
        ->middleware('role:dean')
        ->name('web-customization.index');
    Route::post('/web-customization', [\App\Http\Controllers\WebCustomizationController::class, 'update'])
        ->middleware('role:dean')
        ->name('web-customization.update');

    // Users and Roles Management (Dean Only)
    Route::get('/access-roles', [\App\Http\Controllers\UserRoleController::class, 'index'])
        ->middleware('role:dean')
        ->name('user-roles.index');
    Route::post('/access-roles', [\App\Http\Controllers\UserRoleController::class, 'store'])
        ->middleware('role:dean')
        ->name('user-roles.store');
    Route::patch('/access-roles/{user}', [\App\Http\Controllers\UserRoleController::class, 'update'])
        ->middleware('role:dean')
        ->name('user-roles.update');
    Route::delete('/access-roles/{user}', [\App\Http\Controllers\UserRoleController::class, 'destroy'])
        ->middleware('role:dean')
        ->name('user-roles.destroy');

    // API Endpoints for Programs & Sections SPA
    Route::get('/api/programs', [\App\Http\Controllers\Api\ProgramSectionController::class, 'getPrograms'])->name('api.programs.index');
    Route::post('/api/programs', [\App\Http\Controllers\Api\ProgramSectionController::class, 'storeProgram'])->name('api.programs.store');
    Route::patch('/api/programs/{code}', [\App\Http\Controllers\Api\ProgramSectionController::class, 'updateProgram'])->name('api.programs.update');
    Route::delete('/api/programs/{code}', [\App\Http\Controllers\Api\ProgramSectionController::class, 'destroyProgram'])->name('api.programs.destroy');
    Route::get('/api/programs/{code}/sections', [\App\Http\Controllers\Api\ProgramSectionController::class, 'getSections'])->name('api.programs.sections.index');
    Route::post('/api/programs/{code}/sections', [\App\Http\Controllers\Api\ProgramSectionController::class, 'storeSection'])->name('api.programs.sections.store');
    Route::delete('/api/sections/{id}', [\App\Http\Controllers\Api\ProgramSectionController::class, 'destroySection'])->name('api.sections.destroy');
    Route::patch('/api/sections/{id}', [\App\Http\Controllers\Api\ProgramSectionController::class, 'updateSection'])->name('api.sections.update');

    // Section Roster & Directory Endpoints
    Route::get('/api/directory/teachers', [\App\Http\Controllers\Api\ProgramSectionController::class, 'getTeachers'])->name('api.directory.teachers');
    Route::get('/api/directory/students', [\App\Http\Controllers\Api\ProgramSectionController::class, 'getStudents'])->name('api.directory.students');
    Route::get('/api/sections/{id}/details', [\App\Http\Controllers\Api\ProgramSectionController::class, 'getSectionDetails'])->name('api.sections.details');
    Route::patch('/api/sections/{id}/adviser', [\App\Http\Controllers\Api\ProgramSectionController::class, 'updateAdviser'])->name('api.sections.adviser');
    Route::post('/api/sections/{id}/assign-students', [\App\Http\Controllers\Api\ProgramSectionController::class, 'assignStudents'])->name('api.sections.assign_students');
    Route::post('/api/sections/{id}/sync-grades', [\App\Http\Controllers\Api\ProgramSectionController::class, 'syncSectionGrades'])->name('api.sections.sync_grades');
    Route::delete('/api/sections/{id}/remove-student/{studentId}', [\App\Http\Controllers\Api\ProgramSectionController::class, 'removeStudent'])->name('api.sections.remove_student');

    // Section Grade Encoding Endpoints
    Route::get('/api/sections/{id}/grades', [\App\Http\Controllers\Api\ProgramSectionController::class, 'getSectionGrades'])->name('api.sections.grades');
    Route::patch('/api/grades/{subjectId}/inline-update', [\App\Http\Controllers\Api\ProgramSectionController::class, 'updateInlineGrade'])->name('api.grades.inline_update');

    // Clearance Management (New)
    Route::get('/api/students/{student}/clearance', [\App\Http\Controllers\Api\ClearanceController::class, 'show']);
    Route::post('/api/clearance-entries/initialize', [\App\Http\Controllers\Api\ClearanceController::class, 'initialize']);
    Route::patch('/api/clearance-entries/{id}/clear', [\App\Http\Controllers\Api\ClearanceController::class, 'markCleared']);
    Route::patch('/api/clearance-entries/{id}/hold', [\App\Http\Controllers\Api\ClearanceController::class, 'markOnHold']);
    Route::patch('/api/clearance-entries/{id}/revoke', [\App\Http\Controllers\Api\ClearanceController::class, 'revoke']);

    // Grade Management (New)
    Route::get('/api/grade-entries', [\App\Http\Controllers\Api\GradeEntryController::class, 'index']);
    Route::post('/api/grade-entries/batch', [\App\Http\Controllers\Api\GradeEntryController::class, 'batchStore']);
    Route::post('/api/grade-entries/batch-submit', [\App\Http\Controllers\Api\GradeEntryController::class, 'batchSubmit']);
    Route::patch('/api/grade-entries/{id}', [\App\Http\Controllers\Api\GradeEntryController::class, 'update']);
    Route::post('/api/grade-entries/{id}/submit', [\App\Http\Controllers\Api\GradeEntryController::class, 'submit']);
    Route::post('/api/grade-entries/{id}/approve', [\App\Http\Controllers\Api\GradeEntryController::class, 'approve']);
    Route::post('/api/grade-entries/{id}/lock', [\App\Http\Controllers\Api\GradeEntryController::class, 'lock']);

    // Folders Management
    Route::get('/api/folders', [\App\Http\Controllers\FolderController::class, 'index'])->name('api.folders.index');
    Route::post('/api/folders', [\App\Http\Controllers\FolderController::class, 'store'])->name('api.folders.store');
    Route::get('/api/folders/{folder}', [\App\Http\Controllers\FolderController::class, 'show'])->name('api.folders.show');
    Route::post('/api/folders/{folder}/upload', [\App\Http\Controllers\FolderController::class, 'uploadToFolder'])->name('api.folders.upload');
    Route::delete('/api/folders/{folder}', [\App\Http\Controllers\FolderController::class, 'destroy'])->name('api.folders.destroy');
    Route::get('/api/sections/{section}/folders', [\App\Http\Controllers\FolderController::class, 'sectionFolders'])->name('api.sections.folders');

    // ── Courses (master list) — index redirects to merged /curriculum page ──
    Route::redirect('/courses', '/curriculum?tab=courses', 302);
    Route::resource('courses', CourseController::class)
        ->except(['index', 'create', 'edit', 'show']);

    // ── Curricula ──
    // Index (/curricula GET) renders merged Curriculum/Index.jsx via controller
    Route::resource('curricula', CurriculumController::class)
        ->except(['create', 'edit']);

    // ── Curriculum course management ──
    Route::post('/curricula/{curriculum}/courses', [CurriculumController::class, 'addCourse'])
        ->name('curricula.courses.add');
    Route::delete('/curricula/{curriculum}/courses/{course}', [CurriculumController::class, 'removeCourse'])
        ->name('curricula.courses.remove');
});

require __DIR__.'/auth.php';

// ── ADMIN / DEAN DASHBOARD ──
// Removed duplicate closure route

// ── STUDENT PORTAL ROUTES ──
Route::middleware(['auth', 'student'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard',             [\App\Http\Controllers\StudentController::class, 'dashboard'])           ->name('dashboard');
    Route::get('/profile/personal',      [\App\Http\Controllers\StudentController::class, 'profilePersonal'])     ->name('profile.personal');
    Route::get('/profile/enrollment',    [\App\Http\Controllers\StudentController::class, 'profileEnrollment'])   ->name('profile.enrollment');
    Route::get('/profile/id',            [\App\Http\Controllers\StudentController::class, 'profileId'])           ->name('profile.id');
    Route::get('/grades/current',        [\App\Http\Controllers\StudentController::class, 'gradesCurrent'])       ->name('grades.current');
    Route::get('/grades/history',        [\App\Http\Controllers\StudentController::class, 'gradesHistory'])       ->name('grades.history');
    Route::get('/grades/gpa',            [\App\Http\Controllers\StudentController::class, 'gradesGpa'])           ->name('grades.gpa');
    Route::get('/schedule/timetable',    [\App\Http\Controllers\StudentController::class, 'scheduleTimetable'])   ->name('schedule.timetable');
    Route::get('/schedule/exams',        [\App\Http\Controllers\StudentController::class, 'scheduleExams'])       ->name('schedule.exams');
    Route::get('/attendance/record',     [\App\Http\Controllers\StudentController::class, 'attendanceRecord'])    ->name('attendance.record');
    Route::get('/attendance/absences',   [\App\Http\Controllers\StudentController::class, 'attendanceAbsences'])  ->name('attendance.absences');
    Route::get('/documents/official',    [\App\Http\Controllers\StudentController::class, 'documentsOfficial'])   ->name('documents.official');
    Route::get('/documents/materials',   [\App\Http\Controllers\StudentController::class, 'documentsMaterials'])  ->name('documents.materials');
    Route::get('/documents/assignments', [\App\Http\Controllers\StudentController::class, 'documentsAssignments'])->name('documents.assignments');
    Route::get('/clearance',             [\App\Http\Controllers\StudentController::class, 'clearance'])           ->name('clearance');
    Route::get('/announcements',         [\App\Http\Controllers\StudentController::class, 'announcements'])       ->name('announcements');
    Route::get('/messages',              [\App\Http\Controllers\StudentController::class, 'messages'])            ->name('messages');
});
