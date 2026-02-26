/* ============================================================
   NyumbaHub — Post Property Page JavaScript
   File: js/post-property.js
   Linked in: post-property.html (after main.js)
   ============================================================ */


/* ────────────────────────────
   STATE
──────────────────────────── */
let currentStep = 1;
const totalSteps = 4;
let uploadedPhotos = []; // array of { file, url } objects


/* ────────────────────────────
   DISTRICTS MAP
   City → district options
──────────────────────────── */
const districtMap = {
  dar:      ['Masaki', 'Oyster Bay', 'Msasani', 'Upanga', 'Kariakoo', 'Kijitonyama', 'Kinondoni', 'Mbezi Beach', 'Sinza', 'Tabata', 'Temeke', 'Ilala', 'Ukonga'],
  arusha:   ['Njiro', 'Sakina', 'Themi', 'CBD Arusha', 'Kijenge', 'Ngarenaro', 'Sekei'],
  zanzibar: ['Stone Town', 'Nungwi', 'Kendwa', 'Jambiani', 'Paje', 'Matemwe', 'Kiwengwa'],
  mwanza:   ['Nyamagana', 'Ilemela', 'Pamba', 'Capri Point', 'Mirongo'],
  dodoma:   ['Dodoma CBD', 'Nzuguni', 'Chamwino', 'Ihumwa'],
  moshi:    ['Moshi CBD', 'Shantytown', 'Rau', 'Njoro', 'Pasua'],
  tanga:    ['Tanga CBD', 'Ngamiani', 'Bombo', 'Usagara'],
};


/* ────────────────────────────
   STEP NAVIGATION
──────────────────────────── */
function goToStep(step) {
  // Validate current step before advancing
  if (step > currentStep && !validateStep(currentStep)) return;

  // Hide current, show next
  document.getElementById('step' + currentStep).classList.remove('active');
  document.getElementById('step' + step).classList.add('active');

  // Update indicator dots
  updateStepDots(step);

  currentStep = step;

  // Populate review card on step 4
  if (step === 4) buildReviewCard();

  // Scroll to top of form
  document.querySelector('.post-main').scrollIntoView({ behavior: 'smooth', block: 'start' });
}


/* ────────────────────────────
   STEP INDICATOR DOTS
──────────────────────────── */
function updateStepDots(activeStep) {
  const lines = document.querySelectorAll('.step-line');

  for (let i = 1; i <= totalSteps; i++) {
    const dot = document.getElementById('dot' + i);
    if (!dot) continue;

    dot.classList.remove('active', 'done');
    if (i === activeStep)   dot.classList.add('active');
    if (i < activeStep)     dot.classList.add('done');

    // Checkmark for done steps
    const numEl = dot.querySelector('.step-dot-num');
    if (i < activeStep) {
      numEl.innerHTML = '<i class="bi bi-check2"></i>';
    } else {
      numEl.textContent = i;
    }
  }

  // Update lines
  lines.forEach((line, idx) => {
    line.classList.toggle('done', idx + 1 < activeStep);
  });
}


/* ────────────────────────────
   STEP VALIDATION
──────────────────────────── */
function validateStep(step) {
  clearAllPostErrors();
  let valid = true;

  if (step === 1) {
    const title    = document.getElementById('propTitle').value.trim();
    const category = document.getElementById('propCategory').value;
    const desc     = document.getElementById('propDesc').value.trim();
    const price    = document.getElementById('propPrice').value;

    if (!title || title.length < 10) {
      showPostError('propTitle', 'propTitleError', 'Please enter a title of at least 10 characters.');
      valid = false;
    }
    if (!category) {
      showPostError('propCategory', 'propCategoryError', 'Please select a property type.');
      valid = false;
    }
    if (!desc || desc.length < 30) {
      showPostError('propDesc', 'propDescError', 'Please write a description of at least 30 characters.');
      valid = false;
    }
    if (!price || Number(price) <= 0) {
      showPostError('propPrice', 'propPriceError', 'Please enter a valid price.');
      valid = false;
    }
  }

  if (step === 2) {
    const city     = document.getElementById('propCity').value;
    const district = document.getElementById('propDistrict').value;

    if (!city) {
      showPostError('propCity', 'propCityError', 'Please select a city.');
      valid = false;
    }
    if (!district) {
      showPostError('propDistrict', 'propDistrictError', 'Please select a district.');
      valid = false;
    }
  }

  // Step 3 (photos) is optional — allow proceeding without photos

  return valid;
}


/* ────────────────────────────
   VALIDATION HELPERS
──────────────────────────── */
function showPostError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.add('error');
  if (error) error.textContent = message;
}

function clearAllPostErrors() {
  document.querySelectorAll('.post-input').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
}


/* ────────────────────────────
   OPTION PILLS
   Handles single-select pill groups
──────────────────────────── */
function selectOption(btn) {
  const group   = btn.dataset.group;
  const val     = btn.dataset.val;
  const hiddenId = group.charAt(0).toLowerCase() + group.slice(1);

  // Deactivate all pills in same group
  document.querySelectorAll(`.option-pill[data-group="${group}"]`).forEach(p => {
    p.classList.remove('active');
  });

  btn.classList.add('active');

  // Update hidden input
  const hidden = document.getElementById(hiddenId);
  if (hidden) hidden.value = val;
}


/* ────────────────────────────
   NUMBER STEPPER
──────────────────────────── */
function adjustNum(inputId, delta) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const current = parseInt(input.value) || 0;
  const min     = parseInt(input.min) || 0;
  const max     = parseInt(input.max) || 999;
  input.value   = Math.min(max, Math.max(min, current + delta));
}


/* ────────────────────────────
   CHARACTER COUNTERS
──────────────────────────── */
const propTitle = document.getElementById('propTitle');
const propDesc  = document.getElementById('propDesc');

if (propTitle) {
  propTitle.addEventListener('input', () => {
    document.getElementById('titleCount').textContent = propTitle.value.length;
    if (propTitle.value.length > 0) propTitle.classList.remove('error');
  });
}

if (propDesc) {
  propDesc.addEventListener('input', () => {
    document.getElementById('descCount').textContent = propDesc.value.length;
    if (propDesc.value.length > 0) propDesc.classList.remove('error');
  });
}


/* ────────────────────────────
   DISTRICT DROPDOWN
   Populates districts when city changes
──────────────────────────── */
function updateDistricts() {
  const city     = document.getElementById('propCity').value;
  const distSel  = document.getElementById('propDistrict');
  const districts = districtMap[city] || [];

  distSel.innerHTML = '<option value="">Select district…</option>';
  districts.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.toLowerCase().replace(/\s+/g, '-');
    opt.textContent = d;
    distSel.appendChild(opt);
  });
}


/* ────────────────────────────
   PHOTO UPLOAD — File Input
──────────────────────────── */
function handlePhotoSelect(event) {
  const files = Array.from(event.target.files);
  addPhotos(files);
  event.target.value = ''; // reset so same file can be re-added
}

function addPhotos(files) {
  const remaining = 10 - uploadedPhotos.length;
  const toAdd     = files.slice(0, remaining);

  toAdd.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB limit

    const url = URL.createObjectURL(file);
    uploadedPhotos.push({ file, url });
  });

  renderPhotoPreviews();
}

function renderPhotoPreviews() {
  const container = document.getElementById('photoPreviews');
  if (!container) return;

  container.innerHTML = '';

  uploadedPhotos.forEach((photo, index) => {
    const thumb = document.createElement('div');
    thumb.className = 'photo-thumb';
    thumb.innerHTML = `
      ${index === 0 ? '<span class="photo-thumb-cover">Cover</span>' : ''}
      <img src="${photo.url}" alt="Photo ${index + 1}"/>
      <button class="photo-remove" onclick="removePhoto(${index})" title="Remove photo">
        <i class="bi bi-x"></i>
      </button>
    `;
    container.appendChild(thumb);
  });
}

function removePhoto(index) {
  URL.revokeObjectURL(uploadedPhotos[index].url);
  uploadedPhotos.splice(index, 1);
  renderPhotoPreviews();
}


/* ────────────────────────────
   PHOTO UPLOAD — Drag & Drop
──────────────────────────── */
function handleDragOver(event) {
  event.preventDefault();
  document.getElementById('uploadZone').classList.add('drag-over');
}

function handleDragLeave(event) {
  document.getElementById('uploadZone').classList.remove('drag-over');
}

function handleDrop(event) {
  event.preventDefault();
  document.getElementById('uploadZone').classList.remove('drag-over');
  const files = Array.from(event.dataTransfer.files);
  addPhotos(files);
}


/* ────────────────────────────
   BUILD REVIEW CARD
   Summarises all form data for step 4
──────────────────────────── */
function buildReviewCard() {
  const title     = document.getElementById('propTitle').value.trim();
  const listType  = document.getElementById('listingType').value;
  const category  = document.getElementById('propCategory').value;
  const price     = document.getElementById('propPrice').value;
  const period    = document.getElementById('pricePeriod').value;
  const city      = document.getElementById('propCity');
  const district  = document.getElementById('propDistrict');
  const beds      = document.getElementById('propBeds').value;
  const baths     = document.getElementById('propBaths').value;
  const size      = document.getElementById('propSize').value;
  const furnish   = document.getElementById('furnishing').value;

  const cityText     = city.options[city.selectedIndex]?.text || '—';
  const districtText = district.options[district.selectedIndex]?.text || '—';

  const periodLabel = { month: '/ month', year: '/ year', total: 'total' };
  const priceFormatted = price
    ? `TZS ${Number(price).toLocaleString()} ${periodLabel[period] || ''}`
    : '—';

  const amenities = Array.from(document.querySelectorAll('.amenity-check input:checked'))
    .map(cb => cb.value).join(', ') || 'None selected';

  const rows = [
    { key: 'Title',        val: title || '—' },
    { key: 'Listing Type', val: listType === 'rent' ? 'For Rent' : 'For Sale' },
    { key: 'Category',     val: category ? category.charAt(0).toUpperCase() + category.slice(1) : '—' },
    { key: 'Price',        val: priceFormatted, isPrice: true },
    { key: 'Location',     val: `${districtText}, ${cityText}` },
    { key: 'Bedrooms',     val: beds },
    { key: 'Bathrooms',    val: baths },
    { key: 'Area',         val: size ? `${size} m²` : '—' },
    { key: 'Furnishing',   val: furnish },
    { key: 'Photos',       val: `${uploadedPhotos.length} uploaded` },
    { key: 'Amenities',    val: amenities },
  ];

  const card = document.getElementById('reviewCard');
  if (!card) return;

  card.innerHTML = rows.map((r, i) => `
    <div class="review-row">
      <span class="review-key">${r.key}</span>
      <span class="review-val ${r.isPrice ? 'review-price' : ''}">${r.val}</span>
      ${i < 4 ? `<button class="review-edit-btn" onclick="goToStep(${i < 3 ? 1 : 2})">Edit</button>` : ''}
    </div>
  `).join('');
}


/* ────────────────────────────
   SUBMIT LISTING
──────────────────────────── */
function handleSubmit() {
  clearAllPostErrors();

  const phone   = document.getElementById('contactPhone').value.trim();
  const agreed  = document.getElementById('agreePost').checked;
  let   valid   = true;

  if (!phone || !/^[0-9]{9}$/.test(phone.replace(/\s/g, ''))) {
    showPostError('contactPhone', 'contactPhoneError', 'Please enter a valid 9-digit phone number.');
    valid = false;
  }

  if (!agreed) {
    const alertEl = document.getElementById('submitAlert');
    alertEl.textContent  = 'You must agree to the listing guidelines to submit.';
    alertEl.className    = 'form-alert-post alert-error';
    alertEl.style.display = 'block';
    valid = false;
  }

  if (!valid) return;

  // Loading state
  const btn    = document.getElementById('submitBtn');
  const text   = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.btn-loader');
  btn.disabled          = true;
  text.style.display    = 'none';
  loader.style.display  = 'inline';

  // ── TODO: Replace with real API call
  // const formData = new FormData();
  // formData.append('title',       document.getElementById('propTitle').value);
  // formData.append('listingType', document.getElementById('listingType').value);
  // formData.append('category',    document.getElementById('propCategory').value);
  // formData.append('price',       document.getElementById('propPrice').value);
  // formData.append('pricePeriod', document.getElementById('pricePeriod').value);
  // formData.append('city',        document.getElementById('propCity').value);
  // formData.append('district',    document.getElementById('propDistrict').value);
  // formData.append('address',     document.getElementById('propAddress').value);
  // formData.append('beds',        document.getElementById('propBeds').value);
  // formData.append('baths',       document.getElementById('propBaths').value);
  // formData.append('size',        document.getElementById('propSize').value);
  // formData.append('description', document.getElementById('propDesc').value);
  // formData.append('phone',       '+255' + phone);
  // uploadedPhotos.forEach(p => formData.append('images', p.file));
  //
  // fetch('/api/properties', {
  //   method: 'POST',
  //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  //   body: formData
  // })
  // .then(res => res.json())
  // .then(data => {
  //   if (data._id) showSuccess();
  //   else showSubmitError(data.message);
  // })
  // .catch(() => showSubmitError('Server error. Please try again.'))
  // .finally(() => { btn.disabled = false; text.style.display = 'inline'; loader.style.display = 'none'; });

  // ── Simulated response
  setTimeout(() => {
    showSuccess();
  }, 1800);
}


/* ────────────────────────────
   SHOW SUCCESS STATE
──────────────────────────── */
function showSuccess() {
  document.getElementById('step4').classList.remove('active');
  document.getElementById('stepSuccess').classList.add('active');
  updateStepDots(5); // all done
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showSubmitError(msg) {
  const alertEl = document.getElementById('submitAlert');
  alertEl.textContent   = msg || 'Something went wrong. Please try again.';
  alertEl.className     = 'form-alert-post alert-error';
  alertEl.style.display = 'block';

  const btn    = document.getElementById('submitBtn');
  const text   = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.btn-loader');
  btn.disabled         = false;
  text.style.display   = 'inline';
  loader.style.display = 'none';
}
