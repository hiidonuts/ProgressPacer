<?php
// Simple login test
session_start();
echo "<h1>Login Test</h1>";

$host = "localhost";
$username = "root";
$password = "";
$dbname = "progresspacer_db";

echo "<p>Connecting to database...</p>";
$conn = @mysqli_connect($host, $username, $password, $dbname);
if (!$conn) {
    echo "<p style='color:red'>Connection failed: " . mysqli_connect_error() . "</p>";
    exit;
}
echo "<p style='color:green'>Connection successful!</p>";

echo "<p>Checking register_info table...</p>";
$result = mysqli_query($conn, "SELECT * FROM register_info LIMIT 5");
if (!$result) {
    echo "<p style='color:red'>Error querying register_info: " . mysqli_error($conn) . "</p>";
} else {
    echo "<p style='color:green'>Found " . mysqli_num_rows($result) . " users in database</p>";
    echo "<ul>";
    while ($row = mysqli_fetch_assoc($result)) {
        echo "<li>User ID: " . htmlspecialchars($row['user_id']) . "</li>";
    }
    echo "</ul>";
}

mysqli_close($conn);
?>