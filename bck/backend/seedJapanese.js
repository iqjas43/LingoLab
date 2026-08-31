const mongoose = require('mongoose');
const Course = require('./models/Course');
const Module = require('./models/Module');
const Lesson = require('./models/Lesson');

const seedJapaneseA1 = async () => {
    try {
        // 1. Clear existing Japanese Course, Modules, and Lessons
        const existingCourse = await Course.findOne({ language: 'Japanese' });
        if (existingCourse) {
            await Lesson.deleteMany({ moduleId: { $in: await Module.find({ courseId: existingCourse._id }).distinct('_id') } });
            await Module.deleteMany({ courseId: existingCourse._id });
            await Course.deleteOne({ _id: existingCourse._id });
        }

        // 2. Create Japanese Course
        const japaneseCourse = new Course({
            courseId: 105,
            name: 'Japanese for Beginners',
            language: 'Japanese',
            description: 'Master Japanese with structured A1 content.',
            totalLessons: 5
        });
        await japaneseCourse.save();

        // 3. Create Chapter 1 (Module)
        const module1 = new Module({
            title: '第1章: あいさつ (Aisatsu - Greetings)',
            description: 'Learn basic Japanese greetings and how to naturally greet people.',
            level: 'A1',
            courseId: japaneseCourse._id,
            order: 1
        });
        await module1.save();

        // 4. Create Lessons for Module 1
        const lesson1 = new Lesson({
            title: 'Lesson 1: Common Greetings (Aisatsu)',
            type: 'Vocab',
            moduleId: module1._id,
            order: 1,
            content: {
                vocabulary: [
                    { word: 'こんにちは', translation: 'Hello / Good Afternoon', pronunciation: 'Konnichiwa' },
                    { word: 'おはよう', translation: 'Good Morning', pronunciation: 'Ohayou' },
                    { word: 'おやすみ', translation: 'Good Night', pronunciation: 'Oyasumi' }
                ]
            }
        });

        const lesson2 = new Lesson({
            title: 'Lesson 2: Meeting Someone New',
            type: 'Vocab',
            moduleId: module1._id,
            order: 2,
            content: {
                vocabulary: [
                    { word: 'はじめまして', translation: 'Nice to meet you (for the first time)', pronunciation: 'Hajimemashite' },
                    { word: 'よろしくおねがいします', translation: 'Please be kind to me / Let\'s get along', pronunciation: 'Yoroshiku Onegaishimasu' }
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
                    { word: 'ありがとうございます', translation: 'Thank you', pronunciation: 'Arigatou Gozaimasu' },
                    { word: 'すみません', translation: 'Excuse me / I\'m sorry', pronunciation: 'Sumimasen' },
                    { word: 'おねがいします', translation: 'Please', pronunciation: 'Onegaishimasu' }
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
                    { word: 'おげんきですか?', translation: 'Are you well? / How are you?', pronunciation: 'O-genki desu ka?' },
                    { word: 'げんきです', translation: 'I am well', pronunciation: 'Genki desu' }
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
                    { word: 'さようなら', translation: 'Goodbye', pronunciation: 'Sayounara' },
                    { word: 'じゃあ、また', translation: 'Well, see you later', pronunciation: 'Jaa, mata' },
                    { word: 'お疲れ様でした', translation: 'Thank you for your hard work', pronunciation: 'Otsukaresama deshita' }
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
        japaneseCourse.levels = [{
            name: 'A1',
            description: 'Beginner Level',
            modules: [module1._id]
        }];
        await japaneseCourse.save();

        console.log('✅ Japanese Course Seeded Successfully!');
    } catch (err) {
        console.error('❌ Seeding error:', err);
    }
};

module.exports = seedJapaneseA1;
