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
        Schema::create('student_rankings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->unique()->constrained()->onDelete('cascade');
            $table->integer('total_points')->default(0);
            $table->decimal('engagement_score', 8, 2)->default(0);
            $table->integer('activity_count')->default(0);
            $table->integer('leadership_count')->default(0);
            $table->integer('rank')->nullable();
            $table->integer('course_rank')->nullable();
            $table->foreignId('top_category_id')->nullable()->constrained('activity_categories')->onDelete('set null');
            $table->timestamp('last_computed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_rankings');
    }
};
