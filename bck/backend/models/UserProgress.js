const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    unlockedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    currentLevel: { type: String, default: 'A1' },
    lastAccessed: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound index to ensure unique progress per user per course
userProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
