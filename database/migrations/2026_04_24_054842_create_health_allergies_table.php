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
        Schema::create('health_allergies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('health_record_id')->constrained()->cascadeOnDelete();
            $table->string('allergy_type');               // e.g. "Food", "Drug", "Environmental"
            $table->string('allergen');                   // e.g. "Penicillin", "Shellfish"
            $table->enum('severity', ['mild', 'moderate', 'severe', 'life_threatening']);
            $table->string('chronic_illness')->nullable();// e.g. "Asthma", "Diabetes Type 1"
            $table->string('emergency_medication')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->boolean('show_alert_to_professors')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('health_allergies');
    }
};
