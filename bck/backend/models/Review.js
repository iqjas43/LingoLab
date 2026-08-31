const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    feedback: [{
        reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
