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
        Schema::create('student_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->index()->constrained()->onDelete('cascade');
            $table->string('skill');
            $table->enum('proficiency', ['beginner', 'intermediate', 'advanced'])->default('beginner');
            $table->enum('source', ['self_assessed', 'activity_derived', 'faculty_verified'])->default('self_assessed');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_skills');
    }
};
