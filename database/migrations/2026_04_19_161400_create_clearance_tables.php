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
        Schema::create('clearance_departments', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('role_required')->nullable(); // role that can clear this dept
            $table->timestamps();
        });

        Schema::create('clearance_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('semester_record_id')->constrained()->onDelete('cascade');
            $table->foreignId('department_id')->constrained('clearance_departments')->onDelete('cascade');
            $table->string('status')->default('pending'); // pending, cleared, hold
            $table->text('note')->nullable();
            $table->foreignId('cleared_by')->nullable()->constrained('users');
            $table->timestamp('cleared_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clearance_entries');
        Schema::dropIfExists('clearance_departments');
    }
};
