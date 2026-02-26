/* ============================================================
   NyumbaHub — Main JavaScript
   File: js/main.js
   Linked in: index.html (bottom of body, after Bootstrap JS)
   ============================================================ */


/* ────────────────────────────
   NAVBAR — Scroll Effect
   Adds .scrolled class when user scrolls past 50px
──────────────────────────── */
// navbar may not exist on every page (e.g. dashboard has its own layout)
const navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}



/* ────────────────────────────
   NAVBAR — Mobile Toggle
   Opens/closes the fullscreen mobile nav menu
──────────────────────────── */
function toggleNav() {
  const links  = document.getElementById('navLinks');
  const toggle = document.getElementById('navToggle');

  // bail out when not on a page that has the mobile nav elements
  if (!links || !toggle) return;

  links.classList.toggle('open');
  const isOpen = links.classList.contains('open');

  // Animate hamburger → X
  toggle.children[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
  toggle.children[1].style.opacity   = isOpen ? '0' : '1';
  toggle.children[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
}

// Close mobile nav when any link is clicked
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    const spans = document.querySelectorAll('.nav-toggle span');
    spans.forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  });
});


/* ────────────────────────────
   SCROLL REVEAL
   Elements with class .reveal animate in when they enter the viewport
──────────────────────────── */
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // only animate once
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => revealObserver.observe(el));


/* ────────────────────────────
   CITY PILLS — Active State
   Highlights the clicked city pill
──────────────────────────── */
document.querySelectorAll('.city-pill').forEach(pill => {
  pill.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelectorAll('.city-pill').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
  });
});


/* ────────────────────────────
   COUNTER ANIMATION
   Animates a number from 0 up to its target value
──────────────────────────── */
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const increment = target / 60;

  const timer = setInterval(() => {
    current += increment;

    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, 25);
}

// Trigger counters once the hero stats section enters view
const heroStats = document.querySelector('.hero-stats');

if (heroStats) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {

        const statEls  = document.querySelectorAll('.stat-num');
        const values   = [1200, 8, 3400, 540];
        const suffixes = ['+', '', '+', '+'];

        statEls.forEach((el, i) => {
          setTimeout(() => animateCounter(el, values[i], suffixes[i]), i * 150);
        });

        statsObserver.disconnect(); // only run once
      }
    });
  }, { threshold: 0.5 });

  statsObserver.observe(heroStats);
}
