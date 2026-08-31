const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Helper to shuffle array
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// GET /api/quiz/lesson/:lessonId
router.get('/lesson/:lessonId', async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { lang } = req.query;

        // 1. Fetch the course to check for legacy units
        const course = await Course.findOne({ language: lang || 'Hindi' });
        if (!course) return res.status(404).json({ error: 'Course not found' });

        // Helper boolean to check if it's an ObjectId
        const isObjectId = lessonId.length === 24 && /^[0-9a-fA-F]{24}$/.test(lessonId);

        let unitWords = [];
        let distractorsPool = course.units.flatMap(u => u.words || []);

        if (isObjectId) {
            // New CEFR Lesson structure
            const mongoose = require('mongoose');
            const Lesson = require('../models/Lesson');
            const lesson = await Lesson.findById(lessonId);
            if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
            
            // Extract vocabulary from lesson content
            unitWords = lesson.content?.vocabulary?.map(v => ({
                original: v.word,
                translation: v.translation
            })) || [];
            
            // Add these to distractors pool if not already there
            distractorsPool = [...distractorsPool, ...unitWords];
        } else {
            // Legacy structured unit
            const unit = course.units.find(u => u.unitId === Number(lessonId));
            if (!unit || !unit.words || unit.words.length === 0) {
                return res.status(404).json({ error: 'Unit content not found' });
            }
            unitWords = unit.words;
        }

        if (unitWords.length === 0) {
            return res.status(404).json({ error: 'No vocabulary available to generate quiz' });
        }

        // 3. Generate Questions
        // We need 'distractors' (wrong answers). We can use words from this unit + other units.
        const allWords = distractorsPool;

        const quizQuestions = unitWords.map(targetWord => {
            // Pick 3 random distractors that are NOT the target word
            const distractors = allWords
                .filter(w => w.original !== targetWord.original)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(w => w.translation);

            // Combine correct answer and distractors
            const options = shuffle([targetWord.translation, ...distractors]);

            // Find where the correct answer ended up
            const correctIndex = options.indexOf(targetWord.translation);

            return {
                word: targetWord.original,
                options: options,
                correctIndex: correctIndex
            };
        });

        // Shuffle the questions themselves so they aren't always in same order
        res.json(shuffle(quizQuestions));

    } catch (err) {
        console.error("Quiz Gen Error:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
