document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Initialize scores
    let wins = currentUser.wins || 0;
    let losses = currentUser.losses || 0;
    let draws = currentUser.draws || 0;
    
    // DOM elements
    const choiceButtons = document.querySelectorAll('.choice-btn');
    const playerChoiceDisplay = document.getElementById('player-choice');
    const computerChoiceDisplay = document.getElementById('computer-choice');
    const resultText = document.getElementById('result-text');
    const winsDisplay = document.getElementById('wins');
    const lossesDisplay = document.getElementById('losses');
    const drawsDisplay = document.getElementById('draws');
    
    // Update score displays
    winsDisplay.textContent = wins;
    lossesDisplay.textContent = losses;
    drawsDisplay.textContent = draws;
    
    // Game logic
    choiceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const playerChoice = this.dataset.choice;
            const computerChoice = getComputerChoice();
            
            // Display choices
            playerChoiceDisplay.textContent = getEmoji(playerChoice);
            computerChoiceDisplay.textContent = getEmoji(computerChoice);
            
            // Determine winner
            const result = determineWinner(playerChoice, computerChoice);
            
            // Update UI and scores
            if (result === 'win') {
                resultText.textContent = 'You win!';
                wins++;
                winsDisplay.textContent = wins;
            } else if (result === 'lose') {
                resultText.textContent = 'You lose!';
                losses++;
                lossesDisplay.textContent = losses;
            } else {
                resultText.textContent = "It's a draw!";
                draws++;
                drawsDisplay.textContent = draws;
            }
            
            // Save updated scores
            saveScores(wins, losses, draws);
        });
    });
    
    function getComputerChoice() {
        const choices = ['rock', 'paper', 'scissors'];
        const randomIndex = Math.floor(Math.random() * 3);
        return choices[randomIndex];
    }
    
    function getEmoji(choice) {
        switch(choice) {
            case 'rock': return '✊';
            case 'paper': return '✋';
            case 'scissors': return '✌️';
            default: return '?';
        }
    }
    
    function determineWinner(player, computer) {
        if (player === computer) return 'draw';
        
        if (
            (player === 'rock' && computer === 'scissors') ||
            (player === 'paper' && computer === 'rock') ||
            (player === 'scissors' && computer === 'paper')
        ) {
            return 'win';
        } else {
            return 'lose';
        }
    }
    
    function saveScores(wins, losses, draws) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex].wins = wins;
            users[userIndex].losses = losses;
            users[userIndex].draws = draws;
            
            // Update current user data
            currentUser.wins = wins;
            currentUser.losses = losses;
            currentUser.draws = draws;
            
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    }
});