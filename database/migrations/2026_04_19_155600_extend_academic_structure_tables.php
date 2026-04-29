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
        // Extend Programs
        Schema::table('programs', function (Blueprint $table) {
            if (!Schema::hasColumn('programs', 'curriculum_version')) {
                $table->string('curriculum_version')->nullable()->after('name');
            }
            if (!Schema::hasColumn('programs', 'total_units')) {
                $table->integer('total_units')->default(0)->after('curriculum_version');
            }
        });

        // Extend Sections
        Schema::table('sections', function (Blueprint $table) {
            if (!Schema::hasColumn('sections', 'semester')) {
                $table->integer('semester')->default(1)->after('school_year');
            }
            if (!Schema::hasColumn('sections', 'max_capacity')) {
                $table->integer('max_capacity')->default(50)->after('semester');
            }
        });

        // Extend Curriculum Subjects for Prerequisites
        Schema::table('curriculum_subjects', function (Blueprint $table) {
            if (!Schema::hasColumn('curriculum_subjects', 'prerequisite_code')) {
                $table->string('prerequisite_code')->nullable()->after('is_required');
            }
        });

        // Extend Semester Subjects for Grading Status
        Schema::table('semester_subjects', function (Blueprint $table) {
            if (!Schema::hasColumn('semester_subjects', 'grading_status')) {
                $table->string('grading_status')->default('not_yet_graded')->after('status');
                // Statuses: not_yet_graded, encoded, submitted, approved, locked
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('programs', function (Blueprint $table) {
            $table->dropColumn(['curriculum_version', 'total_units']);
        });
        Schema::table('sections', function (Blueprint $table) {
            $table->dropColumn(['semester', 'max_capacity']);
        });
        Schema::table('curriculum_subjects', function (Blueprint $table) {
            $table->dropColumn('prerequisite_code');
        });
        Schema::table('semester_subjects', function (Blueprint $table) {
            $table->dropColumn('grading_status');
        });
    }
};
