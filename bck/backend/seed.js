const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');
const seedCourses = require('./seedCourses');
const Question = require('./models/Question');
const User = require('./models/User');

const connectDB = require('./db');

const seedData = async () => {
    await connectDB();

    console.log('Seeding data...');

    // 1. Run the detailed course seeder (clears and repopulates courses)
    await seedCourses();
    const seedSpanishA1 = require('./seedSpanish');
    await seedSpanishA1();
    const seedHindiA1 = require('./seedHindi');
    await seedHindiA1();
    const seedEnglishA1 = require('./seedEnglish');
    await seedEnglishA1();
    const seedFrenchA1 = require('./seedFrench');
    await seedFrenchA1();
    const seedJapaneseA1 = require('./seedJapanese');
    await seedJapaneseA1();

    // 2. Clear other data
    await Question.deleteMany({});
    // Optional: await User.deleteMany({}); // Don't delete users to avoid losing progress
    const questions = [
        // HINDI
        { lessonId: 1, language: 'Hindi', word: 'Apple', options: ['Seb', 'Kela', 'Aam', 'Anar'], correctIndex: 0 },
        { lessonId: 1, language: 'Hindi', word: 'Book', options: ['Kitab', 'Kursi', 'Mez', 'Pankha'], correctIndex: 0 },
        { lessonId: 1, language: 'Hindi', word: 'Water', options: ['Chai', 'Pani', 'Doodh', 'Juice'], correctIndex: 1 },

        // SPANISH
        { lessonId: 1, language: 'Spanish', word: 'Apple', options: ['Manzana', 'Plátano', 'Naranja', 'Uva'], correctIndex: 0 },
        { lessonId: 1, language: 'Spanish', word: 'Book', options: ['Libro', 'Silla', 'Mesa', 'Lápiz'], correctIndex: 0 },
        { lessonId: 1, language: 'Spanish', word: 'Water', options: ['Agua', 'Leche', 'Jugo', 'Café'], correctIndex: 0 },

        // FRENCH
        { lessonId: 1, language: 'French', word: 'Apple', options: ['Pomme', 'Banane', 'Orange', 'Raisin'], correctIndex: 0 },
        { lessonId: 1, language: 'French', word: 'Book', options: ['Livre', 'Chaise', 'Table', 'Stylo'], correctIndex: 0 },
        { lessonId: 1, language: 'French', word: 'Water', options: ['Eau', 'Lait', 'Jus', 'Café'], correctIndex: 0 },
    ];

    await Question.insertMany(questions);
    console.log('Questions seeded');

    console.log('Seeding complete!');
    process.exit();
};

seedData();
