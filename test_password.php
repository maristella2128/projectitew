<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('email', 'puadajamesmarc316@gmail.com')->first();
if ($user) {
    $user->update(['password' => \Illuminate\Support\Facades\Hash::make('newpassword123')]);
    echo 'Password updated. Verify: ' . (\Illuminate\Support\Facades\Hash::check('newpassword123', $user->fresh()->password) ? 'SUCCESS' : 'FAILED') . PHP_EOL;
} else {
    echo 'USER NOT FOUND' . PHP_EOL;
}
