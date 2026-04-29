<?php

$host = 'mysql-10c82b8a-celismasalve44-8bcc.b.aivencloud.com';
$port = '12266';
$db   = 'defaultdb';
$user = 'avnadmin';
$pass = 'AVNS_AJcZIcxUTYNP3expez6';
$ca   = __DIR__ . '/ca.pem';

try {
    $options = [
        PDO::MYSQL_ATTR_SSL_CA => $ca,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ];

    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, $options);

    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "Tables in database:\n";
    foreach ($tables as $table) {
        echo "- $table\n";
    }

    if (in_array('sessions', $tables)) {
        echo "\n✅ 'sessions' table exists.\n";
    } else {
        echo "\n❌ 'sessions' table MISSING!\n";
    }

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
