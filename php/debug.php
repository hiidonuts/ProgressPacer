<?php
header('Content-Type: text/html');
echo "<h1>PHP and Database Debug Information</h1>";

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>PHP Information</h2>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>Server Software: " . $_SERVER['SERVER_SOFTWARE'] . "</p>";

// Add this at the top of your debug.php file
echo "<h2>Testing Different MySQL Credentials</h2>";

// Test with empty password
$test_conn = @mysqli_connect("localhost", "root", "");
echo "<p>Connection with empty password: " . ($test_conn ? "<span style='color:green'>SUCCESS</span>" : "<span style='color:red'>FAILED</span> - " . mysqli_connect_error()) . "</p>";
if ($test_conn) mysqli_close($test_conn);

// Test with default XAMPP password
$test_conn = @mysqli_connect("localhost", "root", "password");
echo "<p>Connection with 'password': " . ($test_conn ? "<span style='color:green'>SUCCESS</span>" : "<span style='color:red'>FAILED</span> - " . mysqli_connect_error()) . "</p>";
if ($test_conn) mysqli_close($test_conn);

// Database configuration
$host = "localhost";
$username = "root";
$password = ""; // or your actual password if set
$dbname = "progresspacer_db";

echo "<h2>Database Connection Test</h2>";

try {
    // Test database connection
    $conn = mysqli_connect($host, $username, $password);
    if (!$conn) {
        echo "<p style='color: red;'>Failed to connect to MySQL: " . mysqli_connect_error() . "</p>";
    } else {
        echo "<p style='color: green;'>Connected to MySQL server successfully.</p>";
        
        // Check if database exists
        $db_check = mysqli_select_db($conn, $dbname);
        if (!$db_check) {
            echo "<p style='color: red;'>Database '$dbname' does not exist.</p>";
            echo "<p>Attempting to create database...</p>";
            
            $create_db = mysqli_query($conn, "CREATE DATABASE IF NOT EXISTS $dbname");
            if ($create_db) {
                echo "<p style='color: green;'>Database created successfully.</p>";
                mysqli_select_db($conn, $dbname);
            } else {
                echo "<p style='color: red;'>Failed to create database: " . mysqli_error($conn) . "</p>";
            }
        } else {
            echo "<p style='color: green;'>Database '$dbname' exists.</p>";
            
            // Check if register_info table exists
            $table_check = mysqli_query($conn, "SHOW TABLES LIKE 'register_info'");
            if (mysqli_num_rows($table_check) == 0) {
                echo "<p style='color: red;'>Table 'register_info' does not exist.</p>";
                echo "<p>Attempting to create table...</p>";
                
                $create_table = mysqli_query($conn, "CREATE TABLE IF NOT EXISTS register_info ( 
                    id INT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                    user_id VARCHAR(100) NOT NULL UNIQUE,
                    email VARCHAR(100) NOT NULL,
                    pass VARCHAR(50) NOT NULL,
                    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )");
                
                if ($create_table) {
                    echo "<p style='color: green;'>Table 'register_info' created successfully.</p>";
                } else {
                    echo "<p style='color: red;'>Failed to create table: " . mysqli_error($conn) . "</p>";
                }
            } else {
                echo "<p style='color: green;'>Table 'register_info' exists.</p>";
                
                // Show table structure
                echo "<h3>Table Structure</h3>";
                $result = mysqli_query($conn, "DESCRIBE register_info");
                echo "<table border='1' cellpadding='5' cellspacing='0'>";
                echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
                
                while ($row = mysqli_fetch_assoc($result)) {
                    echo "<tr>";
                    echo "<td>" . $row['Field'] . "</td>";
                    echo "<td>" . $row['Type'] . "</td>";
                    echo "<td>" . $row['Null'] . "</td>";
                    echo "<td>" . $row['Key'] . "</td>";
                    echo "<td>" . $row['Default'] . "</td>";
                    echo "<td>" . $row['Extra'] . "</td>";
                    echo "</tr>";
                }
                
                echo "</table>";
                
                // Show table data
                echo "<h3>Table Data</h3>";
                $result = mysqli_query($conn, "SELECT * FROM register_info");
                
                if (mysqli_num_rows($result) > 0) {
                    echo "<table border='1' cellpadding='5' cellspacing='0'>";
                    echo "<tr><th>ID</th><th>Username</th><th>Email</th><th>Password</th><th>Registration Date</th></tr>";
                    
                    while ($row = mysqli_fetch_assoc($result)) {
                        echo "<tr>";
                        echo "<td>" . $row['id'] . "</td>";
                        echo "<td>" . $row['user_id'] . "</td>";
                        echo "<td>" . $row['email'] . "</td>";
                        echo "<td>" . substr($row['pass'], 0, 3) . "..." . "</td>"; // Show only first 3 chars for security
                        echo "<td>" . $row['reg_date'] . "</td>";
                        echo "</tr>";
                    }
                    
                    echo "</table>";
                } else {
                    echo "<p>No data in table.</p>";
                }
            }
        }
        
        mysqli_close($conn);
    }
} catch (Exception $e) {
    echo "<p style='color: red;'>Exception: " . $e->getMessage() . "</p>";
}

echo "<h2>Form Submission Test</h2>";
echo "<p>This form will test if data can be inserted into the register_info table:</p>";
echo "<form method='post' action='test_insert.php'>";
echo "<div><label>Username: <input type='text' name='username' value='testuser" . rand(1000, 9999) . "'></label></div>";
echo "<div><label>Email: <input type='email' name='email' value='test" . rand(1000, 9999) . "@example.com'></label></div>";
echo "<div><label>Password: <input type='text' name='password' value='password123'></label></div>";
echo "<div><input type='submit' value='Test Insert'></div>";
echo "</form>";

echo "<h2>Log File</h2>";
if (file_exists("../register_log.txt")) {
    echo "<pre>" . htmlspecialchars(file_get_contents("../register_log.txt")) . "</pre>";
} else {
    echo "<p>No log file found.</p>";
}
?>
