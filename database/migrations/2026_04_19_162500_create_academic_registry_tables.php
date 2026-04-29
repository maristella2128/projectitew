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
        // 1. Departments Table (Handle if exists from previous migration)
        if (!Schema::hasTable('clearance_departments')) {
            Schema::create('clearance_departments', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->boolean('blocks_enrollment')->default(false);
                $table->boolean('blocks_tor')->default(false);
                $table->integer('display_order')->default(0);
                $table->timestamps();
            });
        } else {
            Schema::table('clearance_departments', function (Blueprint $table) {
                if (!Schema::hasColumn('clearance_departments', 'blocks_enrollment')) {
                    $table->boolean('blocks_enrollment')->default(false)->after('name');
                }
                if (!Schema::hasColumn('clearance_departments', 'blocks_tor')) {
                    $table->boolean('blocks_tor')->default(false)->after('blocks_enrollment');
                }
                if (!Schema::hasColumn('clearance_departments', 'display_order')) {
                    $table->integer('display_order')->default(0)->after('blocks_tor');
                }
            });
        }

        // 2. Grade Entries Table (Advanced)
        Schema::create('grade_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('section_id')->constrained()->onDelete('cascade');
            $table->string('subject_code', 20);
            $table->string('academic_year', 10); // e.g., '2024-2025'
            $table->tinyInteger('semester'); // 1, 2, 3
            $table->decimal('prelim', 5, 2)->nullable();
            $table->decimal('midterm', 5, 2)->nullable();
            $table->decimal('prefinal', 5, 2)->nullable();
            $table->decimal('final', 5, 2)->nullable();
            $table->decimal('computed_grade', 5, 2)->nullable();
            $table->decimal('gwa_equivalent', 3, 2)->nullable();
            $table->enum('status', ['draft', 'encoded', 'submitted', 'approved', 'locked'])->default('draft');
            $table->foreignId('encoded_by')->nullable()->constrained('users');
            $table->timestamp('submitted_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('locked_by')->nullable()->constrained('users');
            $table->timestamp('locked_at')->nullable();
            $table->timestamps();
        });

        // 3. Grade Change Requests
        Schema::create('grade_change_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grade_entry_id')->constrained()->onDelete('cascade');
            $table->foreignId('requested_by')->constrained('users');
            $table->text('reason');
            $table->string('attachment_path', 500)->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('reviewed_by')->nullable()->constrained('users');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });

        // 4. Clearance Entries (Extended)
        Schema::create('student_clearance_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('department_id')->constrained('clearance_departments')->onDelete('cascade');
            $table->string('academic_year', 10);
            $table->tinyInteger('semester');
            $table->enum('status', ['pending', 'cleared', 'on_hold'])->default('pending');
            $table->text('note')->nullable();
            $table->text('hold_reason')->nullable();
            $table->foreignId('cleared_by')->nullable()->constrained('users');
            $table->timestamp('cleared_at')->nullable();
            $table->foreignId('revoked_by')->nullable()->constrained('users');
            $table->timestamp('revoked_at')->nullable();
            $table->text('revoke_reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_clearance_entries');
        Schema::dropIfExists('grade_change_requests');
        Schema::dropIfExists('grade_entries');
        Schema::dropIfExists('clearance_departments');
    }
};
