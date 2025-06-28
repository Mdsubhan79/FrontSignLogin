document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    document.getElementById('wins-count').textContent = currentUser.wins || 0;
    document.getElementById('losses-count').textContent = currentUser.losses || 0;
    document.getElementById('draws-count').textContent = currentUser.draws || 0; // Added this line
});