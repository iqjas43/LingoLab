const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  lessonId: { type: Number, required: true },
  language: { type: String, required: true },   // yaha naya field
  word: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true }
});

module.exports = mongoose.model('Question', questionSchema);
