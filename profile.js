document.addEventListener('DOMContentLoaded', () => {
  const profileName = document.getElementById('profileName');
  const navbarList = document.querySelector('.navbar-nav');
  const brandLink = document.querySelector('.navbar-brand');
  if (!profileName || !navbarList) return;

  const storedUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
  profileName.textContent = storedUser ? storedUser : 'Guest';

  // Point the brand/profile anchor to the profile page when signed in,
  // otherwise direct to the signin page.
  if (brandLink) {
    brandLink.href = storedUser ? 'profile.html' : 'signin.html';
    brandLink.style.cursor = 'pointer';
  }

  const removeAuthLinks = () => {
    document.querySelectorAll('.auth-nav-item').forEach((item) => item.remove());
  };

  const createNavItem = (text, href, id) => {
    const item = document.createElement('li');
    item.className = 'nav-item auth-nav-item';
    const link = document.createElement('a');
    link.className = 'nav-link';
    link.href = href;
    link.textContent = text;
    if (id) link.id = id;
    item.appendChild(link);
    return item;
  };

  removeAuthLinks();
  if (storedUser) {
    const logoutItem = createNavItem('LOG OUT', '#', 'logoutButton');
    navbarList.appendChild(logoutItem);
    document.getElementById('logoutButton').addEventListener('click', (event) => {
      event.preventDefault();
      localStorage.removeItem('loggedInUser');
      sessionStorage.removeItem('loggedInUser');
      // after logout, redirect to home
      window.location.href = 'index.html';
    });
  } else {
    navbarList.appendChild(createNavItem('SIGN IN', 'signin.html'));
    navbarList.appendChild(createNavItem('SIGN UP', 'signup.html'));
  }
});
