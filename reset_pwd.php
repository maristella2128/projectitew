<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$u = User::where('email', 'admin@dean.com')->first();
if ($u) {
    $u->password = Hash::make('password');
    $u->save();
    echo "Password Reset Success\n";
} else {
    echo "User not found\n";
}
