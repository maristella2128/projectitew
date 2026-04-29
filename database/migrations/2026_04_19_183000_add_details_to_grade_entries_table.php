<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('grade_entries', function (Blueprint $table) {
            $table->string('subject_name')->nullable()->after('subject_code');
            $table->integer('units')->default(3)->after('subject_name');
        });
    }

    public function down(): void
    {
        Schema::table('grade_entries', function (Blueprint $table) {
            $table->dropColumn(['subject_name', 'units']);
        });
    }
};
