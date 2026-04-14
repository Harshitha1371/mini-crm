// UPDATE status
app.put("/leads/:index", (req, res) => {
  const index = req.params.index;
  leads[index].status = req.body.status;
  res.json(leads[index]);
});

// ADD note
app.put("/leads/:index/note", (req, res) => {
  const index = req.params.index;
  leads[index].notes = req.body.note;
  res.json(leads[index]);
});