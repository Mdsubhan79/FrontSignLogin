// Handle signup form submission
document.getElementById('signup-form')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];

  if (users.some(user => user.email === email)) {
    alert('User already exists with this email!');
    return;
  }

  // Save new user
  users.push({ name, email, password, wins: 0, losses: 0 });
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', email);

  // Redirect to stored target or default
  const redirectPage = localStorage.getItem('redirectAfterLogin') || 'game.html';
  localStorage.removeItem('redirectAfterLogin');

  alert('Signup successful! Redirecting...');
  window.location.href = redirectPage;
});

// Handle login form submission
document.getElementById('login-form')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(user => user.email === email && user.password === password);

  if (user) {
    localStorage.setItem('currentUser', email);

    const redirectPage = localStorage.getItem('redirectAfterLogin') || 'game.html';
    localStorage.removeItem('redirectAfterLogin');

    window.location.href = redirectPage;
  } else {
    alert('Invalid email or password!');
  }
});

// Logout functionality
document.getElementById('logout-btn')?.addEventListener('click', function () {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
});

// Protect game and profile pages
const protectedPages = ['game.html', 'game2.html', 'profile.html'];
const currentPage = window.location.pathname.split('/').pop();

if (protectedPages.includes(currentPage)) {
  if (!localStorage.getItem('currentUser')) {
    localStorage.setItem('redirectAfterLogin', currentPage); // optional: remember where user tried to go
    window.location.href = 'login.html';
  }
}
