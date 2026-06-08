document.addEventListener('DOMContentLoaded', () => {
  const signinForm = document.getElementById('signinForm');
  const signupForm = document.getElementById('signupForm');

  const getUsers = () => {
    const stored = localStorage.getItem('cbkUsers');
    return stored ? JSON.parse(stored) : {};
  };

  const saveUsers = (users) => {
    localStorage.setItem('cbkUsers', JSON.stringify(users));
  };

  const setLoggedInUser = (username) => {
    localStorage.setItem('loggedInUser', username);
  };

  if (signinForm) {
    signinForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = document.getElementById('signinUsername').value.trim();
      const password = document.getElementById('signinPassword').value;
      const message = document.getElementById('signinMessage');
      message.textContent = '';

      if (!username || !password) {
        message.textContent = 'Please enter both username and password.';
        return;
      }

      const users = getUsers();
      const storedUser = users[username];
      if (!storedUser) {
        message.textContent = 'User not found. Please sign up first.';
        return;
      }

      if (storedUser.password !== password) {
        message.textContent = 'Incorrect password. Please try again.';
        return;
      }

      setLoggedInUser(username);
      window.location.href = 'index.html';
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = document.getElementById('signupUsername').value.trim();
      const password = document.getElementById('signupPassword').value;
      const confirm = document.getElementById('signupConfirm').value;
      const message = document.getElementById('signupMessage');
      message.textContent = '';

      if (!username || !password || !confirm) {
        message.textContent = 'Please fill in every field.';
        return;
      }

      if (password !== confirm) {
        message.textContent = 'Passwords do not match.';
        return;
      }

      if (password.length < 6) {
        message.textContent = 'Use at least 6 characters for your password.';
        return;
      }

      const users = getUsers();
      if (users[username]) {
        message.textContent = 'That username is already taken. Choose another one.';
        return;
      }

      users[username] = { password };
      saveUsers(users);
      setLoggedInUser(username);
      window.location.href = 'index.html';
    });
  }

  const googleButton = document.getElementById('googleAuth');
  if (googleButton) {
    googleButton.addEventListener('click', () => {
      setLoggedInUser('Google User');
      window.location.href = 'index.html';
    });
  }
});
