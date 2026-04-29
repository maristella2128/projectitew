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
        Schema::create('student_conduct_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->unique()->constrained('students')->onDelete('cascade');
            $table->integer('total_score')->default(100);
            $table->integer('violation_count')->default(0);
            $table->integer('commendation_count')->default(0);
            $table->integer('high_severity_count')->default(0);
            $table->integer('medium_severity_count')->default(0);
            $table->integer('low_severity_count')->default(0);
            $table->timestamp('last_violation_at')->nullable();
            $table->timestamp('last_commendation_at')->nullable();
            $table->timestamp('last_computed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_conduct_scores');
    }
};
