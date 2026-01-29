// DOM Elements
const body = document.body;
const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');
const userNameElement = document.getElementById('userName');
const messageForm = document.getElementById('message-form');
const currentTimeElement = document.getElementById('current-time');
const senderNameElement = document.getElementById('sender-name');
const senderDobElement = document.getElementById('sender-dob');
const senderGenderElement = document.getElementById('sender-gender');
const senderMessageElement = document.getElementById('sender-message');
const resultContainer = document.getElementById('result-container');

// --- Greeting Logic ---
function initGreeting() {
  if (!userNameElement) return;

  let params = new URLSearchParams(document.location.search);
  let name = params.get("user");

  // Fallback to localStorage logic if query param not present (or keep strictly to reqs)
  // Requirement: "Ambil dari localStorage jika ada. Jika belum ada, minta input via prompt"

  let storedName = localStorage.getItem('visitorName');

  if (!storedName) {
    storedName = prompt("Masukkan nama kamu:", "Guest");
    if (!storedName) storedName = "Guest"; // Handle cancel/empty
    localStorage.setItem('visitorName', storedName);
  }

  userNameElement.textContent = storedName;
}

// --- Navbar Logic ---
function initNavbar() {
  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
  });
}

// --- Form Logic ---
function initForm() {
  if (!messageForm) return;

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Inputs
    const nameInput = document.getElementById('name');
    const dobInput = document.getElementById('dob');
    const genderInput = document.querySelector('input[name="gender"]:checked');
    const messageInput = document.getElementById('message');

    // Reset errors
    document.querySelectorAll('.error-msg').forEach(el => el.classList.add('hidden'));

    let isValid = true;

    // Validation
    if (!nameInput.value.trim()) {
      showError(nameInput, "Nama wajib diisi");
      isValid = false;
    }

    if (!dobInput.value) {
      showError(dobInput, "Tanggal lahir wajib diisi");
      isValid = false;
    }

    if (!genderInput) {
      // Error for radio group logic can be tricky to place, usually put near the label container
      const genderContainer = document.getElementById('gender-container');
      showError(genderContainer, "Jenis kelamin wajib dipilih");
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      showError(messageInput, "Pesan wajib diisi");
      isValid = false;
    } else if (messageInput.value.length < 10) {
      showError(messageInput, "Pesan minimal 10 karakter");
      isValid = false;
    }

    if (isValid) {
      displayResult({
        name: nameInput.value,
        dob: dobInput.value,
        gender: genderInput.value,
        message: messageInput.value
      });
    }
  });
}

function showError(inputElement, message) {
  // Expecting logic: sibling or nearby element for error
  // We will assume the HTML structure has a <p class="error-msg ... hidden"></p> sibling or we create one?
  // Requirement says: "tampilkan error inline per field".
  // Let's rely on a helper or existing structure.
  // Ideally the HTML has a specific place for this.

  // Simpler approach: find the next element sibling that is an error placeholder
  let errorEl = inputElement.parentElement.querySelector('.error-msg');

  // If not strict specific structure, let's assume we toggle visibility.
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  }
}

function displayResult(data) {
  if (!resultContainer) return;

  const now = new Date();
  currentTimeElement.textContent = now.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  senderNameElement.textContent = data.name;
  senderDobElement.textContent = data.dob;
  senderGenderElement.textContent = data.gender;
  senderMessageElement.textContent = data.message;

  // Optional: Scroll to result or highlight check
}

// --- Slider Logic ---
function initSlider() {
  const slides = document.querySelectorAll('.slide');
  if (slides.length === 0) return;

  let currentSlide = 0;

  setInterval(() => {
    // Hide current
    slides[currentSlide].classList.remove('opacity-100');
    slides[currentSlide].classList.add('opacity-0');

    // Move to next
    currentSlide = (currentSlide + 1) % slides.length;

    // Show next
    slides[currentSlide].classList.remove('opacity-0');
    slides[currentSlide].classList.add('opacity-100');
  }, 4000); // 4 seconds per slide
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initGreeting();
  initNavbar();
  initSlider(); // Added slider init
  initForm();
});
