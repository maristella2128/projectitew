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
        Schema::table('students', function (Blueprint $table) {
            $table->foreignId('curriculum_id')->nullable()->constrained('curricula')->nullOnDelete();
        });

        Schema::table('grades', function (Blueprint $table) {
            // Link to the specific course entry within a curriculum
            $table->foreignId('curriculum_course_id')->nullable()->constrained('curriculum_courses')->onDelete('cascade');
            // Redundant but helpful for quick lookup
            $table->foreignId('course_id')->nullable()->constrained('courses')->onDelete('cascade');
            $table->decimal('grade_value', 5, 2)->nullable(); // Numeric grade
            $table->enum('status', ['Passed', 'Failed', 'INC', 'Ongoing', 'Dropped'])->default('Ongoing');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropConstrainedForeignId('curriculum_id');
        });

        Schema::table('grades', function (Blueprint $table) {
            $table->dropConstrainedForeignId('curriculum_course_id');
            $table->dropConstrainedForeignId('course_id');
            $table->dropColumn(['grade_value', 'status']);
        });
    }
};
