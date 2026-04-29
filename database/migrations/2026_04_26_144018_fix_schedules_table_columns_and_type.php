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
        // Change day to VARCHAR to support "M/W" formats
        \Illuminate\Support\Facades\DB::statement(
            "ALTER TABLE schedules MODIFY COLUMN day VARCHAR(30) NOT NULL"
        );

        Schema::table('schedules', function (Blueprint $table) {
            if (!Schema::hasColumn('schedules', 'course_code')) {
                $table->string('course_code')->nullable()->after('subject');
            }
            if (!Schema::hasColumn('schedules', 'lec_units')) {
                $table->integer('lec_units')->default(3)->after('course_code');
            }
            if (!Schema::hasColumn('schedules', 'lab_units')) {
                $table->integer('lab_units')->default(0)->after('lec_units');
            }
            if (!Schema::hasColumn('schedules', 'lec_day')) {
                $table->string('lec_day', 10)->nullable()->after('day');
            }
            if (!Schema::hasColumn('schedules', 'lab_day')) {
                $table->string('lab_day', 10)->nullable()->after('lec_day');
            }
            if (!Schema::hasColumn('schedules', 'lec_start_time')) {
                $table->time('lec_start_time')->nullable()->after('start_time');
            }
            if (!Schema::hasColumn('schedules', 'lec_end_time')) {
                $table->time('lec_end_time')->nullable()->after('lec_start_time');
            }
            if (!Schema::hasColumn('schedules', 'lab_start_time')) {
                $table->time('lab_start_time')->nullable()->after('lec_end_time');
            }
            if (!Schema::hasColumn('schedules', 'lab_end_time')) {
                $table->time('lab_end_time')->nullable()->after('lab_start_time');
            }
            if (!Schema::hasColumn('schedules', 'lec_room')) {
                $table->string('lec_room')->nullable()->after('room');
            }
            if (!Schema::hasColumn('schedules', 'lab_room')) {
                $table->string('lab_room')->nullable()->after('lec_room');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->dropColumn([
                'course_code', 'lec_units', 'lab_units', 
                'lec_day', 'lab_day', 
                'lec_start_time', 'lec_end_time', 
                'lab_start_time', 'lab_end_time', 
                'lec_room', 'lab_room'
            ]);
        });
        
        \Illuminate\Support\Facades\DB::statement(
            "ALTER TABLE schedules MODIFY COLUMN day ENUM('monday','tuesday','wednesday','thursday','friday','saturday') NOT NULL"
        );
    }
};
