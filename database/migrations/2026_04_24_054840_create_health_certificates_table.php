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
        Schema::create('health_certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('health_record_id')->constrained()->cascadeOnDelete();
            $table->enum('certificate_type', ['sick_leave', 'fit_to_return', 'fit_for_pe', 'general']);
            $table->date('condition_start');
            $table->date('condition_end');
            $table->date('issued_date');
            $table->string('issued_by');                   // physician / nurse name
            $table->string('pdf_path')->nullable();        // storage path after generation
            $table->boolean('is_valid')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('health_certificates');
    }
};
