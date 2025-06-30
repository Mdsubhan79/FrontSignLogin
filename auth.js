// API Configuration - Replace with your Render backend URL
const API_BASE_URL = 'https://your-render-backend-url.onrender.com/api/auth';

// Enhanced Authentication System with Render Backend Integration
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    checkAuthStatus();

    // Handle signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;

            // Validate inputs
            if (password.length < 6) {
                showAlert('Password must be at least 6 characters', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showAlert('Please enter a valid email', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.msg || 'Signup failed');
                }

                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser', JSON.stringify(data.user));

                showAlert('Account created! Redirecting...', 'success');

                // Redirect to intended page or home
                setTimeout(() => {
                    const redirectPage = localStorage.getItem('redirectAfterLogin') || 'index.html';
                    localStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirectPage;
                }, 1500);
            } catch (err) {
                showAlert(err.message || 'Signup failed. Try again.', 'error');
                console.error('Signup error:', err);
            }
        });
    }

    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.msg || 'Login failed');
                }

                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser', JSON.stringify(data.user));

                showAlert('Login successful! Redirecting...', 'success');

                // Redirect to intended page or home
                setTimeout(() => {
                    const redirectPage = localStorage.getItem('redirectAfterLogin') || 'index.html';
                    localStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirectPage;
                }, 1500);
            } catch (err) {
                showAlert(err.message || 'Login failed. Try again.', 'error');
                console.error('Login error:', err);
            }
        });
    }

    // Handle logout
    const logoutButtons = document.querySelectorAll('#logout-btn, #logout-link');
    logoutButtons.forEach(button => {
        button?.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    });

    // Protect game and profile pages
    const protectedPages = ['game.html', 'game2.html', 'profile.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage)) {
        checkAuthStatus().then(isAuthenticated => {
            if (!isAuthenticated) {
                localStorage.setItem('redirectAfterLogin', currentPage);
                window.location.href = 'login.html';
            }
        });
    }

    // Helper function to check authentication status
    async function checkAuthStatus() {
        const token = localStorage.getItem('token');
        const currentUser = localStorage.getItem('currentUser');

        // If no token or user data, not authenticated
        if (!token || !currentUser) {
            return false;
        }

        // Verify token with backend
        try {
            const response = await fetch(`${API_BASE_URL}/user`, {
                headers: {
                    'x-auth-token': token,
                },
            });

            if (!response.ok) {
                throw new Error('Invalid token');
            }

            return true;
        } catch (err) {
            // If verification fails, clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            return false;
        }
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