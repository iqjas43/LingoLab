// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courseRoutes');
const quizRoutes = require('./routes/quizRoutes');

const app = express();

// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connect
connectDB();

// Routes
app.use('/api/auth', authRoutes);

app.get('/api/courses/module1', (req, res) => {
  // Provide mock data so the Module1Flashcards component works
  res.json({
    content: {
        pattern: {
            description: 'Basic Greetings & Introductions',
            examples: [
                { english: 'Hello', hindi: 'नमस्ते' },
                { english: 'Good Morning', hindi: 'शुभ प्रभात' },
                { english: 'My name is...', hindi: 'मेरा नाम ... है' }
            ]
        },
        questions: [
            { english: 'What is your name?', hindi: 'आपका नाम क्या है?' },
            { english: 'How are you?', hindi: 'आप कैसे हैं?' }
        ],
        ritualGreetings: [
            { english: 'Thank you', hindi: 'धन्यवाद' },
            { english: 'See you later', hindi: 'फिर मिलेंगे' }
        ]
    }
  });
});

app.use('/api/courses', courseRoutes);
app.use('/api/quiz', quizRoutes);

app.get('/', (req, res) => {
  res.send('Backend running');
});

const progressRoutes = require('./routes/progressRoutes');
app.use('/api/progress', progressRoutes);

const grammarRoutes = require('./routes/grammarRoutes');
app.use('/api/grammar', grammarRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
