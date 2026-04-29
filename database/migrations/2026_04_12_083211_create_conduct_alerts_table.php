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
        Schema::create('conduct_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('behavior_log_id')->nullable()->constrained('behavior_logs')->onDelete('set null');
            $table->enum('alert_type', ['warning', 'immediate', 'escalation', 'probation', 'clearance_hold']);
            $table->enum('severity', ['low', 'medium', 'high', 'critical']);
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->boolean('is_resolved')->default(false)->index();
            $table->foreignId('resolved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conduct_alerts');
    }
};
