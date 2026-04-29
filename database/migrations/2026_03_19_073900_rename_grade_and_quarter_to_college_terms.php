<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Students: grade_level -> year_level, lrn -> student_id
        Schema::table('students', function (Blueprint $table) {
            $table->renameColumn('grade_level', 'year_level');
            $table->renameColumn('lrn', 'student_id');
        });

        // 2. Applications: grade_level_applied -> year_level_applied
        Schema::table('applications', function (Blueprint $table) {
            $table->renameColumn('grade_level_applied', 'year_level_applied');
        });

        // 3. Grades: quarter -> semester
        Schema::table('grades', function (Blueprint $table) {
            $table->renameColumn('quarter', 'semester');
        });

        // 4. Schedules: grade_level -> year_level (if exists, checking logic)
        // Note: Our schedules were section-based, but let's check if we added grade_level there.
        // Looking at the previous creation, it was section_id. 
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->renameColumn('year_level', 'grade_level');
            $table->renameColumn('student_id', 'lrn');
        });

        Schema::table('applications', function (Blueprint $table) {
            $table->renameColumn('year_level_applied', 'grade_level_applied');
        });

        Schema::table('grades', function (Blueprint $table) {
            $table->renameColumn('semester', 'quarter');
        });
    }
};
