<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- ROUTE LIST ---" . PHP_EOL;
$routes = \Illuminate\Support\Facades\Route::getRoutes();
foreach ($routes as $route) {
    if (strpos($route->uri, 'generate') !== false) {
        echo $route->uri . ' => ' . $route->getActionName() . PHP_EOL;
    }
}

echo PHP_EOL . "--- SCHEDULE MODEL FILLABLE ---" . PHP_EOL;
$model = new \App\Models\Schedule();
echo implode(', ', $model->getFillable()) . PHP_EOL;

echo PHP_EOL . "--- SCHEDULE COLUMNS ---" . PHP_EOL;
$cols = \Illuminate\Support\Facades\Schema::getColumnListing('schedules');
echo implode(', ', $cols) . PHP_EOL;

echo PHP_EOL . "--- ERROR LOG ---" . PHP_EOL;
$logFile = storage_path('logs/laravel.log');
if (file_exists($logFile)) {
    $lines = file($logFile);
    $lastLines = array_slice($lines, -50);
    echo implode("", $lastLines);
} else {
    echo "No log file found.";
}
