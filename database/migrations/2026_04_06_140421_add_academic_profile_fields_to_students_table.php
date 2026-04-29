<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Clean up year_level data before changing type
        DB::table('students')->where('year_level', '1st Year')->update(['year_level' => '1']);
        DB::table('students')->where('year_level', '2nd Year')->update(['year_level' => '2']);
        DB::table('students')->where('year_level', '3rd Year')->update(['year_level' => '3']);
        DB::table('students')->where('year_level', '4th Year')->update(['year_level' => '4']);
        // Handle garbage data
        DB::table('students')
            ->whereNotNull('year_level')
            ->whereNotIn('year_level', ['1', '2', '3', '4'])
            ->update(['year_level' => '1']);

        Schema::table('students', function (Blueprint $table) {
            if (!Schema::hasColumn('students', 'course')) {
                $table->string('course')->after('guardian_relationship')->nullable();
            }
            if (!Schema::hasColumn('students', 'major')) {
                $table->string('major')->nullable()->after('course');
            }
            
            // Re-assert column type for year_level
            $table->unsignedTinyInteger('year_level')->nullable()->change();

            if (!Schema::hasColumn('students', 'academic_status')) {
                $table->enum('academic_status', ['regular', 'irregular', 'probation', 'graduated'])
                      ->default('regular')
                      ->after('year_level');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['course', 'major', 'academic_status']);
            $table->string('year_level')->nullable()->change();
        });
    }
};
