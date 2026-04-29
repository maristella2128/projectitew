<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Http\Controllers\ScheduleController;
use App\Models\Section;

try {
    $controller = new ScheduleController();
    $section = Section::find(1);
    if (!$section) {
        die("Section 1 not found\n");
    }
    
    echo "Testing generation for Section 1...\n";
    $response = $controller->generateSuggested(1);
    
    echo "Response: " . get_class($response) . "\n";
    echo "Done.\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
