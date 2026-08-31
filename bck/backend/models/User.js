const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false }, // Made optional for backward compatibility or can be required
  password: { type: String, required: true },
  user_type: { type: String, default: 'learner' },

  xp: { type: Number, default: 0 },
  lessonsCompleted: { type: Number, default: 0 },
  level: { type: String, default: 'Beginner' },
  selectedLanguage: { type: String, default: 'Hindi' },
  streak: { type: Number, default: 0 },
  lastLessonDate: { type: Date, default: null },
  lingoCoins: { type: Number, default: 0 },

  // Gamification Fields
  dailyGoal: { type: Number, default: 50 }, // XP goal for the day
  dailyProgress: { type: Number, default: 0 }, // XP earned today
  lastDailyDate: { type: Date, default: Date.now },
  dailyGoalStreak: { type: Number, default: 0 }, // Consecutive days meeting goal
  totalGamesPlayed: { type: Number, default: 0 },
  perfectQuizzes: { type: Number, default: 0 }, // Count of 100% quizzes
  lastDailyReset: { type: Date, default: Date.now },
  badges: [{
    id: { type: String }, // e.g., 'first_lesson', 'streak_7'
    name: { type: String },
    dateEarned: { type: Date, default: Date.now },
    icon: { type: String } // emoji or url
  }],
  purchasedItems: [{ type: String }] // IDs of items bought in shop
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
