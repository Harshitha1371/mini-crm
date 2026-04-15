const BASE_URL = "http://localhost:5000/leads";

// ADD LEAD
async function addLead() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const source = document.getElementById("source").value;
  const status = document.getElementById("status").value;

  if (!name || !email || !source || !status) {
    showToast("Fill all fields ❌");
    return;
  }

  try {
    await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, source, status })
    });

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("source").value = "";

    showToast("Lead added ✅");
    loadLeads();

  } catch (err) {
    showToast("Server not reachable ❌");
  }
}

// LOAD LEADS
async function loadLeads() {
  try {
    const res = await fetch(BASE_URL);
    const data = await res.json();

    const search = document.getElementById("search").value.toLowerCase();
    const container = document.getElementById("leads");
    container.innerHTML = "";

    data.forEach((lead, i) => {
      if (
        !lead.name.toLowerCase().includes(search) &&
        !lead.email.toLowerCase().includes(search)
      ) return;

      const card = document.createElement("div");
      card.className = "lead-card";

      card.innerHTML = `
        <h3>${lead.name}</h3>
        <p>${lead.email}</p>
        <p>Source: ${lead.source}</p>
        <p><b>Note:</b> ${lead.notes || "No notes yet"}</p>

        <span class="status ${lead.status.toLowerCase()}">${lead.status}</span>

        <br><br>

        <select onchange="updateStatus(${i}, this.value)">
          <option ${lead.status === "New" ? "selected" : ""}>New</option>
          <option ${lead.status === "Contacted" ? "selected" : ""}>Contacted</option>
          <option ${lead.status === "Closed" ? "selected" : ""}>Closed</option>
        </select>

        <br><br>

        <input placeholder="Add note" onchange="addNote(${i}, this.value)">

        <br><br>

        <button onclick="deleteLead(${i})">Delete</button>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    showToast("Server not reachable ❌");
  }
}

// UPDATE STATUS
async function updateStatus(index, status) {
  await fetch(`${BASE_URL}/${index}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });

  loadLeads();
}

// ADD NOTE
async function addNote(index, note) {
  await fetch(`${BASE_URL}/${index}/note`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note })
  });

  loadLeads();
}

// DELETE
async function deleteLead(index) {
  await fetch(`${BASE_URL}/${index}`, {
    method: "DELETE"
  });

  showToast("Deleted 🗑️");
  loadLeads();
}

// THEME
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// TOAST
function showToast(msg) {
  const toast = document.createElement("div");
  toast.innerText = msg;
  toast.className = "toast";
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2000);
}

// INIT
loadLeads();

// ENTER KEY NAVIGATION
document.getElementById("name").addEventListener("keypress", function(e) {
  if (e.key === "Enter") document.getElementById("email").focus();
});

document.getElementById("email").addEventListener("keypress", function(e) {
  if (e.key === "Enter") document.getElementById("source").focus();
});

document.getElementById("source").addEventListener("keypress", function(e) {
  if (e.key === "Enter") document.getElementById("status").focus();
});

document.getElementById("status").addEventListener("keypress", function(e) {
  if (e.key === "Enter") addLead();
});