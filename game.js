document.addEventListener('DOMContentLoaded', function() {
    // Get current user
    const currentUserEmail = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = users.find(user => user.email === currentUserEmail);
    
    // Update stats display
    document.getElementById('wins').textContent = currentUser.wins || 0;
    document.getElementById('losses').textContent = currentUser.losses || 0;
    
    // Game logic
    const choices = ['rock', 'paper', 'scissors'];
    const resultDiv = document.getElementById('result');
    
    document.querySelectorAll('.choice-btn').forEach(button => {
        button.addEventListener('click', function() {
            const playerChoice = this.getAttribute('data-choice');
            const computerChoice = choices[Math.floor(Math.random() * choices.length)];
            
            let result;
            
            if (playerChoice === computerChoice) {
                result = "It's a tie!";
            } else if (
                (playerChoice === 'rock' && computerChoice === 'scissors') ||
                (playerChoice === 'paper' && computerChoice === 'rock') ||
                (playerChoice === 'scissors' && computerChoice === 'paper')
            ) {
                result = `You win! ${playerChoice} beats ${computerChoice}`;
                currentUser.wins = (currentUser.wins || 0) + 1;
            } else {
                result = `You lose! ${computerChoice} beats ${playerChoice}`;
                currentUser.losses = (currentUser.losses || 0) + 1;
            }
            
            // Update display
            resultDiv.innerHTML = `
                <p>You chose: ${playerChoice}</p>
                <p>Computer chose: ${computerChoice}</p>
                <p><strong>${result}</strong></p>
            `;
            
            document.getElementById('wins').textContent = currentUser.wins;
            document.getElementById('losses').textContent = currentUser.losses;
            
            // Update in storage
            const userIndex = users.findIndex(user => user.email === currentUserEmail);
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        });
    });
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});