const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['Vocab', 'Listen', 'Grammar', 'Quiz', 'Writing', 'Pattern'], required: true },
    content: {
        vocabulary: [{
            word: String,
            translation: String,
            audioUrl: String,
            imageUrl: String
        }],
        grammarTip: { type: String },
        quizQuestions: [{
            question: String,
            type: { type: String, enum: ['MCQ', 'Match'] },
            options: [String],
            correctAnswer: { type: mongoose.Schema.Types.Mixed },
            pairs: { type: Map, of: String } // For Match type
        }],
        writingPrompt: { type: String },
        pattern: {
            description: String,
            examples: [{ hindi: String, english: String }]
        },
        questions: [{ hindi: String, english: String }],
        ritualGreetings: [{ hindi: String, english: String }]
    },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    order: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
