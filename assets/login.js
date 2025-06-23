document.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.getElementById('signUpButton');
    const signInButton = document.getElementById('signInButton');
    const signInForm = document.getElementById('signIn');
    const signUpForm = document.getElementById('signUp');

    // Toggle between sign in and sign up forms
    signUpButton.addEventListener('click', function() {
        signInForm.style.display = "none";
        signUpForm.style.display = "block";
        signUpButton.classList.add('active');
        signInButton.classList.remove('active');
        
        // Update URL without reloading
        history.replaceState(null, null, '?action=register');
    });

    signInButton.addEventListener('click', function() {
        signInForm.style.display = "block";
        signUpForm.style.display = "none";
        signInButton.classList.add('active');
        signUpButton.classList.remove('active');
        
        // Update URL without reloading
        history.replaceState(null, null, '?action=login');
    });

    // Client-side login handling
    signInForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form submission
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const messageElement = document.getElementById('loginMessage');
        
        if (!username || !password) {
            if (messageElement) {
                messageElement.textContent = 'Please enter both username and password';
                messageElement.className = 'error-message';
            }
            return;
        }
        
        // For demo purposes, allow any login
        // In a real app, this would validate against a server
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        
        // Show success message
        if (messageElement) {
            messageElement.textContent = 'Login successful! Redirecting...';
            messageElement.className = 'success-message';
        }
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    });

    // Basic client-side validation for sign up form
    signUpForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form submission
        
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const messageElement = document.getElementById('registerMessage');
        
        if (!username || !email || !password || !confirmPassword) {
            if (messageElement) {
                messageElement.textContent = 'Please fill in all fields';
                messageElement.className = 'error-message';
            }
            return;
        }
        
        if (password !== confirmPassword) {
            if (messageElement) {
                messageElement.textContent = 'Passwords do not match';
                messageElement.className = 'error-message';
            }
            return;
        }
        
        // For demo purposes, simulate successful registration
        // In a real app, this would send data to a server
        if (messageElement) {
            messageElement.textContent = 'Registration successful! You can now sign in.';
            messageElement.className = 'success-message';
        }
        
        // Clear form
        signUpForm.reset();
        
        // Switch to login tab after a short delay
        setTimeout(() => {
            signInButton.click();
        }, 2000);
    });

    // Check URL parameters to show the right form
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'register') {
        signUpButton.click();
    }
    
    // Check if already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'index.html';
    }
});
