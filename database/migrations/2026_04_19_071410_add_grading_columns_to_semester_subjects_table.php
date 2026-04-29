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
        Schema::table('semester_subjects', function (Blueprint $table) {
            $table->decimal('prelim_grade', 5, 2)->nullable()->after('units');
            $table->decimal('midterm_grade', 5, 2)->nullable()->after('prelim_grade');
            $table->decimal('prefinal_grade', 5, 2)->nullable()->after('midterm_grade');
            $table->decimal('final_grade', 5, 2)->nullable()->after('prefinal_grade');
            $table->boolean('is_locked')->default(false)->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('semester_subjects', function (Blueprint $table) {
            $table->dropColumn([
                'prelim_grade',
                'midterm_grade',
                'prefinal_grade',
                'final_grade',
                'is_locked'
            ]);
        });
    }
};
