<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('schedules', function (Blueprint $table) {
            // Drop the existing foreign key constraint first
            $table->dropForeign(['teacher_id']);
            // Re-add as nullable with the same foreign key
            $table->foreignId('teacher_id')->nullable()->change();
            $table->foreign('teacher_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->dropForeign(['teacher_id']);
            $table->foreignId('teacher_id')->nullable(false)->change();
            $table->foreign('teacher_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
};
