const mongoose = require('mongoose');
const Course = require('./models/Course');
const Module = require('./models/Module');
const Lesson = require('./models/Lesson');

const seedFrenchA1 = async () => {
    try {
        // 1. Clear existing French Course, Modules, and Lessons
        const existingCourse = await Course.findOne({ language: 'French' });
        if (existingCourse) {
            await Lesson.deleteMany({ moduleId: { $in: await Module.find({ courseId: existingCourse._id }).distinct('_id') } });
            await Module.deleteMany({ courseId: existingCourse._id });
            await Course.deleteOne({ _id: existingCourse._id });
        }

        // 2. Create French Course
        const frenchCourse = new Course({
            courseId: 104,
            name: 'French for Beginners',
            language: 'French',
            description: 'Master French effortlessly.',
            totalLessons: 5
        });
        await frenchCourse.save();

        // 3. Create Chapter 1 (Module)
        const module1 = new Module({
            title: 'Chapitre 1: Les Salutations',
            description: 'Start your French journey with polite greetings and introductions.',
            level: 'A1',
            courseId: frenchCourse._id,
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
                    { word: 'Bonjour', translation: 'Hello / Good morning', pronunciation: 'bɔ̃.ʒuʁ' },
                    { word: 'Salut', translation: 'Hi/Bye (casual)', pronunciation: 'sa.ly' },
                    { word: 'Bonsoir', translation: 'Good evening', pronunciation: 'bɔ̃.swaʁ' }
                ]
            }
        });

        const lesson2 = new Lesson({
            title: 'Lesson 2: Simple Introductions',
            type: 'Vocab',
            moduleId: module1._id,
            order: 2,
            content: {
                vocabulary: [
                    { word: 'Comment vous appelez-vous?', translation: 'What is your name? (Formal)', pronunciation: 'kɔ.mɑ̃ vu.z‿a.ple vu' },
                    { word: 'Je m\'appelle...', translation: 'My name is...', pronunciation: 'ʒə m‿a.pɛl' },
                    { word: 'Enchanté(e)', translation: 'Pleased to meet you', pronunciation: 'ɑ̃.ʃɑ̃.te' }
                ]
            }
        });

        const lesson3 = new Lesson({
            title: 'Lesson 3: Politeness',
            type: 'Vocab',
            moduleId: module1._id,
            order: 3,
            content: {
                vocabulary: [
                    { word: 'Merci', translation: 'Thank you', pronunciation: 'mɛʁ.si' },
                    { word: 'Merci beaucoup', translation: 'Thank you very much', pronunciation: 'mɛʁ.si bo.ku' },
                    { word: 'S\'il vous plaît', translation: 'Please (Formal)', pronunciation: 'sil vu plɛ' }
                ]
            }
        });

        const lesson4 = new Lesson({
            title: 'Lesson 4: How are you?',
            type: 'Vocab',
            moduleId: module1._id,
            order: 4,
            content: {
                vocabulary: [
                    { word: 'Comment ça va?', translation: 'How is it going?', pronunciation: 'kɔ.mɑ̃ sa va' },
                    { word: 'Ça va bien', translation: 'It\'s going well', pronunciation: 'sa va bjɛ̃' },
                    { word: 'Et toi?', translation: 'And you? (Casual)', pronunciation: 'e twa' }
                ]
            }
        });

        const lesson5 = new Lesson({
            title: 'Lesson 5: Saying Goodbye',
            type: 'Vocab',
            moduleId: module1._id,
            order: 5,
            content: {
                vocabulary: [
                    { word: 'Au revoir', translation: 'Goodbye', pronunciation: 'o ʁə.vwaʁ' },
                    { word: 'À bientôt', translation: 'See you soon', pronunciation: 'a bjɛ̃.to' },
                    { word: 'Bonne nuit', translation: 'Good night', pronunciation: 'bɔn nɥi' }
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
        frenchCourse.levels = [{
            name: 'A1',
            description: 'Beginner Level',
            modules: [module1._id]
        }];
        await frenchCourse.save();

        console.log('✅ French Course Seeded Successfully!');
    } catch (err) {
        console.error('❌ Seeding error:', err);
    }
};

module.exports = seedFrenchA1;
