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
        Schema::table('documents', function (Blueprint $table) {
            $table->foreignId('program_id')->nullable()->after('id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('student_id')->nullable()->change();
            $table->string('type')->nullable()->change();
            $table->string('visibility')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropForeign(['program_id']);
            $table->dropColumn('program_id');
            $table->unsignedBigInteger('student_id')->nullable(false)->change();
            $table->string('type')->nullable(false)->change();
            $table->string('visibility')->nullable(false)->change();
        });
    }
};
