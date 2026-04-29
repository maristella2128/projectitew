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
        Schema::table('curricula', function (Blueprint $table) {
            if (!Schema::hasColumn('curricula', 'curriculum_version')) {
                $table->string('curriculum_version')->nullable()->after('name');
            }
        });

        Schema::table('semester_subjects', function (Blueprint $table) {
            if (!Schema::hasColumn('semester_subjects', 'curriculum_course_id')) {
                $table->foreignId('curriculum_course_id')->nullable()->after('semester_record_id')->constrained('curriculum_courses')->nullOnDelete();
            }
            // Ensure grade field exists (we use 'grade' for computed_grade)
            if (!Schema::hasColumn('semester_subjects', 'grade')) {
                $table->decimal('grade', 5, 2)->nullable()->after('final_grade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('curricula', function (Blueprint $table) {
            $table->dropColumn('curriculum_version');
        });

        Schema::table('semester_subjects', function (Blueprint $table) {
            $table->dropForeign(['curriculum_course_id']);
            $table->dropColumn(['curriculum_course_id', 'grade']);
        });
    }
};
