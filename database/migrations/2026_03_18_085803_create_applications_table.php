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
        Schema::create('applications', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('first_name');
            $blueprint->string('last_name');
            $blueprint->string('email');
            $blueprint->string('phone');
            $blueprint->string('grade_level_applied');
            $blueprint->enum('status', ['pending', 'reviewing', 'accepted', 'rejected', 'enrolled'])->default('pending');
            $blueprint->text('remarks')->nullable();
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
