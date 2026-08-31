const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    level: { type: String, enum: ['A1', 'A2', 'B1', 'B2'], required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    order: { type: Number, required: true },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    isCheckpoint: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);
