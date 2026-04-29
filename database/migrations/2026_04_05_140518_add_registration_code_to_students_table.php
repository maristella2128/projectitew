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
        Schema::table('students', function (Blueprint $table) {
            $table->string('registration_code')->nullable()->unique()->after('id');
            $table->boolean('registration_code_used')->default(false)->after('registration_code');
            $table->timestamp('registration_code_expires_at')->nullable()->after('registration_code_used');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['registration_code', 'registration_code_used', 'registration_code_expires_at']);
        });
    }
};
