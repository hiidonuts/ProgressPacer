<?php
header('Content-Type: text/html');
echo "<h1>Database Setup</h1>";

try {
    // Database configuration
    $servername = "localhost";
    $username = "root";
    $password = ""; // or your actual password if set
    $dbname = "progresspacer_db";

    echo "<p>Connecting to MySQL server...</p>";
    
    // Create connection without database
    $conn = mysqli_connect($servername, $username, $password);
    if (!$conn) {
        throw new Exception("Connection failed: " . mysqli_connect_error());
    }
    
    echo "<p style='color: green;'>Connected to MySQL server successfully.</p>";
    
    // Create database if it doesn't exist
    echo "<p>Creating database if it doesn't exist...</p>";
    $sql = "CREATE DATABASE IF NOT EXISTS $dbname";
    if (!mysqli_query($conn, $sql)) {
        throw new Exception("Error creating database: " . mysqli_error($conn));
    }
    
    echo "<p style='color: green;'>Database '$dbname' created or already exists.</p>";
    
    // Select the database
    mysqli_select_db($conn, $dbname);
    
    // Create register_info table if it doesn't exist
    echo "<p>Creating register_info table if it doesn't exist...</p>";
    $sql = "CREATE TABLE IF NOT EXISTS register_info ( 
            id INT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(100) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL,
            pass VARCHAR(255) NOT NULL, /* Changed from VARCHAR(50) to VARCHAR(255) */
            reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
    
    if (!mysqli_query($conn, $sql)) {
        throw new Exception("Error creating register_info table: " . mysqli_error($conn));
    }
    
    echo "<p style='color: green;'>Table 'register_info' created or already exists.</p>";
    
    // Create login_info table if it doesn't exist
    echo "<p>Creating login_info table if it doesn't exist...</p>";
    $sql = "CREATE TABLE IF NOT EXISTS login_info (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL,
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    if (!mysqli_query($conn, $sql)) {
        throw new Exception("Error creating login_info table: " . mysqli_error($conn));
    }
    
    echo "<p style='color: green;'>Table 'login_info' created or already exists.</p>";
    
    // Check if tables are empty and create a test user if needed
    $result = mysqli_query($conn, "SELECT COUNT(*) as count FROM register_info");
    $row = mysqli_fetch_assoc($result);
    
    if ($row['count'] == 0) {
        echo "<p>No users found. Creating a test user...</p>";
        
        $test_username = "testuser";
        $test_email = "test@example.com";
        $test_password = "password123";
        
        $sql = "INSERT INTO register_info (user_id, email, pass) VALUES ('$test_username', '$test_email', '$test_password')";
        
        if (mysqli_query($conn, $sql)) {
            echo "<p style='color: green;'>Test user created successfully.</p>";
            echo "<p>Username: testuser<br>Password: password123</p>";
        } else {
            echo "<p style='color: red;'>Failed to create test user: " . mysqli_error($conn) . "</p>";
        }
    } else {
        echo "<p>Users already exist in the database. No test user created.</p>";
    }
    
    // Display table structure
    echo "<h2>Table Structures</h2>";
    
    $tables = ['register_info', 'login_info'];
    foreach ($tables as $table) {
        echo "<h3>$table</h3>";
        
        $result = mysqli_query($conn, "DESCRIBE $table");
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
    }
    
    // Display sample data
    echo "<h2>Sample Data</h2>";
    
    $result = mysqli_query($conn, "SELECT id, user_id, email, reg_date FROM register_info LIMIT 5");
    
    if (mysqli_num_rows($result) > 0) {
        echo "<h3>Users</h3>";
        echo "<table border='1' cellpadding='5' cellspacing='0'>";
        echo "<tr><th>ID</th><th>Username</th><th>Email</th><th>Registration Date</th></tr>";
        
        while ($row = mysqli_fetch_assoc($result)) {
            echo "<tr>";
            echo "<td>" . $row['id'] . "</td>";
            echo "<td>" . $row['user_id'] . "</td>";
            echo "<td>" . $row['email'] . "</td>";
            echo "<td>" . $row['reg_date'] . "</td>";
            echo "</tr>";
        }
        
        echo "</table>";
    } else {
        echo "<p>No users found in the database.</p>";
    }
    
    echo "<h2>Setup Complete</h2>";
    echo "<p>The database and tables have been set up successfully.</p>";
    echo "<p><a href='../login.html'>Go to Login Page</a></p>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>Error: " . $e->getMessage() . "</p>";
} finally {
    // Close connection if it exists
    if (isset($conn)) {
        mysqli_close($conn);
        echo "<p>Database connection closed.</p>";
    }
}
?>
