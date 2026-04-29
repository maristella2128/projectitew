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
        Schema::table('announcements', function (Blueprint $table) {
            $table->timestamp('scheduled_at')->nullable();
            $table->boolean('is_pinned')->default(false);
            $table->json('target_audience')->nullable();
            $table->string('status')->default('published');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->dropColumn(['scheduled_at', 'is_pinned', 'target_audience', 'status']);
        });
    }
};
