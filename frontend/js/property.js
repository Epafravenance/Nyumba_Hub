/* ============================================================
   NyumbaHub — Property Detail Page JavaScript
   File: js/property.js
   Linked in: property.html (after main.js)
   ============================================================ */


/* ────────────────────────────
   GALLERY DATA
   Photo data for the 5 gallery slots
   (Later replaced with real image URLs from backend)
──────────────────────────── */
const photos = [
  { emoji: '🏙️', gradient: 'prop-img-gradient-1', label: 'Exterior View' },
  { emoji: '🛋️', gradient: 'prop-img-gradient-2', label: 'Living Room' },
  { emoji: '🛏️', gradient: 'prop-img-gradient-3', label: 'Master Bedroom' },
  { emoji: '🍳', gradient: 'prop-img-gradient-4', label: 'Kitchen' },
  { emoji: '🚿', gradient: 'prop-img-gradient-5', label: 'Bathroom' },
];

let currentPhoto = 0;


/* ────────────────────────────
   GALLERY — Switch Photo
   Updates main image when a thumbnail is clicked
──────────────────────────── */
function switchPhoto(index) {
  currentPhoto = index;

  // Update main image
  const mainImg = document.getElementById('mainImg');
  if (mainImg) {
    // Remove all gradient classes
    mainImg.className = 'gallery-main-img';
    mainImg.classList.add(photos[index].gradient);
    mainImg.textContent = photos[index].emoji;
  }

  // Update active thumbnail
  document.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });
}


/* ────────────────────────────
   LIGHTBOX — Open
──────────────────────────── */
function openLightbox(index) {
  currentPhoto = index;
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  updateLightboxImage();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}


/* ────────────────────────────
   LIGHTBOX — Close
──────────────────────────── */
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}


/* ────────────────────────────
   LIGHTBOX — Navigate prev/next
──────────────────────────── */
function lightboxNav(event, direction) {
  event.stopPropagation();
  currentPhoto = (currentPhoto + direction + photos.length) % photos.length;
  updateLightboxImage();
}


/* ────────────────────────────
   LIGHTBOX — Update Image Display
──────────────────────────── */
function updateLightboxImage() {
  const lightboxImg     = document.getElementById('lightboxImg');
  const lightboxCounter = document.getElementById('lightboxCounter');

  if (lightboxImg) {
    lightboxImg.className = 'lightbox-img ' + photos[currentPhoto].gradient;
    lightboxImg.textContent = photos[currentPhoto].emoji;
  }

  if (lightboxCounter) {
    lightboxCounter.textContent = `${currentPhoto + 1} / ${photos.length}`;
  }
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox || !lightbox.classList.contains('open')) return;

  if (e.key === 'ArrowRight') lightboxNav(e, 1);
  if (e.key === 'ArrowLeft')  lightboxNav(e, -1);
  if (e.key === 'Escape')     closeLightbox();
});


/* ────────────────────────────
   SAVE PROPERTY — Toggle Heart
──────────────────────────── */
function toggleSave() {
  const btn  = document.getElementById('saveBtn');
  if (!btn) return;

  btn.classList.toggle('saved');
  const icon = btn.querySelector('i');

  if (btn.classList.contains('saved')) {
    icon.className = 'bi bi-heart-fill';
    btn.title = 'Saved!';
  } else {
    icon.className = 'bi bi-heart';
    btn.title = 'Save property';
  }
}


/* ────────────────────────────
   READ MORE — Toggle Description
──────────────────────────── */
function toggleDescription() {
  const moreText = document.getElementById('descMore');
  const btn      = document.getElementById('readMoreBtn');
  if (!moreText || !btn) return;

  const isOpen = moreText.style.display !== 'none';

  moreText.style.display = isOpen ? 'none' : 'block';
  btn.innerHTML = isOpen
    ? 'Read More <i class="bi bi-chevron-down"></i>'
    : 'Read Less <i class="bi bi-chevron-up"></i>';
}


/* ────────────────────────────
   SHARE BUTTONS
──────────────────────────── */
document.querySelectorAll('.share-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const icon = btn.querySelector('i');

    // Copy link button
    if (icon && icon.classList.contains('bi-link-45deg')) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        icon.className = 'bi bi-check2';
        btn.title = 'Link copied!';
        setTimeout(() => {
          icon.className = 'bi bi-link-45deg';
          btn.title = 'Copy link';
        }, 2000);
      });
    }
  });
});


/* ────────────────────────────
   SIDEBAR — Sticky Offset Fix
   Adjusts sidebar top offset based on actual navbar height
──────────────────────────── */
function updateSidebarOffset() {
  const navbar  = document.getElementById('navbar');
  const sidebar = document.querySelector('.detail-sidebar');
  if (navbar && sidebar) {
    const offset = navbar.offsetHeight + 16;
    sidebar.style.top = offset + 'px';
  }
}

window.addEventListener('scroll', updateSidebarOffset);
window.addEventListener('resize', updateSidebarOffset);
updateSidebarOffset();
