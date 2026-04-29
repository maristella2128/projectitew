<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;

Schema::disableForeignKeyConstraints();
Schema::dropIfExists('curriculum_courses');
Schema::dropIfExists('curricula');
Schema::dropIfExists('courses');
Schema::enableForeignKeyConstraints();

echo "Dropped tables successfully\n";
