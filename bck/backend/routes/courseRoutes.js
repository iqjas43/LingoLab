const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const express = require("express")
const router = express.Router()

const mongoose = require('mongoose');

// GET /api/courses/lesson/:lessonId
router.get('/lesson/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    
    // Check if it's a valid Mongo ObjectId (for new CEFR lessons)
    if (mongoose.Types.ObjectId.isValid(lessonId) && String(new mongoose.Types.ObjectId(lessonId)) === lessonId) {
        const lesson = await Lesson.findById(lessonId);
        if (lesson) {
            return res.json(lesson);
        }
    }

    // Fallback: Check if it's a legacy numeric unit
    const numId = Number(lessonId);
    if (!isNaN(numId)) {
        const course = await Course.findOne({ 'units.unitId': numId });
        if (course) {
            const legacyUnit = course.units.find(u => u.unitId === numId);
            if (legacyUnit) {
                // Map legacy unit to newer visual schema
                return res.json({
                    title: legacyUnit.title,
                    type: 'Vocab',
                    content: {
                        vocabulary: legacyUnit.words ? legacyUnit.words.map(w => ({
                            word: w.original,
                            translation: w.translation
                        })) : []
                    }
                });
            }
        }
    }

    return res.status(404).json({ error: 'Lesson not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate({
      path: 'levels.modules',
      populate: { path: 'lessons' }
    });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

