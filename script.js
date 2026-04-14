console.log("Premium CRM Loaded 🚀");

const form = document.getElementById("leadForm");
const leadList = document.getElementById("leadList");

const API = "http://127.0.0.1:5000/leads";

// 🌙 Dark mode toggle
const toggleBtn = document.createElement("button");
toggleBtn.innerText = "🌙 Toggle Theme";
toggleBtn.style.marginBottom = "15px";
document.querySelector(".main").prepend(toggleBtn);

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// 📥 Load leads
async function loadLeads() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    displayLeads(data);
  } catch (err) {
    console.log("Error:", err);
  }
}

// ➕ Add lead
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const lead = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    source: document.getElementById("source").value
  };

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(lead)
  });

  form.reset();
  loadLeads();
});

// 🎨 Display leads (Premium UI)
function displayLeads(leads) {
  leadList.innerHTML = "";

  leads.forEach((lead, index) => {
    const card = document.createElement("div");
    card.classList.add("lead-card");

    let statusClass = "";
    if (lead.status === "New") statusClass = "new";
    if (lead.status === "Contacted") statusClass = "contacted";
    if (lead.status === "Converted") statusClass = "converted";

    card.innerHTML = `
      <div class="card-header">
        <h3>${lead.name}</h3>
        <span class="badge ${statusClass}">${lead.status}</span>
      </div>

      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Source:</strong> ${lead.source}</p>
      <p><strong>Notes:</strong> ${lead.notes || "None"}</p>

      <div class="actions">
        <button onclick="updateStatus(${index})">Update</button>
        <button onclick="addNote(${index})">Add Note</button>
      </div>
    `;

    leadList.appendChild(card);
  });
}

// 🔄 Update status
async function updateStatus(index) {
  const statuses = ["New", "Contacted", "Converted"];

  const res = await fetch(API);
  const leads = await res.json();

  let current = statuses.indexOf(leads[index].status);
  let newStatus = statuses[(current + 1) % 3];

  await fetch(`${API}/${index}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus })
  });

  loadLeads();
}

// 📝 Add note
async function addNote(index) {
  const note = prompt("Enter follow-up note:");

  if (note) {
    await fetch(`${API}/${index}/note`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note })
    });

    loadLeads();
  }
}

// 🚀 Initial load
loadLeads();