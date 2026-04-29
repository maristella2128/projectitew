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
        Schema::table('grade_entries', function (Blueprint $table) {
            $table->foreignId('curriculum_course_id')->nullable()->after('section_id')->constrained('curriculum_courses')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('grade_entries', function (Blueprint $table) {
            $table->dropConstrainedForeignId('curriculum_course_id');
        });
    }
};
