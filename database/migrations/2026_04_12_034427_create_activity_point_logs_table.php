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
        Schema::create('activity_point_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->index()->constrained()->onDelete('cascade');
            $table->foreignId('student_activity_id')->index()->constrained('student_activities')->onDelete('cascade');
            $table->integer('points');
            $table->string('reason');
            $table->string('academic_year');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_point_logs');
    }
};
