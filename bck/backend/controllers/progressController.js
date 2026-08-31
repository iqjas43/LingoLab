const UserProgress = require('../models/UserProgress');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const mongoose = require('mongoose');

/**
 * Handles completing a lesson and unlocking the next module.
 */
exports.completeLesson = async (req, res) => {
    try {
        const { userId, lessonId, courseId } = req.body;

        if (!userId || !lessonId) {
            return res.status(400).json({ message: "userId and lessonId are required" });
        }

        // 1. Resolve Course _id if necessary (for legacy or numeric courseId)
        let courseInternalId = courseId;
        if (courseId && !isNaN(Number(courseId)) && !String(courseId).match(/^[0-9a-fA-F]{24}$/)) {
            const courseDoc = await Course.findOne({ courseId: Number(courseId) });
            if (courseDoc) courseInternalId = courseDoc._id;
        }

        // 2. Find User Progress for THIS specific course
        let query = { userId };
        if (courseInternalId && mongoose.Types.ObjectId.isValid(courseInternalId)) {
            query.courseId = courseInternalId;
        }

        let progress = await UserProgress.findOne(query);
        
        // If no progress found and we have course ID, create one
        if (!progress && courseInternalId && mongoose.Types.ObjectId.isValid(courseInternalId)) {
            progress = new UserProgress({
                userId,
                courseId: courseInternalId,
                completedLessons: [],
                unlockedModules: []
            });
        }

        if (!progress) return res.status(404).json({ message: "Progress not found and could not be initialized" });

        // 3. Add lesson to completedLessons if not already there
        if (!progress.completedLessons.some(id => String(id) === String(lessonId))) {
            progress.completedLessons.push(lessonId);
        }

        // 4. Find current lesson and module
        let currentModule;
        if (mongoose.Types.ObjectId.isValid(lessonId)) {
            const currentLesson = await Lesson.findById(lessonId);
            if (currentLesson) {
                currentModule = await Module.findById(currentLesson.moduleId).populate('lessons');
            }
        }

        // If it's a module/CEFR lesson, handle unlocking
        if (currentModule) {
            const completedLessonIds = progress.completedLessons.map(id => id.toString());
            const allLessonsCompleted = currentModule.lessons.every(lesson =>
                completedLessonIds.includes(lesson._id.toString())
            );

            if (allLessonsCompleted) {
                // Unlock Next Module
                const course = await Course.findById(currentModule.courseId).populate({
                    path: 'levels.modules',
                    model: 'Module'
                });

                let allCourseModules = [];
                course.levels.forEach(level => {
                    allCourseModules = [...allCourseModules, ...level.modules];
                });

                const currentModuleIdx = allCourseModules.findIndex(m => m._id.toString() === currentModule._id.toString());
                const nextModule = allCourseModules[currentModuleIdx + 1];

                if (nextModule && !progress.unlockedModules.some(m => String(m) === String(nextModule._id))) {
                    progress.unlockedModules.push(nextModule._id);
                }
            }
        }

        await progress.save();
        res.json({ message: "Lesson progress saved", unlockedNext: true });

    } catch (err) {
        console.error("Error in completeLesson:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
