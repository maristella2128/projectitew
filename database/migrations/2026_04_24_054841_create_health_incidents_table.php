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
        Schema::create('health_incidents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('health_record_id')->constrained()->cascadeOnDelete();
            $table->enum('incident_type', ['accident', 'sports_injury', 'fainting', 'allergic_reaction', 'other']);
            $table->string('location_on_campus');
            $table->text('first_aid_given');
            $table->boolean('referred_to_hospital')->default(false);
            $table->string('hospital_name')->nullable();
            $table->string('witness_name')->nullable();
            $table->enum('severity', ['minor', 'moderate', 'major'])->default('minor');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('health_incidents');
    }
};
