// Check if user is logged in and redirect if not
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Pages that don't require authentication
    const authPages = ['login.html', 'signup.html'];
    
    // If user is not logged in and trying to access protected page
    if (!currentUser && !authPages.includes(currentPage)) {
        window.location.href = 'login.html';
        return;
    }
    
    // If user is logged in and trying to access auth page
    if (currentUser && authPages.includes(currentPage)) {
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