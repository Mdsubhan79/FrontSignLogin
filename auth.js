// Enhanced Authentication System with Better Error Handling
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (localStorage.getItem('currentUser') && (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html'))) {
        const redirectPage = localStorage.getItem('redirectAfterLogin') || 'index.html';
        window.location.href = redirectPage;
    }

    // Handle signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;

            // Validate inputs
            if (password.length < 6) {
                showAlert('Password must be at least 6 characters long', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Check if user already exists
            if (users.some(user => user.email === email)) {
                showAlert('An account with this email already exists', 'error');
                return;
            }

            // Create new user with game stats
            const newUser = { 
                name, 
                email, 
                password,
                wins: 0,
                losses: 0,
                tttStats: {
                    wins: 0,
                    losses: 0,
                    draws: 0
                },
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', email);

            showAlert('Account created successfully! Redirecting...', 'success');

            // Redirect to intended page or home
            setTimeout(() => {
                const redirectPage = localStorage.getItem('redirectAfterLogin') || 'index.html';
                localStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectPage;
            }, 1500);
        });
    }

    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.email === email);

            if (!user) {
                showAlert('No account found with this email', 'error');
                return;
            }

            if (user.password !== password) {
                showAlert('Incorrect password', 'error');
                return;
            }

            localStorage.setItem('currentUser', email);

            showAlert('Login successful! Redirecting...', 'success');

            // Redirect to intended page or home
            setTimeout(() => {
                const redirectPage = localStorage.getItem('redirectAfterLogin') || 'index.html';
                localStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectPage;
            }, 1500);
        });
    }

    // Handle logout
    const logoutButtons = document.querySelectorAll('#logout-btn, #logout-link');
    logoutButtons.forEach(button => {
        button?.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    });

    // Protect game and profile pages
    const protectedPages = ['game.html', 'game2.html', 'profile.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage) && !localStorage.getItem('currentUser')) {
        localStorage.setItem('redirectAfterLogin', currentPage);
        window.location.href = 'login.html';
    }

    // Helper function to show alerts
    function showAlert(message, type) {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) existingAlert.remove();

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        // Prepend to form or to body
        const form = document.querySelector('form') || document.body;
        form.prepend(alertDiv);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    // Email validation helper
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});