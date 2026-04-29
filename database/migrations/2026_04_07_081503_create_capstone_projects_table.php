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
        Schema::create('capstone_projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('adviser_name');
            $table->enum('status', ['proposal', 'development', 'pre_oral', 'final_defense', 'completed', 'failed']);
            $table->decimal('grade', 4, 2)->nullable();
            $table->string('academic_year');
            $table->tinyInteger('semester');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('capstone_projects');
    }
};
