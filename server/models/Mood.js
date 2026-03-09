const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema({
  moodId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  moodType: { type: String, required: true },
  stressLevel: { type: Number, required: true },
  sleepHours: { type: Number, required: true },
  energyLevel: { type: Number, required: true },
  notes: { type: String },
  consentToShare: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Mood", moodSchema);
