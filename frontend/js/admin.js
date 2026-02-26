/* ============================================================
   NyumbaHub — Admin Panel JavaScript
   File: js/admin.js
   Linked in: admin.html (after main.js)
   ============================================================ */


/* ────────────────────────────
   STATE
──────────────────────────── */
let rowToDelete   = null;
let pendingCount  = 3;


/* ────────────────────────────
   SET TODAY'S DATE
──────────────────────────── */
(function setDate() {
  const el = document.getElementById('adminDate');
  if (!el) return;
  el.textContent = new Date().toLocaleDateString('en-TZ', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
})();


/* ────────────────────────────
   SECTION NAVIGATION
──────────────────────────── */
function goToSection(name) {
  document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));

  const target = document.getElementById('section-' + name);
  if (target) target.classList.add('active');

  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === name);
  });

  const labels = {
    overview:  'Dashboard',
    listings:  'All Listings',
    users:     'Users',
    approvals: 'Pending Approvals',
    reports:   'Reports',
    settings:  'Site Settings',
  };
  const el = document.getElementById('topbarSection');
  if (el) el.textContent = labels[name] || name;

  if (window.innerWidth <= 900) {
    document.getElementById('sidebar').classList.remove('open');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
  link.addEventListener('click', e => {
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

document.addEventListener('click', e => {
  const sidebar = document.getElementById('sidebar');
  const toggle  = document.querySelector('.sidebar-toggle');
  if (
    window.innerWidth <= 900 &&
    sidebar.classList.contains('open') &&
    !sidebar.contains(e.target) &&
    toggle && !toggle.contains(e.target)
  ) {
    sidebar.classList.remove('open');
  }
});


/* ────────────────────────────
   APPROVE LISTING
──────────────────────────── */
function approveItem(cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;

  // Swap status pill to "Live"
  const pill = card.querySelector('.status-pill');
  if (pill) {
    pill.textContent = 'Live';
    pill.className   = 'status-pill status-available';
  }

  // Swap action buttons to disabled confirmation
  const actions = card.querySelector('.approval-actions');
  if (actions) {
    actions.innerHTML = `
      <span class="approved-label"><i class="bi bi-check-circle-fill"></i> Approved & Published</span>
    `;
  }

  // Decrement badge & update queue count
  decrementPending();

  showAdminToast('Listing approved and published!', 'success');

  // ── TODO: API call
  // fetch(`/api/properties/${propertyId}/approve`, {
  //   method: 'PUT',
  //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  // });

  // Fade card out after 2 seconds
  setTimeout(() => {
    card.style.transition = 'opacity 0.5s, transform 0.5s';
    card.style.opacity    = '0';
    card.style.transform  = 'translateY(-8px)';
    setTimeout(() => {
      card.remove();
      checkEmptyApprovals();
    }, 500);
  }, 2000);
}


/* ────────────────────────────
   REJECT LISTING
──────────────────────────── */
function rejectItem(cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;

  const pill = card.querySelector('.status-pill');
  if (pill) {
    pill.textContent = 'Rejected';
    pill.className   = 'status-pill status-taken';
  }

  const actions = card.querySelector('.approval-actions');
  if (actions) {
    actions.innerHTML = `
      <span class="rejected-label"><i class="bi bi-x-circle-fill"></i> Listing Rejected</span>
    `;
  }

  decrementPending();
  showAdminToast('Listing rejected. Landlord will be notified.', 'error');

  // ── TODO: API call
  // fetch(`/api/properties/${propertyId}/reject`, { method: 'PUT', ... });

  setTimeout(() => {
    card.style.transition = 'opacity 0.5s';
    card.style.opacity    = '0';
    setTimeout(() => {
      card.remove();
      checkEmptyApprovals();
    }, 500);
  }, 2000);
}


/* ────────────────────────────
   DECREMENT PENDING BADGE
──────────────────────────── */
function decrementPending() {
  pendingCount = Math.max(0, pendingCount - 1);

  // Update sidebar badge
  const approvalLink = document.querySelector('.sidebar-link[data-section="approvals"] .sidebar-badge');
  if (approvalLink) {
    approvalLink.textContent = pendingCount || '';
    if (pendingCount === 0) approvalLink.style.display = 'none';
  }

  // Update queue count label
  const queueCount = document.querySelector('.admin-queue-count');
  if (queueCount) {
    queueCount.textContent = pendingCount > 0
      ? `${pendingCount} listing${pendingCount > 1 ? 's' : ''} awaiting review`
      : 'No listings pending review';
  }

  // Update overview stat card
  const statNum = document.querySelector('#section-overview .stat-card:nth-child(3) .stat-card-num');
  if (statNum) statNum.textContent = pendingCount;
}


/* ────────────────────────────
   CHECK EMPTY APPROVALS
──────────────────────────── */
function checkEmptyApprovals() {
  const remaining = document.querySelectorAll('.approval-card').length;
  const empty     = document.getElementById('emptyApprovals');
  if (empty) empty.style.display = remaining === 0 ? 'block' : 'none';
}


/* ────────────────────────────
   DISMISS REPORT
──────────────────────────── */
function dismissReport(btn) {
  const card = btn.closest('.approval-card');
  if (!card) return;

  showAdminToast('Report dismissed.', 'success');

  card.style.transition = 'opacity 0.4s';
  card.style.opacity    = '0';
  setTimeout(() => card.remove(), 400);

  // Update reports badge
  const badge = document.querySelector('.sidebar-link[data-section="reports"] .sidebar-badge');
  if (badge) {
    const count = parseInt(badge.textContent) - 1;
    badge.textContent = count > 0 ? count : '';
  }
}


/* ────────────────────────────
   REMOVE REPORTED LISTING
──────────────────────────── */
function removeReportedListing(btn) {
  const card = btn.closest('.approval-card');
  rowToDelete = card;
  document.getElementById('deleteModal').style.display = 'flex';
}


/* ────────────────────────────
   ADMIN DELETE LISTING (from table)
──────────────────────────── */
function adminDeleteListing(btn) {
  rowToDelete = btn.closest('tr');
  document.getElementById('deleteModal').style.display = 'flex';
}


/* ────────────────────────────
   MODAL CLOSE / EXECUTE
──────────────────────────── */
function closeModal() {
  document.getElementById('deleteModal').style.display = 'none';
  rowToDelete = null;
}

function executeAdminDelete() {
  if (!rowToDelete) return;

  rowToDelete.style.transition = 'opacity 0.3s';
  rowToDelete.style.opacity    = '0';

  setTimeout(() => {
    rowToDelete.remove();
    rowToDelete = null;
    closeModal();
    showAdminToast('Listing removed successfully.', 'success');
  }, 300);
}

document.getElementById('deleteModal').addEventListener('click', e => {
  if (e.target === document.getElementById('deleteModal')) closeModal();
});


/* ────────────────────────────
   TOGGLE USER STATUS
   Suspend / Reactivate a user
──────────────────────────── */
function toggleUserStatus(btn) {
  const row        = btn.closest('tr');
  const statusPill = row.querySelector('.status-pill');
  const isSuspended = statusPill.classList.contains('status-taken');

  if (isSuspended) {
    // Reactivate
    statusPill.textContent = 'Active';
    statusPill.className   = 'status-pill status-available';
    btn.title              = 'Suspend';
    btn.innerHTML          = '<i class="bi bi-slash-circle"></i>';
    btn.className          = 'tbl-btn tbl-btn-danger';
    btn.setAttribute('onclick', 'toggleUserStatus(this)');
    showAdminToast('User reactivated.', 'success');
  } else {
    // Suspend
    statusPill.textContent = 'Suspended';
    statusPill.className   = 'status-pill status-taken';
    btn.title              = 'Reactivate';
    btn.innerHTML          = '<i class="bi bi-check-circle"></i>';
    btn.className          = 'tbl-btn';
    btn.setAttribute('onclick', 'toggleUserStatus(this)');
    showAdminToast('User suspended.', 'error');
  }

  // ── TODO: API call
  // const userId = row.dataset.userId;
  // fetch(`/api/users/${userId}/status`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  //   body: JSON.stringify({ status: isSuspended ? 'active' : 'suspended' })
  // });
}


/* ────────────────────────────
   FILTER ADMIN LISTINGS TABLE
──────────────────────────── */
function filterAdminListings() {
  const query = document.getElementById('listingsSearch').value.toLowerCase();
  document.querySelectorAll('#adminListingsTable tbody .listing-row').forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
}


/* ────────────────────────────
   TOAST NOTIFICATION
──────────────────────────── */
function showAdminToast(message, type = 'success') {
  const existing = document.querySelector('.toast-msg');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-msg';

  Object.assign(toast.style, {
    position:       'fixed',
    bottom:         '28px',
    right:          '28px',
    background:     type === 'success' ? 'rgba(163,230,53,0.12)' : 'rgba(248,113,113,0.12)',
    border:         `1px solid ${type === 'success' ? 'rgba(163,230,53,0.3)' : 'rgba(248,113,113,0.3)'}`,
    color:          type === 'success' ? '#a3e635' : '#f87171',
    padding:        '12px 20px',
    borderRadius:   '4px',
    fontFamily:     "'DM Sans', sans-serif",
    fontSize:       '0.84rem',
    display:        'flex',
    alignItems:     'center',
    gap:            '8px',
    zIndex:         '9999',
    backdropFilter: 'blur(10px)',
    animation:      'fadeUp 0.3s ease',
  });

  toast.innerHTML = `<i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity    = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}


/* ────────────────────────────
   APPROVED / REJECTED LABEL STYLES
──────────────────────────── */
const labelStyle = document.createElement('style');
labelStyle.textContent = `
  .approved-label {
    display: flex; align-items: center; gap: 7px;
    color: #a3e635; font-size: 0.82rem;
    font-family: 'DM Sans', sans-serif;
  }
  .rejected-label {
    display: flex; align-items: center; gap: 7px;
    color: #f87171; font-size: 0.82rem;
    font-family: 'DM Sans', sans-serif;
  }
`;
document.head.appendChild(labelStyle);


/* ────────────────────────────
   URL PARAMS — Direct Section Link
──────────────────────────── */
(function checkUrlSection() {
  const params  = new URLSearchParams(window.location.search);
  const section = params.get('section');
  if (section) goToSection(section);
})();
