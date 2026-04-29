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
        Schema::create('achievements', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('student_id')->constrained()->onDelete('cascade');
            $blueprint->string('title');
            $blueprint->text('description')->nullable();
            $blueprint->enum('category', ['academic', 'sports', 'arts', 'leadership', 'community', 'other'])->default('academic');
            $blueprint->date('date_awarded');
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('achievements');
    }
};
