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
        Schema::table('semester_records', function (Blueprint $table) {
            if (!Schema::hasColumn('semester_records', 'year_level')) {
                $table->integer('year_level')->nullable();
            }
            if (!Schema::hasColumn('semester_records', 'is_locked')) {
                $table->boolean('is_locked')->default(false);
            }
        });

        Schema::table('semester_subjects', function (Blueprint $table) {
            if (!Schema::hasColumn('semester_subjects', 'is_cross_enrolled')) {
                $table->boolean('is_cross_enrolled')->default(false);
            }
            if (!Schema::hasColumn('semester_subjects', 'enrolled_semester')) {
                $table->integer('enrolled_semester')->nullable();
            }
            if (!Schema::hasColumn('semester_subjects', 'enrolled_year_level')) {
                $table->integer('enrolled_year_level')->nullable();
            }
        });

        Schema::table('curriculum_courses', function (Blueprint $table) {
            if (!Schema::hasColumn('curriculum_courses', 'is_summer_offering')) {
                $table->boolean('is_summer_offering')->default(false);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('semester_subjects', function (Blueprint $table) {
            //
        });
    }
};
