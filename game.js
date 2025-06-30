document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!localStorage.getItem('currentUser')) {
        window.location.href = 'login.html';
        return;
    }

    // Get current user stats
    const currentUserEmail = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = users.find(user => user.email === currentUserEmail);
    
    // Initialize if user doesn't have stats
    if (!currentUser) {
        currentUser = { 
            email: currentUserEmail, 
            wins: 0, 
            losses: 0,
            rpsHistory: []
        };
        users.push(currentUser);
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Update stats display
    function updateStatsDisplay() {
        document.getElementById('wins').textContent = currentUser.wins || 0;
        document.getElementById('losses').textContent = currentUser.losses || 0;
        
        const totalGames = (currentUser.wins || 0) + (currentUser.losses || 0);
        const winRate = totalGames > 0 ? Math.round((currentUser.wins / totalGames) * 100) : 0;
        document.getElementById('win-rate').textContent = `${winRate}%`;
    }
    
    updateStatsDisplay();

    // Game elements
    const resultDiv = document.getElementById('result');
    const playerChoiceDisplay = document.getElementById('player-choice');
    const computerChoiceDisplay = document.getElementById('computer-choice');
    
    // Game logic with improved computer AI
    const choices = ['rock', 'paper', 'scissors'];
    let playerChoice, computerChoice;
    
    // Improved computer choice algorithm
    function getComputerChoice() {
        // Simple AI that adapts to player patterns
        if (!currentUser.rpsHistory || currentUser.rpsHistory.length === 0) {
            return choices[Math.floor(Math.random() * choices.length)];
        }
        
        // Get player's most frequent choice
        const freq = { rock: 0, paper: 0, scissors: 0 };
        currentUser.rpsHistory.forEach(choice => freq[choice]++);
        
        const mostFrequent = Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);
        
        // Counter the most frequent choice (but with some randomness)
        if (Math.random() < 0.7) { // 70% chance to counter
            if (mostFrequent === 'rock') return 'paper';
            if (mostFrequent === 'paper') return 'scissors';
            if (mostFrequent === 'scissors') return 'rock';
        }
        
        // 30% chance for random choice
        return choices[Math.floor(Math.random() * choices.length)];
    }
    
    // Determine winner
    function determineWinner(player, computer) {
        if (player === computer) return 'tie';
        
        const winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };
        
        return winConditions[player] === computer ? 'player' : 'computer';
    }
    
    // Update choice displays with animation
    function updateChoiceDisplays() {
        const icons = {
            rock: 'fas fa-hand-rock',
            paper: 'fas fa-hand-paper',
            scissors: 'fas fa-hand-scissors'
        };
        
        playerChoiceDisplay.innerHTML = `<i class="${icons[playerChoice]}"></i>`;
        computerChoiceDisplay.innerHTML = `<i class="${icons[computerChoice]}"></i>`;
        
        // Add animation classes
        playerChoiceDisplay.classList.add('choice-selected');
        computerChoiceDisplay.classList.add('choice-selected');
        
        // Remove animation after it completes
        setTimeout(() => {
            playerChoiceDisplay.classList.remove('choice-selected');
            computerChoiceDisplay.classList.remove('choice-selected');
        }, 1000);
    }
    
    // Handle choice buttons
    document.querySelectorAll('.choice-btn').forEach(button => {
        button.addEventListener('click', function() {
            playerChoice = this.getAttribute('data-choice');
            computerChoice = getComputerChoice();
            
            // Record player choice in history (keep last 20 choices)
            if (!currentUser.rpsHistory) currentUser.rpsHistory = [];
            currentUser.rpsHistory.push(playerChoice);
            if (currentUser.rpsHistory.length > 20) {
                currentUser.rpsHistory.shift();
            }
            
            updateChoiceDisplays();
            
            // Determine result after a short delay
            setTimeout(() => {
                const result = determineWinner(playerChoice, computerChoice);
                let resultText;
                
                if (result === 'tie') {
                    resultText = `It's a tie! Both chose ${playerChoice}.`;
                } else if (result === 'player') {
                    resultText = `You win! ${playerChoice} beats ${computerChoice}.`;
                    currentUser.wins = (currentUser.wins || 0) + 1;
                } else {
                    resultText = `You lose! ${computerChoice} beats ${playerChoice}.`;
                    currentUser.losses = (currentUser.losses || 0) + 1;
                }
                
                // Update display
                resultDiv.innerHTML = `
                    <h3>${resultText}</h3>
                    <p>You chose: ${playerChoice}</p>
                    <p>Computer chose: ${computerChoice}</p>
                `;
                
                // Update stats display
                updateStatsDisplay();
                
                // Update in storage
                const userIndex = users.findIndex(user => user.email === currentUserEmail);
                users[userIndex] = currentUser;
                localStorage.setItem('users', JSON.stringify(users));
            }, 500);
        });
    });
    
    // Reset stats button
    document.getElementById('reset-stats')?.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset your game statistics?')) {
            currentUser.wins = 0;
            currentUser.losses = 0;
            currentUser.rpsHistory = [];
            
            const userIndex = users.findIndex(user => user.email === currentUserEmail);
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
            
            updateStatsDisplay();
            resultDiv.innerHTML = '<p>Statistics have been reset. Make your choice to start a new game!</p>';
            
            playerChoiceDisplay.innerHTML = '<i class="fas fa-question"></i>';
            computerChoiceDisplay.innerHTML = '<i class="fas fa-question"></i>';
        }
    });
    
    // Logout button
    document.getElementById('logout-btn')?.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});