<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add a JSON column to candidates to store the student's self-submitted
     * profile data before a User/Student record is created.
     */
    public function up(): void
    {
        Schema::table('candidates', function (Blueprint $table) {
            $table->json('form_data')->nullable()->after('form_submitted_at');
        });
    }

    public function down(): void
    {
        Schema::table('candidates', function (Blueprint $table) {
            $table->dropColumn('form_data');
        });
    }
};
