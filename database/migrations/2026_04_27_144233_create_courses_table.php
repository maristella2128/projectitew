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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();              // ITP105
            $table->string('name');                        // Networking and Communication 2
            $table->string('description')->nullable();
            $table->integer('lec_units')->default(3);
            $table->integer('lab_units')->default(0);
            $table->integer('total_units')->storedAs('lec_units + lab_units');
            $table->enum('type', ['Core', 'Elective', 'GE', 'Professional', 'Other'])->default('Core');
            $table->string('department')->nullable();       // CCS, GE, etc.
            $table->unsignedBigInteger('pre_requisite_id')->nullable(); // self-referencing
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('pre_requisite_id')->references('id')->on('courses')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
