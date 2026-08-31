const mongoose = require('mongoose');
const Course = require('./models/Course');
const Module = require('./models/Module');
const Lesson = require('./models/Lesson');
require('dotenv').config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lingolab');
        const courses = await Course.countDocuments();
        const modules = await Module.countDocuments();
        const lessons = await Lesson.countDocuments();
        console.log(`Courses: ${courses}, Modules: ${modules}, Lessons: ${lessons}`);

        const allCourses = await Course.find({}, 'name language');
        allCourses.forEach(c => console.log(` - ${c.name} (${c.language})`));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
check();
