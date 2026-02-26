/* ============================================================
   NyumbaHub — Auth Page JavaScript (Login & Register)
   File: js/auth.js
   Linked in: login.html (after main.js)
   ============================================================ */


/* ────────────────────────────
   STATE
──────────────────────────── */
let selectedRole = 'tenant'; // 'tenant' | 'landlord'


/* ────────────────────────────
   TAB SWITCHER
   Toggles between login and register forms
──────────────────────────── */
function switchTab(tab) {
  const loginForm    = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginTab     = document.getElementById('loginTab');
  const registerTab  = document.getElementById('registerTab');

  if (tab === 'login') {
    loginForm.style.display    = 'block';
    registerForm.style.display = 'none';
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    document.title = 'Sign In — NyumbaHub';
  } else {
    loginForm.style.display    = 'none';
    registerForm.style.display = 'block';
    loginTab.classList.remove('active');
    registerTab.classList.add('active');
    document.title = 'Create Account — NyumbaHub';
  }

  // Clear all errors when switching
  clearAllErrors();
}


/* ────────────────────────────
   ROLE SELECTOR
   Highlights the chosen role (tenant / landlord)
──────────────────────────── */
function selectRole(role) {
  selectedRole = role;

  document.getElementById('roleTenant').classList.toggle('active', role === 'tenant');
  document.getElementById('roleLandlord').classList.toggle('active', role === 'landlord');
}


/* ────────────────────────────
   TOGGLE PASSWORD VISIBILITY
──────────────────────────── */
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon  = btn.querySelector('i');

  if (input.type === 'password') {
    input.type    = 'text';
    icon.className = 'bi bi-eye-slash';
  } else {
    input.type    = 'password';
    icon.className = 'bi bi-eye';
  }
}


/* ────────────────────────────
   PASSWORD STRENGTH CHECKER
──────────────────────────── */
const regPassword = document.getElementById('regPassword');

if (regPassword) {
  regPassword.addEventListener('input', checkPasswordStrength);
}

function checkPasswordStrength() {
  const val    = regPassword.value;
  const fill   = document.getElementById('strengthFill');
  const label  = document.getElementById('strengthLabel');

  if (!fill || !label) return;

  let score = 0;
  if (val.length >= 8)              score++;
  if (/[A-Z]/.test(val))            score++;
  if (/[0-9]/.test(val))            score++;
  if (/[^A-Za-z0-9]/.test(val))    score++;

  const levels = [
    { width: '0%',   color: 'transparent',  text: '',          textColor: '' },
    { width: '25%',  color: '#f87171',       text: 'Weak',      textColor: '#f87171' },
    { width: '50%',  color: '#fb923c',       text: 'Fair',      textColor: '#fb923c' },
    { width: '75%',  color: '#facc15',       text: 'Good',      textColor: '#facc15' },
    { width: '100%', color: '#a3e635',       text: 'Strong',    textColor: '#a3e635' },
  ];

  fill.style.width      = levels[score].width;
  fill.style.background = levels[score].color;
  label.textContent     = levels[score].text;
  label.style.color     = levels[score].textColor;
}


/* ────────────────────────────
   VALIDATION HELPERS
──────────────────────────── */
function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input)  input.classList.add('error');
  if (error)  error.textContent = message;
}

function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input)  input.classList.remove('error');
  if (error)  error.textContent = '';
}

function clearAllErrors() {
  document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error', 'success'));
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-alert').forEach(el => {
    el.style.display = 'none';
    el.className     = 'form-alert';
  });
}

function showAlert(alertId, message, type = 'error') {
  const alert = document.getElementById(alertId);
  if (!alert) return;
  alert.textContent  = message;
  alert.className    = `form-alert alert-${type}`;
  alert.style.display = 'block';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9]{9}$/.test(phone.replace(/\s/g, ''));
}


/* ────────────────────────────
   LOADING STATE
   Shows spinner on submit button while processing
──────────────────────────── */
function setLoading(btnId, loading) {
  const btn    = document.getElementById(btnId);
  if (!btn) return;

  const text   = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.btn-loader');

  btn.disabled          = loading;
  text.style.display    = loading ? 'none' : 'inline';
  loader.style.display  = loading ? 'inline' : 'none';
}


/* ────────────────────────────
   HANDLE LOGIN
   Validates form then calls the backend API
   (POST /api/auth/login)
──────────────────────────── */
function handleLogin(e) {
  e.preventDefault();
  clearAllErrors();

  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  let   valid    = true;

  // Validate email
  if (!email) {
    showError('loginEmail', 'loginEmailError', 'Email is required.');
    valid = false;
  } else if (!isValidEmail(email)) {
    showError('loginEmail', 'loginEmailError', 'Please enter a valid email address.');
    valid = false;
  }

  // Validate password
  if (!password) {
    showError('loginPassword', 'loginPasswordError', 'Password is required.');
    valid = false;
  }

  if (!valid) return;

  // ── Show loading
  setLoading('loginBtn', true);

  // ── TODO: Replace with real API call
  // fetch('/api/auth/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password })
  // })
  // .then(res => res.json())
  // .then(data => {
  //   if (data.token) {
  //     localStorage.setItem('token', data.token);
  //     window.location.href = 'dashboard.html';
  //   } else {
  //     showAlert('loginAlert', data.message || 'Invalid credentials.');
  //   }
  // })
  // .catch(() => showAlert('loginAlert', 'Server error. Please try again.'))
  // .finally(() => setLoading('loginBtn', false));

  // ── Simulated response (remove when backend is ready)
  setTimeout(() => {
    setLoading('loginBtn', false);

    // Simulate wrong password for demo
    if (password === 'wrongpassword') {
      showAlert('loginAlert', 'Incorrect email or password. Please try again.');
      return;
    }

    // Simulate success
    showAlert('loginAlert', '✓ Login successful! Redirecting to dashboard…', 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
  }, 1200);
}


/* ────────────────────────────
   HANDLE REGISTER
   Validates form then calls the backend API
   (POST /api/auth/register)
──────────────────────────── */
function handleRegister(e) {
  e.preventDefault();
  clearAllErrors();

  const firstName = document.getElementById('regFirstName').value.trim();
  const lastName  = document.getElementById('regLastName').value.trim();
  const email     = document.getElementById('regEmail').value.trim();
  const phone     = document.getElementById('regPhone').value.trim();
  const password  = document.getElementById('regPassword').value;
  const confirm   = document.getElementById('regConfirm').value;
  const agreed    = document.getElementById('agreeTerms').checked;
  let   valid     = true;

  // Validate first name
  if (!firstName) {
    showError('regFirstName', 'regFirstNameError', 'First name is required.');
    valid = false;
  }

  // Validate last name
  if (!lastName) {
    showError('regLastName', 'regLastNameError', 'Last name is required.');
    valid = false;
  }

  // Validate email
  if (!email) {
    showError('regEmail', 'regEmailError', 'Email is required.');
    valid = false;
  } else if (!isValidEmail(email)) {
    showError('regEmail', 'regEmailError', 'Please enter a valid email address.');
    valid = false;
  }

  // Validate phone
  if (!phone) {
    showError('regPhone', 'regPhoneError', 'Phone number is required.');
    valid = false;
  } else if (!isValidPhone(phone)) {
    showError('regPhone', 'regPhoneError', 'Enter a valid 9-digit Tanzanian number.');
    valid = false;
  }

  // Validate password
  if (!password) {
    showError('regPassword', 'regPasswordError', 'Password is required.');
    valid = false;
  } else if (password.length < 8) {
    showError('regPassword', 'regPasswordError', 'Password must be at least 8 characters.');
    valid = false;
  }

  // Validate confirm password
  if (!confirm) {
    showError('regConfirm', 'regConfirmError', 'Please confirm your password.');
    valid = false;
  } else if (password !== confirm) {
    showError('regConfirm', 'regConfirmError', 'Passwords do not match.');
    valid = false;
  }

  // Validate terms
  if (!agreed) {
    showAlert('registerAlert', 'You must agree to the Terms of Service to continue.');
    valid = false;
  }

  if (!valid) return;

  // ── Show loading
  setLoading('registerBtn', true);

  // ── TODO: Replace with real API call
  // fetch('/api/auth/register', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     name: `${firstName} ${lastName}`,
  //     email, phone: `+255${phone}`,
  //     password, role: selectedRole
  //   })
  // })
  // .then(res => res.json())
  // .then(data => {
  //   if (data.token) {
  //     localStorage.setItem('token', data.token);
  //     window.location.href = selectedRole === 'landlord' ? 'dashboard.html' : 'listings.html';
  //   } else {
  //     showAlert('registerAlert', data.message || 'Registration failed.');
  //   }
  // })
  // .catch(() => showAlert('registerAlert', 'Server error. Please try again.'))
  // .finally(() => setLoading('registerBtn', false));

  // ── Simulated response (remove when backend is ready)
  setTimeout(() => {
    setLoading('registerBtn', false);
    showAlert('registerAlert', `✓ Account created! Welcome to NyumbaHub, ${firstName}! Redirecting…`, 'success');
    setTimeout(() => {
      window.location.href = selectedRole === 'landlord' ? 'dashboard.html' : 'listings.html';
    }, 1800);
  }, 1400);
}


/* ────────────────────────────
   REAL-TIME FIELD VALIDATION
   Clears errors as user types
──────────────────────────── */
['loginEmail', 'loginPassword'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => clearError(id, id + 'Error'));
});

['regFirstName', 'regLastName', 'regEmail', 'regPhone', 'regPassword', 'regConfirm'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => clearError(id, id + 'Error'));
});


/* ────────────────────────────
   URL PARAMS — Auto Switch Tab
   If URL has ?tab=register, open register form
──────────────────────────── */
(function checkUrlTab() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('tab') === 'register') {
    switchTab('register');
  }
})();
