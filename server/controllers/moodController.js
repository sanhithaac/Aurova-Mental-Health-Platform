const Mood = require("../models/Mood");

// CREATE
exports.createMood = async (req, res) => {
  try {
    const mood = new Mood(req.body);
    await mood.save();
    res.status(201).json(mood);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL
exports.getAllMoods = async (req, res) => {
  try {
    const moods = await Mood.find();
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID
exports.getMoodById = async (req, res) => {
  try {
    const mood = await Mood.findOne({ moodId: req.params.id });
    if (!mood) return res.status(404).json({ message: "Not found" });
    res.json(mood);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateMood = async (req, res) => {
  try {
    const updated = await Mood.findOneAndUpdate(
      { moodId: req.params.id },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteMood = async (req, res) => {
  try {
    await Mood.findOneAndDelete({ moodId: req.params.id });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
