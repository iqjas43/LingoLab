// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courseRoutes');
const quizRoutes = require('./routes/quizRoutes');
const progressRoutes = require('./routes/progressRoutes');
const grammarRoutes = require('./routes/grammarRoutes');

const app = express();

// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connect
connectDB();

// Root route
app.get('/', (req, res) => {
  res.send('Backend running');
});

// --- API Routes ---
app.use('/api/auth', authRoutes);

// Custom inline route moved BEFORE or handled properly so it doesn't conflict
app.get('/api/courses/module1', (req, res) => {
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
app.use('/api/progress', progressRoutes);
app.use('/api/grammar', grammarRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
});