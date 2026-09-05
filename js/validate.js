function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isPasswordStrong(password) {
  return password.length >= 6; // Minimum rule for now
}

function floatButton(button) {
  const offsetX = Math.random() * 200 - 100;
  const offsetY = Math.random() * 100 - 50;

  button.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  button.classList.add('floating');

  setTimeout(() => {
    button.style.transform = 'translate(0, 0)';
    button.classList.remove('floating');
  }, 500);
}

// LOGIN FORM
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm.querySelector('#loginEmail').value.trim();
  const password = loginForm.querySelector('#loginPassword').value.trim();

  if (!isEmail(email)) {
    alert("Please enter a valid email.");
    floatButton(loginBtn);
    return;
  }

  if (!isPasswordStrong(password)) {
    alert("Password must be at least 6 characters.");
    floatButton(loginBtn);
    return;
  }

  loginForm.dispatchEvent(new CustomEvent('form-valid', {
    detail: { email, password }
  }));
});

// SIGNUP FORM
const signupForm = document.getElementById('signupForm');
const signupBtn = document.getElementById('signupBtn');

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = signupForm.querySelector('#username').value.trim();
  const email = signupForm.querySelector('#signupEmail').value.trim();
  const phone = signupForm.querySelector('#phone').value.trim();
  const password = signupForm.querySelector('#signupPassword').value.trim();
  const confirmPassword = signupForm.querySelector('#confirmPassword').value.trim();

  if (username.length < 3) {
    alert("Username must be at least 3 characters.");
    floatButton(signupBtn);
    return;
  }

  if (!isEmail(email)) {
    alert("Invalid email.");
    floatButton(signupBtn);
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    alert("Enter a valid 10-digit phone number.");
    floatButton(signupBtn);
    return;
  }

  if (!isPasswordStrong(password)) {
    alert("Password must be at least 6 characters.");
    floatButton(signupBtn);
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    floatButton(signupBtn);
    return;
  }

  signupForm.dispatchEvent(new CustomEvent('form-valid', {
    detail: { username, email, phone, password }
  }));
});
