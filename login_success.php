<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['isLoggedIn']) || $_SESSION['isLoggedIn'] !== true) {
    header("Location: login.php");
    exit;
}

// Get the username
$username = $_SESSION['user_id'] ?? 'User';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Successful</title>
    <link rel="stylesheet" href="assets/styles.css">
    <style>
        body {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
        }
        .success-container {
            background: rgba(255, 255, 255, 0.1);
            padding: 2rem;
            border-radius: 1rem;
            backdrop-filter: blur(10px);
            max-width: 500px;
        }
        .success-icon {
            font-size: 4rem;
            color: #2ecc71;
            margin-bottom: 1rem;
        }
        h1 {
            margin-bottom: 1rem;
        }
        .redirect-text {
            margin-top: 2rem;
            font-size: 0.9rem;
            opacity: 0.8;
        }
        .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <div class="success-container">
        <div class="success-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <h1>Login Successful!</h1>
        <p>Welcome back, <?php echo htmlspecialchars($username); ?>!</p>
        <p>You have successfully logged in to your ProgressPacer account.</p>
        <p class="redirect-text">
            Redirecting to dashboard <span class="spinner"></span>
        </p>
    </div>

    <script>
        // Set localStorage values
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', '<?php echo htmlspecialchars($username); ?>');
        
        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    </script>
</body>
</html>

