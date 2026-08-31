const mongoose = require('mongoose');
const Course = require('./models/Course');
const Module = require('./models/Module');
const Lesson = require('./models/Lesson');

const seedEnglishA1 = async () => {
    try {
        // 1. Clear existing English Course, Modules, and Lessons
        const existingCourse = await Course.findOne({ language: 'English' });
        if (existingCourse) {
            await Lesson.deleteMany({ moduleId: { $in: await Module.find({ courseId: existingCourse._id }).distinct('_id') } });
            await Module.deleteMany({ courseId: existingCourse._id });
            await Course.deleteOne({ _id: existingCourse._id });
        }

        // 2. Create English Course
        const englishCourse = new Course({
            courseId: 102,
            name: 'English for Beginners',
            language: 'English',
            description: 'Master English from the ground up.',
            totalLessons: 5
        });
        await englishCourse.save();

        // 3. Create Chapter 1 (Module)
        const module1 = new Module({
            title: 'Chapter 1: Greetings & Hello',
            description: 'Essential English greetings and simple polite phrases.',
            level: 'A1',
            courseId: englishCourse._id,
            order: 1
        });
        await module1.save();

        // 4. Create Lessons for Module 1
        const lesson1 = new Lesson({
            title: 'Lesson 1: Common Greetings',
            type: 'Vocab',
            moduleId: module1._id,
            order: 1,
            content: {
                vocabulary: [
                    { word: 'Hello', translation: 'नमस्ते', pronunciation: 'həˈloʊ' },
                    { word: 'Hi', translation: 'नमस्ते (casual)', pronunciation: 'haɪ' },
                    { word: 'Good Morning', translation: 'शुभ प्रभात', pronunciation: 'ɡʊd ˈmɔːrnɪŋ' }
                ]
            }
        });

        const lesson2 = new Lesson({
            title: 'Lesson 2: Meeting People',
            type: 'Vocab',
            moduleId: module1._id,
            order: 2,
            content: {
                vocabulary: [
                    { word: 'Nice to meet you', translation: 'आपसे मिलकर खुशी हुई', pronunciation: 'naɪs tu miːt ju' },
                    { word: 'Welcome', translation: 'स्वागत है', pronunciation: 'ˈwelkəm' }
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
                    { word: 'Goodbye', translation: 'अलविदा', pronunciation: 'ˌɡʊdˈbaɪ' },
                    { word: 'See you later', pronunciation: 'siː ju ˈleɪtər', translation: 'फिर मिलेंगे' },
                    { word: 'Bye', translation: 'बाय (casual)', pronunciation: 'baɪ' }
                ]
            }
        });

        const lesson4 = new Lesson({
            title: 'Lesson 4: Asking for Names',
            type: 'Vocab',
            moduleId: module1._id,
            order: 4,
            content: {
                vocabulary: [
                    { word: 'What is your name?', translation: 'आपका नाम क्या है?', pronunciation: 'wɑːt ɪz jɔːr neɪm?' },
                    { word: 'My name is...', translation: 'मेरा नाम ... है', pronunciation: 'maɪ neɪm ɪz...' }
                ]
            }
        });

        const lesson5 = new Lesson({
            title: 'Lesson 5: Polite Expressions',
            type: 'Vocab',
            moduleId: module1._id,
            order: 5,
            content: {
                vocabulary: [
                    { word: 'Thank you', translation: 'धन्यवाद', pronunciation: 'θæŋk ju' },
                    { word: 'Please', translation: 'कृपया', pronunciation: 'pliːz' },
                    { word: 'How are you?', translation: 'आप कैसे हैं?', pronunciation: 'haʊ ɑːr ju?' }
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
        englishCourse.levels = [{
            name: 'A1',
            description: 'Beginner Level',
            modules: [module1._id]
        }];
        await englishCourse.save();

        console.log('✅ English Course Seeded Successfully!');
    } catch (err) {
        console.error('❌ Seeding error:', err);
    }
};

module.exports = seedEnglishA1;
