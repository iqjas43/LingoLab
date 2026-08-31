const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  language: { type: String, required: true },
  description: { type: String, required: true },
  levels: [{
    name: { type: String, enum: ['A1', 'A2', 'B1', 'B2'], required: true },
    description: { type: String },
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }]
  }],
  units: { type: Array, default: [] },
  totalLessons: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
