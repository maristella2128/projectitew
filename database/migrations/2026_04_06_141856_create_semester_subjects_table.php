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
        Schema::create('semester_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('semester_record_id')->constrained()->onDelete('cascade');
            $table->string('subject_code');
            $table->string('subject_name');
            $table->unsignedTinyInteger('units');
            $table->decimal('grade', 4, 2)->nullable();
            $table->enum('status', ['passed', 'failed', 'ongoing', 'dropped'])->default('ongoing');
            $table->boolean('is_retake')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('semester_subjects');
    }
};
