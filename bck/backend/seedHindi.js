const mongoose = require('mongoose');
const Course = require('./models/Course');
const Module = require('./models/Module');
const Lesson = require('./models/Lesson');

const seedHindiA1 = async () => {
    try {
        // 1. Clear existing Hindi Course, Modules, and Lessons
        const existingCourse = await Course.findOne({ language: 'Hindi' });
        if (existingCourse) {
            await Lesson.deleteMany({ moduleId: { $in: await Module.find({ courseId: existingCourse._id }).distinct('_id') } });
            await Module.deleteMany({ courseId: existingCourse._id });
            await Course.deleteOne({ _id: existingCourse._id });
        }

        // 2. Create Hindi Course
        const hindiCourse = new Course({
            courseId: 101, // Based on existing seedCourses.js
            name: 'Hindi for Beginners',
            language: 'Hindi',
            description: 'Master Hindi effortlessly.',
            totalLessons: 5
        });
        await hindiCourse.save();

        // 3. Create Chapter 1 (Module)
        const module1 = new Module({
            title: 'Chapter 1: Basics',
            description: 'Start your Hindi journey with greetings and basic phrases.',
            level: 'A1',
            courseId: hindiCourse._id,
            order: 1
        });
        await module1.save();

        // 4. Create Lessons for Module 1
        const lesson1 = new Lesson({
            title: 'Lesson 1: Greetings & Hello',
            type: 'Vocab',
            moduleId: module1._id,
            order: 1,
            content: {
                vocabulary: [
                    { word: 'नमस्ते', translation: 'Hello', pronunciation: 'Namaste' },
                    { word: 'शुभ प्रभात', translation: 'Good Morning', pronunciation: 'Shubh Prabhaat' },
                    { word: 'शुभ संध्या', translation: 'Good Evening', pronunciation: 'Shubh Sandhya' }
                ]
            }
        });

        const lesson2 = new Lesson({
            title: 'Lesson 2: Introducing Yourself',
            type: 'Vocab',
            moduleId: module1._id,
            order: 2,
            content: {
                vocabulary: [
                    { word: 'मेरा नाम ... है', translation: 'My name is ...', pronunciation: 'Mera naam ... hai' },
                    { word: 'मैं ... से हूँ', translation: 'I am from ...', pronunciation: 'Main ... se hoon' }
                ]
            }
        });

        const lesson3 = new Lesson({
            title: 'Lesson 3: Saying Goodbye',
            type: 'Vocab',
            moduleId: module1._id,
            order: 3,
            content: {
                vocabulary: [
                    { word: 'अलविदा', translation: 'Goodbye', pronunciation: 'Alvida' },
                    { word: 'फिर मिलेंगे', translation: 'See you later', pronunciation: 'Phir milenge' }
                ]
            }
        });

        const lesson4 = new Lesson({
            title: 'Lesson 4: Giving your name',
            type: 'Vocab',
            moduleId: module1._id,
            order: 4,
            content: {
                vocabulary: [
                    { word: 'आपका नाम क्या है?', translation: 'What is your name? (Formal)', pronunciation: 'Aapka naam kya hai?' },
                    { word: 'तुम्हारा नाम क्या है?', translation: 'What is your name? (Informal)', pronunciation: 'Tumhara naam kya hai?' }
                ]
            }
        });

        const lesson5 = new Lesson({
            title: 'Lesson 5: Common Phrases',
            type: 'Vocab',
            moduleId: module1._id,
            order: 5,
            content: {
                vocabulary: [
                    { word: 'आप कैसे हैं?', translation: 'How are you?', pronunciation: 'Aap kaise hain?' },
                    { word: 'मैं ठीक हूँ', translation: 'I am fine', pronunciation: 'Main theek hoon' },
                    { word: 'धन्यवाद', translation: 'Thank you', pronunciation: 'Dhanyavaad' }
                ]
            }
        });

        await lesson1.save();
        await lesson2.save();
        await lesson3.save();
        await lesson4.save();
        await lesson5.save();

        // Link lessons to module
        module1.lessons = [lesson1._id, lesson2._id, lesson3._id, lesson4._id, lesson5._id];
        await module1.save();

        // Link modules to course levels
        hindiCourse.levels = [{
            name: 'A1',
            description: 'Beginner Level',
            modules: [module1._id]
        }];
        await hindiCourse.save();

        console.log('✅ Hindi Course (Chapters & Lessons) Seeded Successfully!');
    } catch (err) {
        console.error('❌ Seeding error:', err);
    }
};

module.exports = seedHindiA1;
