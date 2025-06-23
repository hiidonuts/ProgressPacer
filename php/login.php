<?php
session_start();

// Database configuration
$host = "localhost";
$username = "root";
$password = ""; // Empty string - no password
$dbname = "progresspacer_db";

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Function to redirect with error
function redirect_with_error($error) {
    $_SESSION['login_error'] = $error;
    header("Location: ../login.html?action=login&error=1");
    exit;
}

// Validate input data
if (!isset($_POST['username']) || empty($_POST['username'])) {
    redirect_with_error("Username is required");
}

if (!isset($_POST['password']) || empty($_POST['password'])) {
    redirect_with_error("Password is required");
}

// Get form values
$user_id = trim($_POST['username']);
$entered_password = trim($_POST['password']);

// For debugging - log the login attempt
$log_file = fopen("../login_log.txt", "a");
fwrite($log_file, date("Y-m-d H:i:s") . " - Login attempt: Username: $user_id\n");

try {
    // Create connection
    $conn = mysqli_connect($host, $username, $password, $dbname);
    if (!$conn) {
        fwrite($log_file, "Database connection failed: " . mysqli_connect_error() . "\n");
        fclose($log_file);
        redirect_with_error("Database connection failed: " . mysqli_connect_error());
    }

    fwrite($log_file, "Database connection successful\n");

    // Check if user exists in register_info
    $query = "SELECT id, user_id, pass FROM register_info WHERE user_id = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "s", $user_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    if (!$result) {
        fwrite($log_file, "Query error: " . mysqli_error($conn) . "\n");
        fclose($log_file);
        mysqli_close($conn);
        redirect_with_error("Database query error: " . mysqli_error($conn));
    }
    
    if (mysqli_num_rows($result) === 1) {
        // User exists, verify password
        $user = mysqli_fetch_assoc($result);
        
        fwrite($log_file, "User found, checking password\n");
        
        // Check if password is hashed (starts with $)
        if (substr($user['pass'], 0, 1) === '$') {
            // Password is hashed, use password_verify
            $password_correct = password_verify($entered_password, $user['pass']);
        } else {
            // Password is not hashed (for backward compatibility)
            $password_correct = ($entered_password === $user['pass']);
        }
        
        if ($password_correct) {
            // Password is correct
            fwrite($log_file, "Password correct, login successful\n");
            
            // Set session variables
            $_SESSION['user_id'] = $user_id;
            $_SESSION['isLoggedIn'] = true;
            
            // Remember me functionality
            if (isset($_POST['rememberMe']) && $_POST['rememberMe'] == 'on') {
                // Set cookies that expire in 30 days
                setcookie("remember_user", $user_id, time() + (86400 * 30), "/");
                setcookie("remember_login", "true", time() + (86400 * 30), "/");
            }
            
            // Log the login (optional)
            // Check if login_info table exists
            $table_check = mysqli_query($conn, "SHOW TABLES LIKE 'login_info'");
            if (mysqli_num_rows($table_check) > 0) {
                $log_query = "INSERT INTO login_info (user_id) VALUES (?)";
                $stmt = mysqli_prepare($conn, $log_query);
                mysqli_stmt_bind_param($stmt, "s", $user_id);
                mysqli_stmt_execute($stmt);
            }
            
            fclose($log_file);
            mysqli_close($conn);
            
            // Redirect to dashboard
            header("Location: ../index.html");
            exit;
        } else {
            // Password is incorrect
            fwrite($log_file, "Password incorrect\n");
            fclose($log_file);
            mysqli_close($conn);
            redirect_with_error("Invalid username or password");
        }
    } else {
        // User does not exist
        fwrite($log_file, "User not found\n");
        fclose($log_file);
        mysqli_close($conn);
        redirect_with_error("Invalid username or password");
    }
} catch (Exception $e) {
    fwrite($log_file, "Exception: " . $e->getMessage() . "\n");
    fclose($log_file);
    redirect_with_error($e->getMessage());
}
?>






