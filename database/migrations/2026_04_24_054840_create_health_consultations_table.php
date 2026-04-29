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
        Schema::create('health_consultations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('health_record_id')->constrained()->cascadeOnDelete();
            $table->text('chief_complaint');
            $table->text('symptoms')->nullable();
            $table->json('vital_signs')->nullable();
            // vital_signs JSON shape: { blood_pressure: "120/80", temperature: "36.5", heart_rate: "72", weight: "60" }
            $table->string('diagnosis')->nullable();
            $table->string('icd_code')->nullable();         // e.g. "J06.9"
            $table->text('prescribed_medication')->nullable();
            $table->string('attending_physician')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('health_consultations');
    }
};
