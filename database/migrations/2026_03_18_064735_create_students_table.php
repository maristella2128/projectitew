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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->foreignId('section_id')->nullable()->constrained()->onDelete('set null');
            $table->string('lrn')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('middle_name')->nullable();
            $table->date('birthdate');
            $table->enum('gender', ['male', 'female', 'other']);
            $table->text('address');
            $table->string('photo')->nullable();
            $table->string('guardian_name');
            $table->string('guardian_contact');
            $table->string('guardian_relationship');
            $table->string('grade_level');
            $table->enum('enrollment_status', ['enrolled', 'dropped', 'transferred', 'graduated']);
            $table->string('school_year');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
