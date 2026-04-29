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
        Schema::create('health_screenings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('health_record_id')->constrained()->cascadeOnDelete();
            $table->string('school_year');                // e.g. "2024-2025"
            $table->enum('semester', ['1st', '2nd', 'summer']);
            $table->decimal('height_cm', 5, 2)->nullable();
            $table->decimal('weight_kg', 5, 2)->nullable();
            $table->decimal('bmi', 4, 2)->nullable();     // computed from height + weight
            $table->string('vision_result')->nullable();  // e.g. "20/20 both eyes"
            $table->string('hearing_result')->nullable();
            $table->string('blood_type')->nullable();
            $table->enum('dental_status', ['good', 'needs_attention', 'treated'])->nullable();
            $table->enum('clearance_status', ['cleared', 'flagged', 'pending'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('health_screenings');
    }
};
