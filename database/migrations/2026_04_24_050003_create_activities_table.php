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
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['Organization', 'Competition', 'Sports', 'Academic', 'Event']);
            $table->enum('category', ['Tech', 'Leadership', 'Academic', 'Sports', 'Arts', 'Community']);
            $table->text('description')->nullable();
            $table->integer('points');                          // e.g. 20, 25, 30
            $table->integer('max_slots')->nullable();           // null = unlimited
            $table->enum('status', [
                'draft', 'active', 'inactive', 'completed', 'archived'
            ])->default('draft');
            $table->boolean('is_recurring')->default(false);    // club vs one-time event
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();   // dean
            $table->foreignId('advisor_id')->nullable()->constrained('users')->nullOnDelete(); // professor
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
