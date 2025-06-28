document.addEventListener('DOMContentLoaded', function() {
    const currentUserEmail = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = users.find(user => user.email === currentUserEmail);
    
    if (currentUser) {
        document.getElementById('profile-info').innerHTML = `
            <p><strong>Name:</strong> ${currentUser.name}</p>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <p><strong>Wins:</strong> ${currentUser.wins || 0}</p>
            <p><strong>Losses:</strong> ${currentUser.losses || 0}</p>
        `;
    }
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});