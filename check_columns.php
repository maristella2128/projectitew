<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('email', 'puadajamesmarc316@gmail.com')->first();
echo 'User fields: ' . ($user ? implode(', ', array_keys($user->toArray())) : 'Not found') . PHP_EOL;

if (class_exists('\App\Models\Student')) {
    $student = \App\Models\Student::where('user_id', $user->id)->first();
    if ($student) {
        echo 'Student fields: ' . implode(', ', array_keys($student->toArray())) . PHP_EOL;
    } else {
        echo 'No student record found for this user' . PHP_EOL;
    }
} else {
    echo 'Student model does not exist' . PHP_EOL;
}

$cols = \Illuminate\Support\Facades\Schema::getColumnListing('students');
echo 'Schema columns: ' . implode(', ', $cols) . PHP_EOL;
