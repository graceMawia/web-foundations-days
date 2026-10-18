// ===== Starting data =====
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// ===== Functions =====

// Returns an array of notes whose text contains `word`, ignoring case.
function searchNotes(word) {
  const search = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(search));
}

// Returns the note object with the most characters, or null if there are no notes.
function longestNote() {
  if (notes.length === 0) {
    return null;
  }
  let longest = notes[0];
  for (const note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }
  return longest;
}

// Returns an object counting notes per category.
function countByCategory() {
  const counts = { personal: 0, work: 0, study: 0 };
  for (const note of notes) {
    counts[note.category]++;
  }
  return counts;
}

// Returns a sentence such as "5 notes: 2 personal, 1 work, 2 study."
function getSummary() {
  const counts = countByCategory();
  const total = notes.length;
  const word = total === 1 ? "note" : "notes";

  if (total === 0) {
    return "0 notes.";
  }

  const parts = [];
  for (const category in counts) {
    if (counts[category] > 0) {
      parts.push(`${counts[category]} ${category}`);
    }
  }
  return `${total} ${word}: ${parts.join(", ")}.`;
}

// Returns true if a note with the same text exists (ignoring case and extra spaces).
function isDuplicate(text) {
  const normalise = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");
  const target = normalise(text);
  return notes.some((note) => normalise(note.text) === target);
}

// Adds a note if valid. Returns true when added, false otherwise (and logs why).
function addNote(text, category) {
  const cleanText = text.trim();

  if (cleanText.length < 1 || cleanText.length > 200) {
    console.log("addNote failed: text must be 1-200 characters.");
    return false;
  }
  if (!["personal", "work", "study"].includes(category)) {
    console.log("addNote failed: category must be personal, work or study.");
    return false;
  }
  if (isDuplicate(cleanText)) {
    console.log("addNote failed: that note already exists.");
    return false;
  }

  const newId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
  notes.push({ id: newId, text: cleanText, category: category });
  return true;
}

// ===== Tests =====

// --- searchNotes ---
console.log("searchNotes('milk'):", searchNotes("milk"));
// Expected: [ { id: 1, text: "Buy milk and bread", category: "personal" } ]

console.log("searchNotes('THE'):", searchNotes("THE"));
// Expected: 2 notes - id 2 ("Finish the Day 3 assignment") and id 3 ("Email the project report to Grace")

console.log("searchNotes('zebra'):", searchNotes("zebra"));
// Expected: [] (no results)

// --- longestNote ---
console.log("longestNote():", longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

const savedNotes = notes; // keep the real array safe
notes = [];
console.log("longestNote() with no notes:", longestNote());
// Expected: null
notes = savedNotes; // put the real notes back

// --- countByCategory ---
console.log("countByCategory():", countByCategory());
// Expected: { personal: 2, work: 1, study: 2 }

notes = [];
console.log("countByCategory() with no notes:", countByCategory());
// Expected: { personal: 0, work: 0, study: 0 }
notes = savedNotes;

// --- getSummary ---
console.log("getSummary():", getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."

notes = [savedNotes[0]];
console.log("getSummary() with one note:", getSummary());
// Expected: "1 note: 1 personal."
notes = savedNotes;

// --- isDuplicate ---
console.log("isDuplicate('buy milk and bread'):", isDuplicate("buy milk and bread"));
// Expected: true (same text, different case)

console.log("isDuplicate('  BUY   milk and bread  '):", isDuplicate("  BUY   milk and bread  "));
// Expected: true (extra spaces and capitals are ignored)

console.log("isDuplicate('Buy eggs'):", isDuplicate("Buy eggs"));
// Expected: false

// --- addNote ---
console.log("addNote('Pay electricity bill', 'personal'):", addNote("Pay electricity bill", "personal"));
// Expected: true

console.log("addNote('pay  ELECTRICITY bill', 'work'):", addNote("pay  ELECTRICITY bill", "work"));
// Expected: logs "addNote failed: that note already exists." then false

console.log("addNote('', 'work'):", addNote("", "work"));
// Expected: logs "addNote failed: text must be 1-200 characters." then false

console.log("addNote(201 characters, 'work'):", addNote("x".repeat(201), "work"));
// Expected: logs "addNote failed: text must be 1-200 characters." then false

console.log("addNote('Plan weekend trip', 'fun'):", addNote("Plan weekend trip", "fun"));
// Expected: logs "addNote failed: category must be personal, work or study." then false

console.log("getSummary() after adding a note:", getSummary());
// Expected: "6 notes: 3 personal, 1 work, 2 study."
