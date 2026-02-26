/* ============================================================
   NyumbaHub — Landlord Dashboard JavaScript
   File: js/dashboard.js
   Linked in: dashboard.html (after main.js)
   ============================================================ */


/* ────────────────────────────
   STATE
──────────────────────────── */
let rowToDelete = null; // holds the table row pending deletion


/* ────────────────────────────
   SECTION NAVIGATION
   Switches between dashboard sections (overview, listings, etc.)
──────────────────────────── */
function goToSection(name) {
  // Hide all sections
  document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));

  // Show target section
  const target = document.getElementById('section-' + name);
  if (target) target.classList.add('active');

  // Update sidebar active link
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === name);
  });

  // Update topbar breadcrumb label
  const labels = {
    overview:   'Overview',
    listings:   'My Listings',
    inquiries:  'Inquiries',
    profile:    'My Profile',
    settings:   'Settings',
  };
  const topbarSection = document.getElementById('topbarSection');
  if (topbarSection) topbarSection.textContent = labels[name] || name;

  // Close sidebar on mobile after navigation
  if (window.innerWidth <= 900) {
    document.getElementById('sidebar').classList.remove('open');
  }

  // Scroll to top of main content
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ────────────────────────────
   SIDEBAR LINKS — Click Handlers
──────────────────────────── */
document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    goToSection(link.dataset.section);
  });
});


/* ────────────────────────────
   SIDEBAR TOGGLE (Mobile)
──────────────────────────── */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  const sidebar = document.getElementById('sidebar');
  const toggle  = document.querySelector('.sidebar-toggle');

  if (
    window.innerWidth <= 900 &&
    sidebar.classList.contains('open') &&
    !sidebar.contains(e.target) &&
    e.target !== toggle &&
    !toggle.contains(e.target)
  ) {
    sidebar.classList.remove('open');
  }
});


/* ────────────────────────────
   FILTER LISTINGS TABLE
   Shows rows matching the selected status tab
──────────────────────────── */
function filterListings(status, btn) {
  // Update active tab
  document.querySelectorAll('.lf-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  // Show/hide rows
  document.querySelectorAll('.listing-row').forEach(row => {
    if (status === 'all' || row.dataset.status === status) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}


/* ────────────────────────────
   MARK AS TAKEN / AVAILABLE
   Toggles a listing's status between available and taken
──────────────────────────── */
function markTaken(btn, currentStatus) {
  const row        = btn.closest('tr');
  const statusPill = row.querySelector('.status-pill');

  if (currentStatus === 'available') {
    // Mark as taken
    row.dataset.status      = 'taken';
    statusPill.textContent  = 'Taken';
    statusPill.className    = 'status-pill status-taken';
    btn.title               = 'Mark as Available';
    btn.innerHTML           = '<i class="bi bi-arrow-repeat"></i>';
    btn.setAttribute('onclick', "markTaken(this, 'taken')");
  } else {
    // Mark as available
    row.dataset.status      = 'available';
    statusPill.textContent  = 'Available';
    statusPill.className    = 'status-pill status-available';
    btn.title               = 'Mark as Taken';
    btn.innerHTML           = '<i class="bi bi-house-check"></i>';
    btn.setAttribute('onclick', "markTaken(this, 'available')");
  }

  // ── TODO: Call backend API
  // const propertyId = row.dataset.id;
  // fetch(`/api/properties/${propertyId}`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${localStorage.getItem('token')}`
  //   },
  //   body: JSON.stringify({ status: row.dataset.status })
  // });
}


/* ────────────────────────────
   DELETE LISTING
   Shows confirm modal before deleting
──────────────────────────── */
function confirmDelete(btn) {
  rowToDelete = btn.closest('tr');
  document.getElementById('deleteModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('deleteModal').style.display = 'none';
  rowToDelete = null;
}

function executeDelete() {
  if (rowToDelete) {
    rowToDelete.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => {
      rowToDelete.remove();
      rowToDelete = null;
      closeModal();
    }, 300);

    // ── TODO: Call backend API
    // const propertyId = rowToDelete.dataset.id;
    // fetch(`/api/properties/${propertyId}`, {
    //   method: 'DELETE',
    //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    // });
  }
}

// Close modal on overlay click
const deleteModalEl = document.getElementById('deleteModal');
if (deleteModalEl) {
  deleteModalEl.addEventListener('click', (e) => {
    if (e.target === deleteModalEl) closeModal();
  });
}

// Fadeout animation for deleted rows
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: scaleY(1); }
    to   { opacity: 0; transform: scaleY(0); max-height: 0; padding: 0; }
  }
`;
document.head.appendChild(style);


/* ────────────────────────────
   SAVE PROFILE
   Shows a success toast on save
──────────────────────────── */
function saveProfile() {
  showToast('Profile updated successfully!', 'success');

  // ── TODO: Call backend API
  // const token = localStorage.getItem('token');
  // fetch('/api/auth/me', {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   },
  //   body: JSON.stringify({ name, email, phone, bio })
  // });
}


/* ────────────────────────────
   TOAST NOTIFICATION
   Shows a brief toast message at bottom of screen
──────────────────────────── */
function showToast(message, type = 'success') {
  // Remove any existing toast
  const existing = document.querySelector('.toast-msg');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast-msg toast-${type}`;
  toast.innerHTML = `<i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;

  // Inline styles for toast (avoids adding to CSS for a simple utility)
  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '28px',
    right:        '28px',
    background:   type === 'success' ? 'rgba(163,230,53,0.12)' : 'rgba(248,113,113,0.12)',
    border:       `1px solid ${type === 'success' ? 'rgba(163,230,53,0.3)' : 'rgba(248,113,113,0.3)'}`,
    color:        type === 'success' ? '#a3e635' : '#f87171',
    padding:      '12px 20px',
    borderRadius: '4px',
    fontFamily:   "'DM Sans', sans-serif",
    fontSize:     '0.84rem',
    display:      'flex',
    alignItems:   'center',
    gap:          '8px',
    zIndex:       '9999',
    backdropFilter: 'blur(10px)',
    animation:    'fadeUp 0.3s ease',
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}


/* ────────────────────────────
   LOGOUT
──────────────────────────── */
function handleLogout() {
  // ── TODO: Clear token and redirect
  // localStorage.removeItem('token');
  window.location.href = 'login.html';
}


/* ────────────────────────────
   URL PARAMS — Direct Section Link
   Allows linking directly to a section: dashboard.html?section=listings
──────────────────────────── */
(function checkUrlSection() {
  const params  = new URLSearchParams(window.location.search);
  const section = params.get('section');
  if (section) goToSection(section);
})();
