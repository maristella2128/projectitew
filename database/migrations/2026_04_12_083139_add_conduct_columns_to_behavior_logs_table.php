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
        Schema::table('behavior_logs', function (Blueprint $table) {
            $table->enum('category', [
                'academic_misconduct', 'behavioral_misconduct', 'attendance', 'dress_code',
                'excellence', 'leadership', 'community', 'other'
            ])->default('other');
            $table->integer('points')->nullable();
            $table->enum('resolution_status', ['pending', 'resolved', 'escalated', 'dismissed'])->default('pending');
            $table->timestamp('resolved_at')->nullable();
            $table->foreignId('resolved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('resolution_notes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('behavior_logs', function (Blueprint $table) {
            $table->dropForeign(['resolved_by']);
            $table->dropColumn([
                'category', 'points', 'resolution_status', 'resolved_at', 'resolved_by', 'resolution_notes'
            ]);
        });
    }
};
