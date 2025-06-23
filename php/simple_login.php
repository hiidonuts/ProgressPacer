<?php
// Simple login script with minimal code
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database configuration
$host = "localhost";
$username = "root";
$password = "";
$dbname = "progresspacer_db";

// Log file for debugging
$log = fopen("../simple_login_log.txt", "a");
fwrite($log, "\n\n" . date("Y-m-d H:i:s") . " - Login attempt started\n");

// Get username and password
$user_id = isset($_POST['username']) ? trim($_POST['username']) : '';
$entered_password = isset($_POST['password']) ? trim($_POST['password']) : '';

fwrite($log, "Username: $user_id\n");

// Basic validation
if (empty($user_id) || empty($entered_password)) {
    fwrite($log, "Empty username or password\n");
    fclose($log);
    echo "Username and password are required";
    exit;
}

// Connect to database
try {
    fwrite($log, "Connecting to database...\n");
    $conn = new mysqli($host, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        fwrite($log, "Connection failed: " . $conn->connect_error . "\n");
        fclose($log);
        echo "Database connection failed: " . $conn->connect_error;
        exit;
    }
    
    fwrite($log, "Connection successful\n");
    
    // Check if user exists
    $stmt = $conn->prepare("SELECT user_id, pass FROM register_info WHERE user_id = ?");
    $stmt->bind_param("s", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        fwrite($log, "User not found\n");
        fclose($log);
        echo "Invalid username or password";
        exit;
    }
    
    // Verify password
    $user = $result->fetch_assoc();
    $stored_password = $user['pass'];
    
    fwrite($log, "User found, checking password\n");
    
    // Check if password is hashed
    if (substr($stored_password, 0, 1) === '$') {
        $password_correct = password_verify($entered_password, $stored_password);
    } else {
        $password_correct = ($entered_password === $stored_password);
    }
    
    if ($password_correct) {
        fwrite($log, "Password correct, login successful\n");
        
        // Set session variables
        $_SESSION['user_id'] = $user_id;
        $_SESSION['isLoggedIn'] = true;
        
        // Set localStorage via JavaScript
        echo "<html><body>";
        echo "<script>";
        echo "localStorage.setItem('isLoggedIn', 'true');";
        echo "localStorage.setItem('username', '" . htmlspecialchars($user_id) . "');";
        echo "window.location.href = '../index.html';";
        echo "</script>";
        echo "</body></html>";
        
        fclose($log);
        exit;
    } else {
        fwrite($log, "Password incorrect\n");
        fclose($log);
        echo "Invalid username or password";
        exit;
    }
} catch (Exception $e) {
    fwrite($log, "Exception: " . $e->getMessage() . "\n");
    fclose($log);
    echo "Error: " . $e->getMessage();
    exit;
}
?>