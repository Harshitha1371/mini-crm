const express = require("express");
const cors = require("cors");

const app = express();

// allow frontend
app.use(cors({
  origin: ["http://localhost:5500", "http://127.0.0.1:5500"]
}));

app.use(express.json());

let leads = [];

// GET all leads
app.get("/leads", (req, res) => {
  res.json(leads);
});

// ADD lead
app.post("/leads", (req, res) => {
  const { name, email, source, status } = req.body;

  if (!name || !email || !source || !status) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const newLead = {
    name,
    email,
    source,
    status,
    notes: ""
  };

  leads.push(newLead);
  res.json(newLead);
});

// UPDATE status
app.put("/leads/:index", (req, res) => {
  const index = req.params.index;

  if (!leads[index]) {
    return res.status(404).json({ error: "Lead not found" });
  }

  leads[index].status = req.body.status;
  res.json(leads[index]);
});

// ADD note
app.put("/leads/:index/note", (req, res) => {
  const index = req.params.index;

  if (!leads[index]) {
    return res.status(404).json({ error: "Lead not found" });
  }

  leads[index].notes = req.body.note;
  res.json(leads[index]);
});

// DELETE
app.delete("/leads/:index", (req, res) => {
  const index = req.params.index;

  if (!leads[index]) {
    return res.status(404).json({ error: "Lead not found" });
  }

  leads.splice(index, 1);
  res.json({ message: "Deleted" });
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});