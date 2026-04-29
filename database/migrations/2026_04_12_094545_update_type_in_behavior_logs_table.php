<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Using raw SQL as ENUM changes can be tricky with standard schema builder depending on the driver
        DB::statement("ALTER TABLE behavior_logs MODIFY COLUMN type ENUM('violation', 'commendation', 'neutral') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE behavior_logs MODIFY COLUMN type ENUM('positive', 'negative', 'neutral') NOT NULL");
    }
};
