// Check if user is logged in and redirect if not
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Define which pages are auth pages (don't require login)
    const authPages = ['login.html', 'signup.html', 'index.html', ''];
    
    // If user is not logged in and trying to access protected page
    if (!currentUser && !authPages.includes(currentPage)) {
        window.location.href = 'login.html';
        return;
    }
    
    // If user is logged in and trying to access auth page (except index)
    if (currentUser && (currentPage === 'login.html' || currentPage === 'signup.html')) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update UI if user is logged in
    if (currentUser) {
        const user = JSON.parse(currentUser);
        const usernameElements = document.querySelectorAll('#username-display, #profile-username');
        usernameElements.forEach(el => {
            if (el) el.textContent = user.name;
        });
    }
}

// Handle login form
document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        document.getElementById('login-error').textContent = 'Invalid email or password';
    }
});

// Handle signup form
document.getElementById('signup-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
        document.getElementById('signup-error').textContent = 'Email already registered';
        return;
    }
    
    const newUser = {
        name,
        email,
        password,
        wins: 0,
        losses: 0,
        draws: 0
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    window.location.href = 'index.html';
});

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Initialize auth system when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Set up logout buttons
    const logoutBtn = document.getElementById('logout-btn');
    const profileLogoutBtn = document.getElementById('profile-logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    if (profileLogoutBtn) {
        profileLogoutBtn.addEventListener('click', handleLogout);
    }
});