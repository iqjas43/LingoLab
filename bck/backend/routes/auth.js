const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Question = require('../models/Question');
const router = express.Router();

function getLevelFromXp(xp) {
  if (xp >= 500) return 'Advanced';
  if (xp >= 200) return 'Intermediate';
  return 'Beginner';
}

// Badge Awarding System
function checkAndAwardBadges(user) {
  const newBadges = [];
  const existingBadgeIds = user.badges ? user.badges.map(b => b.id) : [];

  // Helper to award badge if not already earned
  const awardBadge = (id, name, icon) => {
    if (!existingBadgeIds.includes(id)) {
      const badge = { id, name, icon, dateEarned: new Date() };
      user.badges.push(badge);
      newBadges.push(badge);
    }
  };

  // First Lesson Badge
  if (user.lessonsCompleted === 1) {
    awardBadge('first_lesson', 'First Steps', '🎓');
  }

  // Lessons Milestone Badges
  if (user.lessonsCompleted >= 10) {
    awardBadge('lessons_10', 'Dedicated Learner', '📚');
  }
  if (user.lessonsCompleted >= 50) {
    awardBadge('lessons_50', 'Knowledge Seeker', '🧠');
  }
  if (user.lessonsCompleted >= 100) {
    awardBadge('lessons_100', 'Century Club', '💯');
  }

  // Streak Badges
  if (user.streak >= 3) {
    awardBadge('streak_3', '3 Day Streak', '🔥');
  }
  if (user.streak >= 7) {
    awardBadge('streak_7', 'Week Warrior', '⚡');
  }
  if (user.streak >= 14) {
    awardBadge('streak_14', 'Two Week Champion', '💪');
  }
  if (user.streak >= 30) {
    awardBadge('streak_30', 'Monthly Master', '👑');
  }
  if (user.streak >= 100) {
    awardBadge('streak_100', 'Unstoppable', '🚀');
  }

  // XP Milestone Badges
  if (user.xp >= 100) {
    awardBadge('xp_100', 'Rising Star', '⭐');
  }
  if (user.xp >= 250) {
    awardBadge('xp_250', 'Experience Collector', '💎');
  }
  if (user.xp >= 500) {
    awardBadge('xp_500', 'XP Legend', '🏆');
  }
  if (user.xp >= 1000) {
    awardBadge('xp_1000', 'Thousand Points', '🌟');
  }
  if (user.xp >= 2500) {
    awardBadge('xp_2500', 'Elite Learner', '👸');
  }

  // Perfect Quiz Badges
  if (user.perfectQuizzes >= 1) {
    awardBadge('perfect_1', 'Perfectionist', '✨');
  }
  if (user.perfectQuizzes >= 5) {
    awardBadge('perfect_5', 'Flawless Five', '🎯');
  }
  if (user.perfectQuizzes >= 10) {
    awardBadge('perfect_10', 'Perfect Ten', '💫');
  }

  // Level Badges
  if (user.level === 'Intermediate') {
    awardBadge('level_intermediate', 'Level Up!', '📈');
  }
  if (user.level === 'Advanced') {
    awardBadge('level_advanced', 'Advanced Achiever', '🎖️');
  }

  // Daily Goal Streak Badges
  if (user.dailyGoalStreak >= 7) {
    awardBadge('daily_goal_7', 'Goal Getter', '🎯');
  }
  if (user.dailyGoalStreak >= 30) {
    awardBadge('daily_goal_30', 'Goal Master', '🏅');
  }

  return newBadges;
}


// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, user_type } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      user_type: user_type || 'learner',
    });

    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/auth/xp
router.put('/xp', async (req, res) => {
  try {
    const { email, xpAmount, lessonsIncrement, isPerfectQuiz } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oldLevel = user.level;

    // Update XP
    if (typeof xpAmount === 'number') {
      user.xp = (user.xp || 0) + xpAmount;
      
      // Feature: Automatically award LingoCoins! (1 Coin per 10 XP)
      if (xpAmount >= 10) {
        user.lingoCoins = (user.lingoCoins || 0) + Math.floor(xpAmount / 10);
      }

      // Track daily progress
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lastReset = user.lastDailyReset ? new Date(user.lastDailyReset) : null;
      if (lastReset) {
        lastReset.setHours(0, 0, 0, 0);
      }

      // Reset daily progress if new day
      if (!lastReset || today > lastReset) {
        const previousProgress = user.dailyProgress || 0;
        const previousGoal = user.dailyGoal || 50;

        // Check if previous day's goal was met
        if (previousProgress >= previousGoal && lastReset) {
          user.dailyGoalStreak = (user.dailyGoalStreak || 0) + 1;
        } else if (lastReset) {
          user.dailyGoalStreak = 0;
        }

        user.dailyProgress = xpAmount;
        user.lastDailyReset = new Date();
      } else {
        // Same day, add to progress
        user.dailyProgress = (user.dailyProgress || 0) + xpAmount;
      }
    }

    // Update Lessons
    if (typeof lessonsIncrement === 'number') {
      user.lessonsCompleted = (user.lessonsCompleted || 0) + lessonsIncrement;
    }

    // Track perfect quizzes
    if (isPerfectQuiz) {
      user.perfectQuizzes = (user.perfectQuizzes || 0) + 1;
    }

    // Update Level
    const newLevel = getLevelFromXp(user.xp);
    const leveledUp = oldLevel !== newLevel;
    user.level = newLevel;

    // Update Streak (Only if lessonsIncrement > 0 which implies activity)
    if (lessonsIncrement > 0 || xpAmount > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lastDate = user.lastLessonDate ? new Date(user.lastLessonDate) : null;
      if (lastDate) {
        lastDate.setHours(0, 0, 0, 0);
      }

      if (!lastDate) {
        // First time
        user.streak = 1;
        user.lastLessonDate = new Date();
      } else {
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive day
          user.streak = (user.streak || 0) + 1;
          user.lastLessonDate = new Date();
        } else if (diffDays > 1) {
          // Missed a day or more
          user.streak = 1;
          user.lastLessonDate = new Date();
        }
        // If diffDays === 0 (same day), do nothing to streak
      }
    }

    // Check and award badges
    const newBadges = checkAndAwardBadges(user);

    await user.save();

    res.json({
      ...user.toObject(),
      newBadges,
      leveledUp,
      dailyGoalMet: (user.dailyProgress || 0) >= (user.dailyGoal || 50)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Abhi simple dummy token; baad me JWT laga sakte ho
    res.json({
      message: 'Login successful',
      token: 'dummy-token',
      userId: user._id,
      user_type: user.user_type || 'learner',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, phone, newPassword } = req.body;

    if (!email || !phone || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // For security, generic message, or specific if for dev convenience
      return res.status(400).json({ message: 'User not found' });
    }

    // Verify phone
    if (user.phone !== phone) {
      return res.status(400).json({ message: 'Invalid Phone Number for this account' });
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Password updated successfully. Please login.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/me?email=...
router.get('/me', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }

    const user = await User.findOne({ email }).select('name email xp lessonsCompleted level streak user_type createdAt badges dailyGoal dailyProgress dailyGoalStreak totalGamesPlayed perfectQuizzes lingoCoins purchasedItems lastDailyReset');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let userDisplay = user.toObject();
    
    // Check if daily progress needs visual reset
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastReset = user.lastDailyReset ? new Date(user.lastDailyReset) : null;
    if (lastReset) {
      lastReset.setHours(0, 0, 0, 0);
    }
    
    if (!lastReset || today > lastReset) {
      userDisplay.dailyProgress = 0;
    }

    res.json(userDisplay);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// TEMP: seed questions for Lesson 1 (run once, then you can remove this route)
router.get('/seed-lesson1', async (req, res) => {
  try {
    await Question.deleteMany({ lessonId: 1 });

    await Question.insertMany([
      {
        lessonId: 1,
        word: 'apple',
        options: ['seb', 'kela', 'aam', 'anar'],
        correctIndex: 0,
      },
      {
        lessonId: 1,
        word: 'book',
        options: ['kitab', 'kursi', 'table', 'pankha'],
        correctIndex: 0,
      },
      {
        lessonId: 1,
        word: 'water',
        options: ['chai', 'pani', 'doodh', 'lassi'],
        correctIndex: 1,
      },
    ]);

    res.json({ message: 'Lesson 1 questions seeded' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/lesson/1/questions
router.get('/lesson/:lessonId/questions', async (req, res) => {
  try {
    const lessonId = Number(req.params.lessonId);

    const questions = await Question.find({ lessonId }).select('-__v');

    if (!questions.length) {
      return res.status(404).json({ message: 'No questions found' });
    }

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET /api/auth/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ xp: -1 })
      .limit(10)
      .select('name xp level');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/badges/:email - Fetch user badges
router.get('/badges/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select('badges');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ badges: user.badges || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/daily-goal - Update daily goal
router.post('/daily-goal', async (req, res) => {
  try {
    const { email, newGoal } = req.body;

    if (!email || !newGoal) {
      return res.status(400).json({ message: 'Email and newGoal required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.dailyGoal = newGoal;
    await user.save();

    res.json({ message: 'Daily goal updated', dailyGoal: user.dailyGoal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/game-played - Track game completion
router.post('/game-played', async (req, res) => {
  try {
    const { email, xpEarned } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.totalGamesPlayed = (user.totalGamesPlayed || 0) + 1;

    if (xpEarned) {
      user.xp = (user.xp || 0) + xpEarned;
      user.dailyProgress = (user.dailyProgress || 0) + xpEarned;
    }

    const newBadges = checkAndAwardBadges(user);
    await user.save();

    res.json({
      message: 'Game recorded',
      totalGamesPlayed: user.totalGamesPlayed,
      newBadges
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/convert-xp
router.post('/convert-xp', async (req, res) => {
  try {
    const { email, xpToConvert } = req.body;
    if (!email || !xpToConvert || xpToConvert <= 0) {
      return res.status(400).json({ message: 'Email and valid xpToConvert required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.xp < xpToConvert) {
      return res.status(400).json({ message: 'Insufficient XP' });
    }

    // Conversion rate: 10 XP = 1 LingoCoin
    const coinsEarned = Math.floor(xpToConvert / 10);
    if (coinsEarned === 0) {
      return res.status(400).json({ message: 'Minimum 10 XP required to earn 1 LingoCoin' });
    }

    user.xp -= (coinsEarned * 10);
    user.lingoCoins = (user.lingoCoins || 0) + coinsEarned;
    await user.save();

    res.json({
      message: `Successfully converted ${coinsEarned * 10} XP into ${coinsEarned} LingoCoins!`,
      xp: user.xp,
      lingoCoins: user.lingoCoins
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/redeem-badge
router.post('/redeem-badge', async (req, res) => {
  try {
    const { email, badgeId } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const badgeIndex = user.badges.findIndex(b => b.id === badgeId);
    if (badgeIndex === -1) return res.status(404).json({ message: 'Badge not found' });

    if (user.badges[badgeIndex].redeemed) {
      return res.status(400).json({ message: 'Badge already redeemed' });
    }

    // Mark as redeemed and award bonus coins
    user.badges[badgeIndex].redeemed = true;
    const bonusCoins = 5; // Fixed bonus for any badge redemption
    user.lingoCoins = (user.lingoCoins || 0) + bonusCoins;

    // We need to use markModified because it's an array of objects
    user.markModified('badges');
    await user.save();

    res.json({
      message: `Badge redeemed! You got ${bonusCoins} bonus LingoCoins.`,
      lingoCoins: user.lingoCoins,
      badges: user.badges
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/buy-item
router.post('/buy-item', async (req, res) => {
  try {
    const { email, itemId, price } = req.body;
    if (!email || !itemId || !price) {
      return res.status(400).json({ message: 'Email, itemId, and price required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if ((user.lingoCoins || 0) < price) {
      return res.status(400).json({ message: 'Insufficient LingoCoins' });
    }

    if (user.purchasedItems && user.purchasedItems.includes(itemId)) {
      return res.status(400).json({ message: 'Item already purchased' });
    }

    user.lingoCoins -= price;
    if (!user.purchasedItems) user.purchasedItems = [];
    user.purchasedItems.push(itemId);

    await user.save();

    res.json({
      message: 'Purchase successful! Enjoy your reward.',
      lingoCoins: user.lingoCoins,
      purchasedItems: user.purchasedItems
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
