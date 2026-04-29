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
        Schema::create('curriculum_subjects', function (Blueprint $table) {
            $table->id();
            $table->string('course');            // Matches student.course
            $table->tinyInteger('year_level');   // 1–4
            $table->tinyInteger('semester');     // 1, 2, or 3 (summer)
            $table->string('subject_code');
            $table->string('subject_name');
            $table->tinyInteger('units');
            $table->boolean('is_required')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('curriculum_subjects');
    }
};
