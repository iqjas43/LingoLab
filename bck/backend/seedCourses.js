const mongoose = require('mongoose');
const Course = require('./models/Course');
const Module = require('./models/Module');
const Lesson = require('./models/Lesson');

const seedCourses = async () => {
    try {
        // 1. Clear existing data
        await Course.deleteMany({});
        await Module.deleteMany({});
        await Lesson.deleteMany({});
        console.log('🗑️  Existing data cleared.');

        const courseData = [
            {
                name: 'Hindi for Beginners',
                language: 'Hindi',
                courseId: 101,
                levels: [
                    {
                        name: 'A1',
                        modules: [
                            {
                                title: 'Greetings (नमस्ते)',
                                description: 'Learn basic Hindi greetings and polite expressions.',
                                order: 1,
                                lessons: [
                                    { title: 'Common Greetings', type: 'Vocab', content: { vocabulary: [{ word: 'नमस्ते', translation: 'Hello' }, { word: 'शुभ प्रभात', translation: 'Good Morning' }, { word: 'शुभ रात्रि', translation: 'Good Night' }] } },
                                    { title: 'Ritual Greetings', type: 'Vocab', content: { vocabulary: [{ word: 'आप कैसे हैं?', translation: 'How are you?' }, { word: 'मैं ठीक हूँ', translation: 'I am fine' }, { word: 'धन्यवाद', translation: 'Thank you' }] } }
                                ]
                            },
                            {
                                title: 'Introduction (परिचय)',
                                description: 'Tell others who you are and where you are from.',
                                order: 2,
                                lessons: [
                                    { title: 'Name Patterns', type: 'Pattern', content: { pattern: { description: 'Asking and giving names.', examples: [{ hindi: 'मेरा नाम राहुल है', english: 'My name is Rahul' }, { hindi: 'आपका नाम क्या है?', english: 'What is your name?' }] } } },
                                    { title: 'Daily Expressions', type: 'Vocab', content: { vocabulary: [{ word: 'हाँ', translation: 'Yes' }, { word: 'नहीं', translation: 'No' }, { word: 'शायद', translation: 'Maybe' }] } }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: 'English for Beginners',
                language: 'English',
                courseId: 102,
                levels: [
                    {
                        name: 'A1',
                        modules: [
                            {
                                title: 'Basics & Hello',
                                description: 'Standard English greetings and simple self-introduction.',
                                order: 1,
                                lessons: [
                                    { title: 'Greetings', type: 'Vocab', content: { vocabulary: [{ word: 'Hello', translation: 'नमस्ते' }, { word: 'Hi', translation: 'नमस्ते (casual)' }, { word: 'Welcome', translation: 'स्वागत है' }] } },
                                    { title: 'Questions', type: 'Vocab', content: { vocabulary: [{ word: 'How are you?', translation: 'आप कैसे हैं?' }, { word: 'What is this?', translation: 'यह क्या है?' }] } }
                                ]
                            },
                            {
                                title: 'Family & Home',
                                description: 'Learn to talk about your family and house.',
                                order: 2,
                                lessons: [
                                    { title: 'Family Members', type: 'Vocab', content: { vocabulary: [{ word: 'Mother', translation: 'माँ' }, { word: 'Father', translation: 'पिता' }, { word: 'Brother', translation: 'भाई' }, { word: 'Sister', translation: 'बहन' }] } },
                                    { title: 'Possessives', type: 'Pattern', content: { pattern: { description: 'My and Your.', examples: [{ hindi: 'This is my house', english: 'यह मेरा घर है' }, { hindi: 'Where is your key?', english: 'तुम्हारी चाबी कहाँ है?' }] } } }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Spanish for Beginners',
                language: 'Spanish',
                courseId: 103,
                levels: [
                    {
                        name: 'A1',
                        modules: [
                            {
                                title: '¡Hola! Basics',
                                description: 'Start your Spanish journey with basic greetings.',
                                order: 1,
                                lessons: [
                                    { title: 'Salutations', type: 'Vocab', content: { vocabulary: [{ word: 'Hola', translation: 'Hello' }, { word: 'Buenos días', translation: 'Good morning' }, { word: 'Buenas noches', translation: 'Good night' }] } },
                                    { title: 'Politeness', type: 'Vocab', content: { vocabulary: [{ word: 'Gracias', translation: 'Thank you' }, { word: 'De nada', translation: 'You are welcome' }, { word: 'Por favor', translation: 'Please' }] } }
                                ]
                            },
                            {
                                title: 'Comida (Food)',
                                description: 'Common food items and restaurant essentials.',
                                order: 2,
                                lessons: [
                                    { title: 'Basic Food', type: 'Vocab', content: { vocabulary: [{ word: 'Agua', translation: 'Water' }, { word: 'Pan', translation: 'Bread' }, { word: 'Leche', translation: 'Milk' }, { word: 'Fruta', translation: 'Fruit' }] } },
                                    { title: 'Ordering', type: 'Pattern', content: { pattern: { description: 'Ordering politely.', examples: [{ hindi: 'Un café, por favor', english: 'A coffee, please' }, { hindi: 'La cuenta, por favor', english: 'The bill, please' }] } } }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: 'French for Beginners',
                language: 'French',
                courseId: 104,
                levels: [
                    {
                        name: 'A1',
                        modules: [
                            {
                                title: 'Bonjour Paris',
                                description: 'Learn essential French for your first trip.',
                                order: 1,
                                lessons: [
                                    { title: 'Basics', type: 'Vocab', content: { vocabulary: [{ word: 'Bonjour', translation: 'Hello' }, { word: 'Salut', translation: 'Hi/Bye' }, { word: 'Merci', translation: 'Thank you' }] } },
                                    { title: 'Courtesy', type: 'Vocab', content: { vocabulary: [{ word: 'S\'il vous plaît', translation: 'Please' }, { word: 'De rien', translation: 'You are welcome' }] } }
                                ]
                            },
                            {
                                title: 'Nombres (Numbers)',
                                description: 'Learn to count in French.',
                                order: 2,
                                lessons: [
                                    { title: 'Numbers 1-5', type: 'Vocab', content: { vocabulary: [{ word: 'Un', translation: 'One' }, { word: 'Deux', translation: 'Two' }, { word: 'Trois', translation: 'Three' }, { word: 'Quatre', translation: 'Four' }, { word: 'Cinq', translation: 'Five' }] } }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Japanese for Beginners',
                language: 'Japanese',
                courseId: 105,
                levels: [
                    {
                        name: 'A1',
                        modules: [
                            {
                                title: 'Introduction to Japan',
                                description: 'Learn Hiragana basics and standard greetings.',
                                order: 1,
                                lessons: [
                                    { title: 'Aisatsu (Greetings)', type: 'Vocab', content: { vocabulary: [{ word: 'こんにちは', translation: 'Hello' }, { word: 'おはよう', translation: 'Good Morning' }, { word: 'おやすみ', translation: 'Good Night' }] } },
                                    { title: 'Politeness', type: 'Vocab', content: { vocabulary: [{ word: 'ありがとうございます', translation: 'Thank you' }, { word: 'すみません', translation: 'Excuse me' }] } }
                                ]
                            },
                            {
                                title: 'Hiragana Vowels',
                                description: 'The foundation of Japanese writing.',
                                order: 2,
                                lessons: [
                                    { title: 'The 5 Vowels', type: 'Vocab', content: { vocabulary: [{ word: 'あ (a)', translation: 'a' }, { word: 'い (i)', translation: 'i' }, { word: 'う (u)', translation: 'u' }, { word: 'え (e)', translation: 'e' }, { word: 'お (o)', translation: 'o' }] } }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        for (const c of courseData) {
            const course = new Course({
                name: c.name,
                language: c.language,
                courseId: c.courseId,
                description: `Master ${c.language} from scratch.`,
                levels: []
            });

            for (const levelData of c.levels) {
                const levelObj = { name: levelData.name, modules: [] };

                for (const modData of levelData.modules) {
                    const module = new Module({
                        title: modData.title,
                        description: modData.description,
                        level: 'A1',
                        order: modData.order,
                        lessons: []
                    });

                    for (let i = 0; i < modData.lessons.length; i++) {
                        const lessonData = modData.lessons[i];
                        const lesson = new Lesson({
                            title: lessonData.title,
                            type: lessonData.type,
                            content: lessonData.content,
                            moduleId: module._id,
                            order: i + 1
                        });
                        await lesson.save();
                        module.lessons.push(lesson._id);
                    }

                    await module.save();
                    levelObj.modules.push(module._id);
                }
                course.levels.push(levelObj);
            }
            await course.save();
            console.log(`✅  Seeded Course: ${c.language}`);
        }

        console.log('🚀 Seeding complete!');
    } catch (err) {
        console.error('❌ Seeding error:', err);
    }
};

module.exports = seedCourses;
