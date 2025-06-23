<?php
session_start();

// Database configuration
$host = 'localhost';
$username = 'root';
$db_password = ''; // Empty string - no password for DATABASE
$dbname = 'progresspacer_db';

// Debug connection parameters
echo "Connection parameters: Host=$host, User=$username, Password=" . (empty($db_password) ? "empty" : "not empty") . ", DB=$dbname<br>";

// Test connection directly
$test_conn = @mysqli_connect($host, $username, $db_password);
if (!$test_conn) {
    die("MySQL Connection Failed: " . mysqli_connect_error());
}
echo "Test connection successful!<br>";
mysqli_close($test_conn);

// Try alternative host
$alt_host = '127.0.0.1'; // Instead of 'localhost'
$alt_conn = @mysqli_connect($alt_host, $username, $db_password);
if ($alt_conn) {
    echo "Connection with 127.0.0.1 successful!<br>";
    mysqli_close($alt_conn);
    // Use $alt_host instead of $host for the rest of your code
}

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Function to redirect with error
function redirect_with_error($error) {
    $_SESSION['register_error'] = $error;
    header("Location: ../login.html?action=register&error=1");
    exit;
}

// Function to redirect with success
function redirect_with_success($message) {
    $_SESSION['register_success'] = $message;
    header("Location: ../login.html?action=login&success=1");
    exit;
}

// Validate input data
if (!isset($_POST['username']) || empty($_POST['username'])) {
    redirect_with_error("Username is required");
}

if (!isset($_POST['email']) || empty($_POST['email'])) {
    redirect_with_error("Email is required");
}

if (!isset($_POST['password']) || empty($_POST['password'])) {
    redirect_with_error("Password is required");
}

// Get form values (clean them)
$user_id = trim($_POST['username']);
$email = trim($_POST['email']);
$user_password = password_hash(trim($_POST['password']), PASSWORD_DEFAULT); // Hash password

// For debugging - log the received data
$log_file = fopen("../register_log.txt", "a");
fwrite($log_file, date("Y-m-d H:i:s") . " - Registration attempt: Username: $user_id, Email: $email\n");

// Alternative connection method
try {
    // Debug the exact parameters being used
    echo "About to create mysqli with: Host=$host, User=$username, Password=" . (empty($db_password) ? "empty" : "not empty") . "<br>";
    
    // Use the procedural style instead of OOP style
    $conn = mysqli_connect($host, $username, $db_password, $dbname);
    if (!$conn) {
        throw new Exception("Database connection failed: " . mysqli_connect_error());
    }
    
    echo "Connection successful with procedural style!<br>";
    
    // Continue with your queries using $conn instead of $mysqli
    
    // Check if username already exists
    $check_query = "SELECT user_id FROM register_info WHERE user_id = ?";
    $stmt = mysqli_prepare($conn, $check_query);
    mysqli_stmt_bind_param($stmt, "s", $user_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    if (mysqli_num_rows($result) > 0) {
        fwrite($log_file, "Username already exists\n");
        fclose($log_file);
        mysqli_close($conn);
        redirect_with_error("Username already exists. Please choose another one.");
    }
    
    // Check if email already exists
    $check_query = "SELECT email FROM register_info WHERE email = ?";
    $stmt = mysqli_prepare($conn, $check_query);
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    if (mysqli_num_rows($result) > 0) {
        fwrite($log_file, "Email already registered\n");
        fclose($log_file);
        mysqli_close($conn);
        redirect_with_error("Email already registered. Please use another email or try to login.");
    }
    
    // Prepare SQL for insertion
    $sql = "INSERT INTO register_info (user_id, email, pass) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "sss", $user_id, $email, $user_password);
    
    // Get table structure for debugging
    $table_check = mysqli_query($conn, "DESCRIBE register_info");
    if (!$table_check) {
        fwrite($log_file, "Error checking table structure: " . mysqli_error($conn) . "\n");
    } else {
        fwrite($log_file, "Table structure confirmed:\n");
        while ($row = mysqli_fetch_assoc($table_check)) {
            fwrite($log_file, "  - " . $row['Field'] . " (" . $row['Type'] . ")\n");
        }
    }
    
    // Execute the query with error details
    fwrite($log_file, "Attempting to execute query...\n");
    if (mysqli_stmt_execute($stmt)) {
        fwrite($log_file, "Registration successful\n");
        fclose($log_file);
        mysqli_close($conn);
        redirect_with_success("Registration successful! You can now sign in.");
    } else {
        $error = mysqli_error($conn);
        fwrite($log_file, "Error during registration: " . $error . "\n");
        fclose($log_file);
        mysqli_close($conn);
        redirect_with_error("Error during registration: " . $error);
    }
    
} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    fwrite($log_file, "Exception: " . $e->getMessage() . "\n");
    fclose($log_file);
    
    // Display error directly
    header("Content-Type: text/html");
    echo "<html><body>";
    echo "<h1>Error occurred</h1>";
    echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p><a href='../login.html'>Return to login page</a></p>";
    echo "</body></html>";
    exit;
} finally {
    error_log("Registration script ended");
}
?>
