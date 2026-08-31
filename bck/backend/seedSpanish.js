const mongoose = require('mongoose');
const Course = require('./models/Course');
const Module = require('./models/Module');
const Lesson = require('./models/Lesson');

const seedSpanishA1 = async () => {
    try {
        // 1. Clear existing Spanish Course, Modules, and Lessons
        const existingCourse = await Course.findOne({ language: 'Spanish' });
        if (existingCourse) {
            await Lesson.deleteMany({ moduleId: { $in: await Module.find({ courseId: existingCourse._id }).distinct('_id') } });
            await Module.deleteMany({ courseId: existingCourse._id });
            await Course.deleteOne({ _id: existingCourse._id });
        }

        // 2. Create Spanish Course
        const spanishCourse = new Course({
            courseId: 103,
            name: 'Spanish for Beginners (CEFR A1)',
            language: 'Spanish',
            description: 'Master the basics of Spanish with our structured A1 course.'
        });
        await spanishCourse.save();

        // 3. Create Modules
        const module1 = new Module({
            title: 'Greetings & Basics',
            description: 'Learn how to say hello and introduce yourself.',
            level: 'A1',
            courseId: spanishCourse._id,
            order: 1
        });

        const module2 = new Module({
            title: 'Module 1 Checkpoint',
            description: 'Review your knowledge of Greetings.',
            level: 'A1',
            courseId: spanishCourse._id,
            order: 2,
            isCheckpoint: true
        });

        await module1.save();
        await module2.save();

        // 4. Create Lessons for Module 1
        const lesson1 = new Lesson({
            title: 'Day 1: Common Greetings',
            type: 'Vocab',
            moduleId: module1._id,
            order: 1,
            content: {
                vocabulary: [
                    { word: 'Hola', translation: 'Hello', audioUrl: 'api/audio/es/hola.mp3', imageUrl: 'api/images/es/hola.jpg' },
                    { word: 'Buenos días', translation: 'Good morning', audioUrl: 'api/audio/es/buenos_dias.mp3', imageUrl: 'api/images/es/morning.jpg' },
                    { word: '¿Cómo estás?', translation: 'How are you?', audioUrl: 'api/audio/es/como_estas.mp3', imageUrl: 'api/images/es/mood.jpg' }
                ]
            }
        });

        const lesson2 = new Lesson({
            title: 'Day 2: Listening Practice',
            type: 'Listen',
            moduleId: module1._id,
            order: 2,
            content: {
                vocabulary: [
                    { word: 'Adiós', translation: 'Goodbye', audioUrl: 'api/audio/es/adios.mp3' },
                    { word: 'Hasta luego', translation: 'See you later', audioUrl: 'api/audio/es/hasta_luego.mp3' }
                ],
                quizQuestions: [
                    {
                        question: "Listen and select the word you hear: (Audio: Adiós)",
                        type: 'MCQ',
                        options: ['Hola', 'Adiós', 'Gracias'],
                        correctAnswer: 1
                    }
                ]
            }
        });

        const lesson3 = new Lesson({
            title: 'Day 3: Intro to Verbs',
            type: 'Grammar',
            moduleId: module1._id,
            order: 3,
            content: {
                grammarTip: '### Ser vs Estar\nBoth mean "to be", but **Ser** is for permanent things (traits, origin) and **Estar** is for temporary things (location, mood).',
                quizQuestions: [
                    {
                        question: "Match the following",
                        type: 'Match',
                        pairs: { 'Yo soy': 'I am (permanent)', 'Yo estoy': 'I am (temporary)' }
                    }
                ]
            }
        });

        await lesson1.save();
        await lesson2.save();
        await lesson3.save();

        // 5. Create Review Lesson (Checkpoint) for Module 2 - Day 4
        const checkpointLesson = new Lesson({
            title: 'Day 4: Unit 1 Review (Checkpoint)',
            type: 'Quiz',
            moduleId: module2._id,
            order: 1,
            content: {
                quizQuestions: [
                    {
                        question: "What does 'Buenos días' mean?",
                        type: 'MCQ',
                        options: ['Good afternoon', 'Good morning', 'Good night'],
                        correctAnswer: 1
                    },
                    {
                        question: "Which verb to use for 'I am happy' (mood)?",
                        type: 'MCQ',
                        options: ['Ser', 'Estar'],
                        correctAnswer: 1
                    }
                ]
            }
        });
        await checkpointLesson.save();

        // 6. Create Writing Module & Lesson - Day 5
        const module3 = new Module({
            title: 'Day 5: Writing Practice',
            description: 'Introduce yourself to the community.',
            level: 'A1',
            courseId: spanishCourse._id,
            order: 3
        });
        await module3.save();

        const writingLesson = new Lesson({
            title: 'Introduce Yourself',
            type: 'Writing',
            moduleId: module3._id,
            order: 1,
            content: {
                writingPrompt: 'Write a short introduction in Spanish: "Hola, me llamo [Name]. Soy de [Country]."'
            }
        });
        await writingLesson.save();

        // Link lessons to modules
        module1.lessons = [lesson1._id, lesson2._id, lesson3._id];
        module2.lessons = [checkpointLesson._id];
        module3.lessons = [writingLesson._id];
        await module1.save();
        await module2.save();
        await module3.save();

        // Link modules to course levels
        spanishCourse.levels = [{
            name: 'A1',
            description: 'Beginner Level',
            modules: [module1._id, module2._id, module3._id]
        }];
        await spanishCourse.save();

        console.log('✅ Spanish A1 Course Seeded Successfully!');
    } catch (err) {
        console.error('❌ Seeding error:', err);
    }
};

module.exports = seedSpanishA1;
