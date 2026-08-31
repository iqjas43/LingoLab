const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const Course = require('../models/Course');
const User = require('../models/User');




const progressController = require('../controllers/progressController');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');

// GET progress for a user and course
router.get('/:userId/:courseId', async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        // 1. Resolve Course _id if necessary
        let courseInternalId = courseId;
        if (!isNaN(Number(courseId)) && !String(courseId).match(/^[0-9a-fA-F]{24}$/)) {
            const courseDoc = await Course.findOne({ courseId: Number(courseId) });
            if (courseDoc) courseInternalId = courseDoc._id;
        }

        if (!courseInternalId) {
            return res.status(404).json({ error: "Course not found" });
        }

        let progress = await UserProgress.findOne({ userId, courseId: courseInternalId })
            .populate('completedLessons')
            .populate('unlockedModules');

        if (!progress) {
            // Find the first module of the course to unlock it by default
            const course = await Course.findById(courseInternalId).populate('levels.modules');
            const firstModuleId = course?.levels[0]?.modules[0]?._id;

            progress = new UserProgress({
                userId,
                courseId: courseInternalId,
                unlockedModules: firstModuleId ? [firstModuleId] : []
            });
            await progress.save();
        }

        res.json(progress);
    } catch (err) {
        console.error("GET Progress Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// POST update progress (complete lesson)
router.post('/complete', progressController.completeLesson);

module.exports = router;
