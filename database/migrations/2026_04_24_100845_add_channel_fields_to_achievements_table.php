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
        Schema::table('achievements', function (Blueprint $table) {
            $table->string('channel')->default('academic')->after('id');
            $table->string('team_name')->nullable()->after('channel');
            $table->json('group_members')->nullable()->after('team_name');
            $table->foreignId('student_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('achievements', function (Blueprint $table) {
            $table->dropColumn(['channel', 'team_name', 'group_members']);
            $table->foreignId('student_id')->nullable(false)->change();
        });
    }
};
