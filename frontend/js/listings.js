/* ============================================================
   NyumbaHub — Listings Page JavaScript
   File: js/listings.js
   Linked in: listings.html (after main.js)
   ============================================================ */


/* ────────────────────────────
   FILTER BAR — Sticky Shrink
   Adds .scrolled style to navbar when filter bar sticks
──────────────────────────── */
window.addEventListener('scroll', () => {
  const filterBar = document.getElementById('filterBar');
  if (filterBar) {
    filterBar.classList.toggle('at-top', window.scrollY < 80);
  }
});


/* ────────────────────────────
   FILTER — Live Search
   Hides cards that don't match the search input
──────────────────────────── */
const searchInput = document.getElementById('searchInput');

if (searchInput) {
  searchInput.addEventListener('input', applyFilters);
}


/* ────────────────────────────
   FILTER — Dropdown Changes
──────────────────────────── */
const filterSelects = document.querySelectorAll('.filter-select');
filterSelects.forEach(select => {
  select.addEventListener('change', applyFilters);
});


/* ────────────────────────────
   APPLY FILTERS
   Reads all filter values and shows/hides cards accordingly
──────────────────────────── */
function applyFilters() {
  const query   = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const cards   = document.querySelectorAll('.listing-card');
  let   visible = 0;

  cards.forEach(card => {
    const title    = card.querySelector('.listing-title')?.textContent.toLowerCase() || '';
    const location = card.querySelector('.listing-location')?.textContent.toLowerCase() || '';
    const badge    = card.querySelector('.listing-badge')?.textContent.toLowerCase() || '';
    const tag      = card.querySelector('.listing-tag')?.textContent.toLowerCase() || '';

    // Search match
    const matchesSearch = !query || title.includes(query) || location.includes(query);

    // Listing type match (rent / sale)
    const filterListing = document.getElementById('filterListing')?.value || '';
    const matchesListing = !filterListing ||
      (filterListing === 'rent' && badge.includes('rent')) ||
      (filterListing === 'sale' && badge.includes('sale'));

    // Property type match
    const filterType = document.getElementById('filterType')?.value || '';
    const matchesType = !filterType || tag.toLowerCase() === filterType;

    // Combined result
    const show = matchesSearch && matchesListing && matchesType;

    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  // Update count
  const countEl = document.getElementById('resultCount');
  if (countEl) countEl.textContent = visible;

  // Show/hide empty state
  const emptyState    = document.getElementById('emptyState');
  const paginationWrap = document.getElementById('paginationWrap');

  if (emptyState) emptyState.style.display = visible === 0 ? 'block' : 'none';
  if (paginationWrap) paginationWrap.style.display = visible === 0 ? 'none' : 'flex';
}


/* ────────────────────────────
   RESET FILTERS
   Clears all filter inputs and shows all cards
──────────────────────────── */
function resetFilters() {
  if (searchInput) searchInput.value = '';

  filterSelects.forEach(select => {
    select.selectedIndex = 0;
  });

  document.querySelectorAll('.listing-card').forEach(card => {
    card.style.display = '';
  });

  const countEl = document.getElementById('resultCount');
  if (countEl) countEl.textContent = document.querySelectorAll('.listing-card').length;

  const emptyState     = document.getElementById('emptyState');
  const paginationWrap = document.getElementById('paginationWrap');
  if (emptyState) emptyState.style.display = 'none';
  if (paginationWrap) paginationWrap.style.display = 'flex';
}


/* ────────────────────────────
   VIEW TOGGLE — Grid / List
   Switches between grid and list layout
──────────────────────────── */
function setView(mode) {
  const grid        = document.getElementById('listingsGrid');
  const gridBtn     = document.getElementById('gridViewBtn');
  const listBtn     = document.getElementById('listViewBtn');

  if (!grid) return;

  if (mode === 'list') {
    grid.classList.add('list-view');
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
  } else {
    grid.classList.remove('list-view');
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
  }
}


/* ────────────────────────────
   SAVE / UNSAVE PROPERTY
   Toggles the heart icon on property cards
──────────────────────────── */
function toggleSave(event, btn) {
  event.preventDefault();  // don't navigate to property page
  event.stopPropagation();

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
   URL PARAMS — Pre-fill Filters
   If user arrives from homepage with ?type=rent or ?city=dar etc.
──────────────────────────── */
(function readUrlParams() {
  const params = new URLSearchParams(window.location.search);

  const type    = params.get('type');
  const city    = params.get('city');
  const listing = params.get('listing');

  if (type) {
    const typeSelect = document.getElementById('filterType');
    // Map type to dropdown values
    const typeMap = { rent: '', sale: '', apartment: 'apartment', house: 'house', villa: 'villa', office: 'office', land: 'land' };
    if (typeSelect && typeMap[type] !== undefined) {
      typeSelect.value = typeMap[type];
    }
    // Handle rent/sale from homepage links
    const listingSelect = document.getElementById('filterListing');
    if (listingSelect && (type === 'rent' || type === 'sale')) {
      listingSelect.value = type;
    }
  }

  if (city) {
    const citySelect = document.getElementById('filterCity');
    if (citySelect) citySelect.value = city;
  }

  // Apply filters based on URL params
  applyFilters();
})();
