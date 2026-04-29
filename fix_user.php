<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('email', 'puadajamesmarc316@gmail.com')->first();
if ($user) {
    $user->update([
        'role' => 'student',
        'password' => \Illuminate\Support\Facades\Hash::make('password123')
    ]);
    if (class_exists(\Spatie\Permission\Models\Role::class)) {
        try {
            $user->syncRoles(['student']);
        } catch (\Exception $e) {
            echo "Failed to sync roles: " . $e->getMessage() . PHP_EOL;
        }
    }
    echo "User updated successfully: Role=student, Password=password123\n";
} else {
    echo "User puadajamesmarc316@gmail.com not found.\n";
}
