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
        Schema::create('health_immunizations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('health_record_id')->constrained()->cascadeOnDelete();
            $table->string('vaccine_name');               // e.g. "COVID-19 Booster"
            $table->string('brand')->nullable();          // e.g. "Pfizer"
            $table->enum('dose_number', ['1st', '2nd', '3rd', 'booster', 'annual']);
            $table->date('date_administered');
            $table->date('next_due_date')->nullable();
            $table->string('administered_by')->nullable();
            $table->string('lot_number')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('health_immunizations');
    }
};
