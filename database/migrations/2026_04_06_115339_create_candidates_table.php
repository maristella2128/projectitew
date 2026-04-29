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
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();

            // Personal information
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();

            // Admission details
            $table->string('year_level_applied');   // e.g. "Grade 11", "Grade 12"
            $table->string('strand')->nullable();

            // Registration code (format: REG-XXXX)
            $table->string('registration_code')->unique();
            $table->boolean('registration_code_used')->default(false);
            $table->timestamp('registration_code_expires_at')->nullable();

            // Status workflow
            $table->enum('status', [
                'pending',
                'form_submitted',
                'accepted',
                'rejected',
                'enrolled',
            ])->default('pending');

            $table->text('remarks')->nullable();
            $table->timestamp('form_submitted_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidates');
    }
};
