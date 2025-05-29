function showSection(id) {
  document.querySelectorAll('main > section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Save history to localStorage
function saveHistory(day) {
  const date = new Date().toLocaleDateString();
  const entry = `${day} - ${date}`;
  let history = JSON.parse(localStorage.getItem('gymHistory') || '[]');
  history.unshift(entry);
  localStorage.setItem('gymHistory', JSON.stringify(history));
  alert('Saved to history!');
  showHistory();
}

// Show history
function showHistory() {
  const list = document.getElementById('history-list');
  let history = JSON.parse(localStorage.getItem('gymHistory') || '[]');
  list.innerHTML = '';
  history.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
}

// Show history on load
document.addEventListener('DOMContentLoaded', () => {
  showSection('schedule');
  showHistory();
});

// ...existing code...

// Multiple photo upload and gallery logic
const MAX_VISIBLE = 4; 

function getPhotos() {
  return JSON.parse(localStorage.getItem('gymPhotos') || '[]');
}
function setPhotos(arr) {
  localStorage.setItem('gymPhotos', JSON.stringify(arr));
}
function renderGallery(showAll = false) {
  const gallery = document.getElementById('photo-gallery');
  const btn = document.getElementById('view-more-btn');
  const photos = getPhotos();
  gallery.innerHTML = '';
  let visiblePhotos = showAll ? photos : photos.slice(0, MAX_VISIBLE);
  visiblePhotos.forEach((src, idx) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = "Gym Photo";
    img.onclick = () => openModal(src);
    gallery.appendChild(img);
  });
  if (photos.length > MAX_VISIBLE) {
    btn.style.display = 'inline-block';
    btn.textContent = showAll ? 'Hide' : 'View More';
    btn.onclick = () => renderGallery(!showAll);
  } else {
    btn.style.display = 'none';
  }
}
function openModal(src) {
  const modal = document.getElementById('photo-modal');
  const modalImg = document.getElementById('modal-img');
  modal.style.display = 'flex';
  modalImg.src = src;
}
function closeModal() {
  document.getElementById('photo-modal').style.display = 'none';
}
function handlePhotoInput(e) {
  const files = Array.from(e.target.files);
  if (!files.length) return;
  let photos = getPhotos();
  const readers = files.map(file => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = ev => resolve(ev.target.result);
      reader.readAsDataURL(file);
    });
  });
  Promise.all(readers).then(results => {
    photos = results.concat(photos); // newest first
    setPhotos(photos); // no limit
    renderGallery();
  });
}

// Setup listeners
document.addEventListener('DOMContentLoaded', () => {
  showSection('schedule');
  showHistory();

  // Photo gallery
  const photoInput = document.getElementById('photo-input');
  if (photoInput) {
    photoInput.addEventListener('change', handlePhotoInput);
    renderGallery();
  }

  // Modal
  const closeModalBtn = document.getElementById('close-modal');
  if (closeModalBtn) closeModalBtn.onclick = closeModal;
  const photoModal = document.getElementById('photo-modal');
  if (photoModal) {
    photoModal.onclick = function(e) {
      if (e.target === this) closeModal();
    };
  }

  // Reset history button
  const resetBtn = document.getElementById('reset-history-btn');
  if (resetBtn) {
    resetBtn.onclick = function() {
      if (confirm('Are you sure you want to delete all training history?')) {
        localStorage.removeItem('gymHistory');
        showHistory();
      }
    };
  }
});

function renderGallery(showAll = false) {
  const gallery = document.getElementById('photo-gallery');
  const btn = document.getElementById('view-more-btn');
  const photos = getPhotos();
  gallery.innerHTML = '';
  let visiblePhotos = showAll ? photos : photos.slice(0, MAX_VISIBLE);
  visiblePhotos.forEach((src, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'photo-wrapper';
    const img = document.createElement('img');
    img.src = src;
    img.alt = "Gym Photo";
    img.onclick = () => openModal(src);

    // Remove icon
    const removeBtn = document.createElement('span');
    removeBtn.className = 'remove-photo';
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    removeBtn.title = 'Remove';
    removeBtn.onclick = (e) => {
      e.stopPropagation();
      let allPhotos = getPhotos();
      // Find the correct index in allPhotos
      const realIdx = showAll ? idx : photos.indexOf(src);
      allPhotos.splice(realIdx, 1);
      setPhotos(allPhotos);
      renderGallery(showAll);
    };

    wrapper.appendChild(img);
    wrapper.appendChild(removeBtn);
    gallery.appendChild(wrapper);
  });
  if (photos.length > MAX_VISIBLE) {
    btn.style.display = 'inline-block';
    btn.textContent = showAll ? 'Hide' : 'View More';
    btn.onclick = () => renderGallery(!showAll);
  } else {
    btn.style.display = 'none';
  }
}

// ...existing code...

// Reset history logic
document.addEventListener('DOMContentLoaded', () => {
  showSection('schedule');
  showHistory();

  // Photo gallery
  const photoInput = document.getElementById('photo-input');
  if (photoInput) {
    photoInput.addEventListener('change', handlePhotoInput);
    renderGallery();
  }
  // Modal
  document.getElementById('close-modal').onclick = closeModal;
  document.getElementById('photo-modal').onclick = function(e) {
    if (e.target === this) closeModal();
  };

  // Reset history button
  const resetBtn = document.getElementById('reset-history-btn');
  if (resetBtn) {
    resetBtn.onclick = function() {
      if (confirm('Are you sure you want to delete all training history?')) {
        localStorage.removeItem('gymHistory');
        showHistory();
      }
    };
  }
});

// ...existing code...

// ...existing code...
// --- Timer logic ---
let timerInterval = null;
let timerStart = null;
const MAX_TIMER_VISIBLE = 6;

function formatTimer(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const s = String(totalSec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function getTimerHistory() {
  return JSON.parse(localStorage.getItem('timerHistory') || '[]');
}
function setTimerHistory(arr) {
  localStorage.setItem('timerHistory', JSON.stringify(arr));
}
function renderTimerHistory(showAll = false) {
  const list = document.getElementById('timer-history-list');
  const btn = document.getElementById('view-more-timer-btn');
  const history = getTimerHistory();
  list.innerHTML = '';
  let visible = showAll ? history : history.slice(0, MAX_TIMER_VISIBLE);
  visible.forEach((item, idx) => {
    const li = document.createElement('li');
    li.textContent = `${item.time} (${item.date})`;
    // Remove button for each entry
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-timer';
    removeBtn.title = 'Remove this timer entry';
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    removeBtn.onclick = () => {
      let arr = getTimerHistory();
      const realIdx = showAll ? idx : history.indexOf(item);
      arr.splice(realIdx, 1);
      setTimerHistory(arr);
      renderTimerHistory(showAll);
    };
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
  if (history.length > MAX_TIMER_VISIBLE) {
    btn.style.display = 'inline-block';
    btn.textContent = showAll ? 'Hide' : 'View More';
    btn.onclick = () => renderTimerHistory(!showAll);
  } else {
    btn.style.display = 'none';
  }
}

function startTimer() {
  timerStart = Date.now();
  document.getElementById('start-timer-btn').style.display = 'none';
  document.getElementById('stop-timer-btn').style.display = '';
  document.getElementById('manual-timer-btn').style.display = 'none';
  document.getElementById('timer-display').textContent = '00:00:00';
  timerInterval = setInterval(() => {
    const ms = Date.now() - timerStart;
    document.getElementById('timer-display').textContent = formatTimer(ms);
  }, 1000);
}

function stopTimer() {
  if (!timerStart) return;
  clearInterval(timerInterval);
  const ms = Date.now() - timerStart;
  const timeStr = formatTimer(ms);
  saveTimerHistory(timeStr);
  document.getElementById('timer-display').textContent = '00:00:00';
  document.getElementById('start-timer-btn').style.display = '';
  document.getElementById('stop-timer-btn').style.display = 'none';
  document.getElementById('manual-timer-btn').style.display = '';
  timerStart = null;
}

function saveTimerHistory(timeStr) {
  const date = new Date().toLocaleString();
  let history = getTimerHistory();
  history.unshift({ time: timeStr, date });
  setTimerHistory(history);
  renderTimerHistory();
}

function showManualInput(show) {
  document.querySelector('.manual-time-row').style.display = show ? 'flex' : 'none';
}

function saveManualTime() {
  const min = parseInt(document.getElementById('manual-minutes').value, 10);
  if (!min || min < 1) {
    alert('Please enter minutes (1 or more)');
    return;
  }
  saveTimerHistory(formatTimer(min * 60000));
  document.getElementById('manual-minutes').value = '';
  showManualInput(false);
}

// --- Setup listeners ---
document.addEventListener('DOMContentLoaded', () => {
  showSection('schedule');
  showHistory();

  // Timer
  document.getElementById('start-timer-btn').onclick = startTimer;
  document.getElementById('stop-timer-btn').onclick = stopTimer;
  document.getElementById('manual-timer-btn').onclick = () => showManualInput(true);
  document.getElementById('save-manual-btn').onclick = saveManualTime;
  renderTimerHistory();

  // Photo gallery
  const photoInput = document.getElementById('photo-input');
  if (photoInput) {
    photoInput.addEventListener('change', handlePhotoInput);
    renderGallery();
  }

  // Modal
  const closeModalBtn = document.getElementById('close-modal');
  if (closeModalBtn) closeModalBtn.onclick = closeModal;
  const photoModal = document.getElementById('photo-modal');
  if (photoModal) {
    photoModal.onclick = function(e) {
      if (e.target === this) closeModal();
    };
  }
});

