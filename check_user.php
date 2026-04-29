<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('email', 'puadajamesmarc316@gmail.com')->first();
if ($user) {
    echo 'User found: ' . $user->name . PHP_EOL;
    echo 'Role: ' . ($user->role ?? 'NULL') . PHP_EOL;
    echo 'Password valid: ' . (\Illuminate\Support\Facades\Hash::check('password123', $user->password) ? 'YES' : 'NO') . PHP_EOL;
} else {
    echo 'USER NOT FOUND IN DATABASE' . PHP_EOL;
}
