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
        Schema::create('schedules', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('section_id')->constrained()->onDelete('cascade');
            $blueprint->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $blueprint->string('subject');
            $blueprint->enum('day', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
            $blueprint->time('start_time');
            $blueprint->time('end_time');
            $blueprint->string('room')->nullable();
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
