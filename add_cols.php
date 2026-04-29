<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

echo "Adding columns...\n";

Schema::table('schedules', function (Blueprint $table) {
    if (!Schema::hasColumn('schedules', 'is_manual')) {
        $table->boolean('is_manual')->default(false)->after('room');
        echo "Added is_manual column.\n";
    }
    if (!Schema::hasColumn('schedules', 'schedule_approved')) {
        $table->boolean('schedule_approved')->default(false)->after('is_manual');
        echo "Added schedule_approved column.\n";
    }
});

echo "Done.\n";
