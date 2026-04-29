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
        Schema::create('student_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->index()->constrained()->onDelete('cascade');
            $table->foreignId('extracurricular_activity_id')->index()->constrained()->onDelete('cascade');

            $table->unique(['student_id', 'extracurricular_activity_id', 'academic_year'], 'student_activity_unique');
            $table->enum('role', ['member', 'officer', 'president', 'coach', 'participant', 'winner'])->default('member');
            $table->string('academic_year');
            $table->tinyInteger('semester')->nullable();
            $table->enum('status', ['active', 'completed', 'dropped'])->default('active');
            $table->string('achievement')->nullable();
            $table->integer('points_awarded');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_activities');
    }
};
