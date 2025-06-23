<?php
header('Content-Type: text/html');
echo "<h1>Test Database Insertion</h1>";

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database configuration
$servername = "localhost";
$username = "root";
$password = ""; // or your actual password if set
$dbname = "progresspacer_db";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    
    echo "<p>Attempting to insert:</p>";
    echo "<ul>";
    echo "<li>Username: $user_id</li>";
    echo "<li>Email: $email</li>";
    echo "<li>Password: $password</li>";
    echo "</ul>";
    
    try {
        // Create database connection
        $conn = mysqli_connect($servername, $username, $password, $dbname);
        
        // Check connection
        if (!$conn) {
            echo "<p style='color: red;'>Database connection failed: " . mysqli_connect_error() . "</p>";
        } else {
            echo "<p style='color: green;'>Database connection successful</p>";
            
            // Prepare SQL for insertion
            $sql = "INSERT INTO register_info (user_id, email, pass) VALUES ('$user_id', '$email', '$password')";
            echo "<p>SQL Query: $sql</p>";
            
            // Execute the query
            $insert_result = mysqli_query($conn, $sql);
            
            if ($insert_result) {
                echo "<p style='color: green;'>Insertion successful!</p>";
                echo "<p>Affected rows: " . mysqli_affected_rows($conn) . "</p>";
                
                // Show the inserted data
                $select_sql = "SELECT * FROM register_info WHERE user_id = '$user_id'";
                $result = mysqli_query($conn, $select_sql);
                
                if ($result && mysqli_num_rows($result) > 0) {
                    $row = mysqli_fetch_assoc($result);
                    echo "<h3>Inserted Data:</h3>";
                    echo "<table border='1' cellpadding='5' cellspacing='0'>";
                    echo "<tr><th>ID</th><th>Username</th><th>Email</th><th>Password</th><th>Registration Date</th></tr>";
                    echo "<tr>";
                    echo "<td>" . $row['id'] . "</td>";
                    echo "<td>" . $row['user_id'] . "</td>";
                    echo "<td>" . $row['email'] . "</td>";
                    echo "<td>" . $row['pass'] . "</td>";
                    echo "<td>" . $row['reg_date'] . "</td>";
                    echo "</tr>";
                    echo "</table>";
                }
            } else {
                echo "<p style='color: red;'>Insertion failed: " . mysqli_error($conn) . "</p>";
            }
            
            mysqli_close($conn);
        }
    } catch (Exception $e) {
        echo "<p style='color: red;'>Exception: " . $e->getMessage() . "</p>";
    }
}

echo "<p><a href='debug.php'>Back to Debug Page</a></p>";
?>