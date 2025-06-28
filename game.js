document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    let targetNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;
    const maxAttempts = 10;
    
    const guessInput = document.getElementById('guess-input');
    const guessBtn = document.getElementById('guess-btn');
    const message = document.getElementById('message');
    const attemptsDisplay = document.getElementById('attempts');
    const newGameBtn = document.getElementById('new-game-btn');
    
    guessBtn.addEventListener('click', checkGuess);
    newGameBtn.addEventListener('click', startNewGame);
    
    function checkGuess() {
        const guess = parseInt(guessInput.value);
        
        if (isNaN(guess) || guess < 1 || guess > 100) {
            message.textContent = 'Please enter a valid number between 1 and 100';
            return;
        }
        
        attempts++;
        attemptsDisplay.textContent = `Attempts: ${attempts}/${maxAttempts}`;
        
        if (guess === targetNumber) {
            message.textContent = 'Congratulations! You guessed the number!';
            endGame(true);
        } else if (attempts >= maxAttempts) {
            message.textContent = `Game over! The number was ${targetNumber}.`;
            endGame(false);
        } else {
            message.textContent = guess < targetNumber ? 'Too low!' : 'Too high!';
        }
        
        guessInput.value = '';
    }
    
    function endGame(isWin) {
        guessInput.disabled = true;
        guessBtn.disabled = true;
        newGameBtn.style.display = 'inline-block';
        
        // Update user stats
        const users = JSON.parse(localStorage.getItem('users'));
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            if (isWin) {
                users[userIndex].wins++;
            } else {
                users[userIndex].losses++;
            }
            
            // Update current user data
            currentUser.wins = users[userIndex].wins;
            currentUser.losses = users[userIndex].losses;
            
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    }
    
    function startNewGame() {
        targetNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
        attemptsDisplay.textContent = `Attempts: 0/${maxAttempts}`;
        message.textContent = '';
        guessInput.disabled = false;
        guessBtn.disabled = false;
        newGameBtn.style.display = 'none';
        guessInput.focus();
    }
});