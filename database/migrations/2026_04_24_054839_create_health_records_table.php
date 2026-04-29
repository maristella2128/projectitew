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
        Schema::create('health_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->enum('record_type', [
                'consultation',
                'medical_certificate',
                'immunization',
                'incident',
                'health_screening',
                'allergy_condition',
            ]);
            $table->enum('status', ['active', 'resolved', 'expired', 'flagged'])->default('active');
            $table->string('academic_block')->nullable();    // e.g. "2024-2025 1st Sem"
            $table->text('notes')->nullable();              // general notes / summary
            $table->date('record_date');                    // when the event happened
            $table->date('follow_up_date')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('health_records');
    }
};
