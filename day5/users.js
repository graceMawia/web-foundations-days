const loadBtn = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusEl = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

const API_URL = "https://jsonplaceholder.typicode.com/users";

let users = []; // all loaded users (single source of truth)

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

async function loadUsers() {
  setStatus("Loading users...");
  loadBtn.disabled = true;
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
    users = await response.json();
    filterInput.value = "";
    renderUsers(users);
    setStatus(`Loaded ${users.length} users.`);
  } catch (error) {
    setStatus(`Could not load users: ${error.message}`, true);
  } finally {
    loadBtn.disabled = false;
  }
}

function renderUsers(list) {
  usersList.innerHTML = ""; // safe: no user text
  if (list.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No users match your filter.";
    usersList.appendChild(li);
    return;
  }
  list.forEach((user) => {
    const li = document.createElement("li");

    const name = document.createElement("span");
    name.classList.add("user-name");
    name.textContent = user.name;

    const email = document.createElement("span");
    email.textContent = "Email: " + user.email;

    const city = document.createElement("span");
    city.textContent = "City: " + user.address.city;

    const company = document.createElement("span");
    company.textContent = "Company: " + user.company.name;

    [name, email, city, company].forEach((el) => {
      el.style.display = "block";
      li.appendChild(el);
    });
    usersList.appendChild(li);
  });
}

loadBtn.addEventListener("click", loadUsers);

// Filter the stored array: no new request
filterInput.addEventListener("input", () => {
  if (users.length === 0) return;
  const term = filterInput.value.trim().toLowerCase();
  renderUsers(users.filter((u) => u.name.toLowerCase().includes(term)));
});
