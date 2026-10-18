// 1. Select elements
const textarea = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggle = document.querySelector("#theme-toggle");

const MAX_CHARS = 200;
const WARN_AT = 180;
const DRAFT_KEY = "day4-draft";
const THEME_KEY = "day4-theme";

// 2. Update counters and warning classes
function updateCounts() {
  const text = textarea.value;
  const chars = text.length;
  const trimmed = text.trim();
  const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;

  charCount.textContent = `${chars} / ${MAX_CHARS} characters`;
  wordCount.textContent = `${words} words`;

  charCount.classList.toggle("over", chars > MAX_CHARS);
  charCount.classList.toggle("warning", chars > WARN_AT && chars <= MAX_CHARS);
}

// 3. Draft
function saveDraft() {
  localStorage.setItem(DRAFT_KEY, textarea.value);
}

function clearAll() {
  textarea.value = "";
  localStorage.removeItem(DRAFT_KEY);
  updateCounts();
  textarea.focus();
}

// 4. Theme
function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
}

// 5. Events
textarea.addEventListener("input", () => {
  updateCounts();
  saveDraft();
});

textarea.addEventListener("keydown", (event) => {
  if (event.key === "Escape") clearAll();
});

clearBtn.addEventListener("click", clearAll);

themeToggle.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark");
  applyTheme(isDark);
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
});

// 6. On page load: restore draft and theme
const savedDraft = localStorage.getItem(DRAFT_KEY);
if (savedDraft) textarea.value = savedDraft;
applyTheme(localStorage.getItem(THEME_KEY) === "dark");
updateCounts();
