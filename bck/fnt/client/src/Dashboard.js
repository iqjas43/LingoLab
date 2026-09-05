import { apiFetch } from './api';
import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import './Dashboard.css';
import BadgeDisplay from './BadgeDisplay';
import AchievementToast from './AchievementToast';
import DailyGoalWidget from './DailyGoalWidget';
import LevelUpModal from './LevelUpModal';

function Dashboard() {
  const navigate = useNavigate();
  // Consume data from Layout
  const { user, fetchUser, courses, selectedCourseId, handleCourseChange, currentCourse } = useOutletContext();

  // Refresh user data whenever Dashboard mounts
  useEffect(() => {
    if (fetchUser) {
      fetchUser();
    }
  }, [fetchUser]);

  // Local state for progress
  const [progress, setProgress] = useState(null);

  // Gamification state
  const [newBadges, setNewBadges] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState(null);
  const [recentBadges, setRecentBadges] = useState([]);

  const userId = user?._id || user?.id;

  // Fetch progress when user or course changes
  useEffect(() => {
    if (userId && selectedCourseId) {
      apiFetch(`/api/progress/${userId}/${selectedCourseId}`)
        .then(res => res.json())
        .then(data => setProgress(data))
        .catch(err => console.error("Failed to fetch progress:", err));
    }
  }, [userId, selectedCourseId]);

  // Fetch recent badges
  useEffect(() => {
    if (user && user.email) {
      apiFetch(`/api/auth/badges/${user.email}`)
        .then(res => res.json())
        .then(data => {
          const badges = data.badges || [];
          setRecentBadges(badges.slice(-3).reverse());
        })
        .catch(err => console.error("Failed to fetch badges:", err));
    }
  }, [user]);

  if (!user) return <div className="loading-screen">Loading...</div>;

  const userXP = user.xp || 0;
  const totalLessonsFinished = user.lessonsCompleted || 0;

  // Robust ID extraction for completed items and modules
  const completedIds = progress?.completedLessons?.map(l => l._id || l.id || l) || progress?.completedUnits || [];
  const unlockedModuleIds = progress?.unlockedModules?.map(m => m._id || m.id || m) || [];

  const displayItems = currentCourse?.levels && currentCourse.levels.length > 0
    ? currentCourse.levels.flatMap(lvl => (lvl.modules || []).map((m) => ({
        unitId: m._id || m.id,
        title: m.title,
        description: m.description,
        color: m.isCheckpoint ? '#ef4444' : '#3b82f6',
        isModule: true,
        levelName: lvl.name
      })))
    : (currentCourse?.units || []).map(u => ({ ...u, unitId: u._id || u.id || u.unitId }));

  let progressPercent = 0;
  if (displayItems.length > 0) {
    progressPercent = Math.round((completedIds.length / displayItems.length) * 100);
    if (progressPercent > 100) progressPercent = 100;
  }

  return (
    <div className="dashboard-content-wrapper">
      {/* Top Header */}
      <header className="dashboard-header">
        <div className="header-greeting">
          <h1>Welcome back, {user.name || 'Learner'}! 👋</h1>
          <p>Ready to learn something new today?</p>
        </div>

        <div className="header-actions">
          <div className="course-selector-wrapper">
            <span className="selector-label">Current Course:</span>
            <div className="selector-with-flag" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {currentCourse && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,1)', padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '20px' }}>
                    {currentCourse.language === 'Hindi' ? '🇮🇳' :
                      currentCourse.language === 'English' ? '🇺🇸' :
                        currentCourse.language === 'Spanish' ? '🇪🇸' :
                          currentCourse.language === 'French' ? '🇫🇷' :
                            currentCourse.language === 'Japanese' ? '🇯🇵' : '🌍'}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                    {currentCourse.language || currentCourse.name}
                  </span>
                </div>
              )}
              <select
                className="course-selector"
                value={selectedCourseId || ''}
                onChange={handleCourseChange}
                style={{ appearance: 'none', background: '#fff', border: '1px solid #e2e8f0', color: '#334155', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
              >
                <option value="" disabled>Select Language</option>
                {courses.map(c => {
                  const cId = c.courseId || c._id;
                  return (
                    <option key={cId} value={cId}>
                      {c.language === 'Hindi' ? '🇮🇳 ' :
                        c.language === 'English' ? '🇺🇸 ' :
                          c.language === 'Spanish' ? '🇪🇸 ' :
                            c.language === 'French' ? '🇫🇷 ' :
                              c.language === 'Japanese' ? '🇯🇵 ' : ''}
                      {c.language || c.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="streak-badge">
            🔥 {user.streak || 0} Day Streak
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      {!selectedCourseId ? (
        <div className="empty-state">
          <div className="empty-icon">🌍</div>
          <h2>Start your journey</h2>
          <p>Select a language course from the top right to begin learning.</p>
        </div>
      ) : (
        <div className="dashboard-content">

          {/* Daily Goal Section */}
          <div className="daily-goal-section">
            <DailyGoalWidget
              dailyProgress={user.dailyProgress || 0}
              dailyGoal={user.dailyGoal || 50}
            />
          </div>

          {/* Recent Badges */}
          {recentBadges.length > 0 && (
            <div className="recent-badges-section">
              <h2 className="section-title">Recent Achievements 🏆</h2>
              <div className="badges-carousel">
                {recentBadges.map((badge, idx) => (
                  <BadgeDisplay key={idx} badge={badge} size="medium" />
                ))}
              </div>
            </div>
          )}

          {/* Quick Games Access */}
          <div className="quick-games-section">
            <h2 className="section-title">Practice & Play 🎮</h2>
            <div className="quick-games-grid">
              <div className="quick-game-card" onClick={() => navigate('/games/matching')}>
                <div className="game-icon">🎴</div>
                <h4>Matching</h4>
              </div>
              <div className="quick-game-card" onClick={() => navigate('/games/fill-blank')}>
                <div className="game-icon">✍️</div>
                <h4>Fill Blank</h4>
              </div>
              <div className="quick-game-card" onClick={() => navigate('/games/sentence')}>
                <div className="game-icon">🔤</div>
                <h4>Sentences</h4>
              </div>
              <div className="quick-game-card" onClick={() => navigate('/games/flashcards')}>
                <div className="game-icon">🃏</div>
                <h4>Flashcards</h4>
              </div>
              <div className="quick-game-card reference-card" onClick={() => navigate('/library')}>
                <div className="game-icon">📚</div>
                <h4>Library</h4>
              </div>
              <div className="quick-game-card" style={{ border: '2px dashed #ec4899' }} onClick={() => navigate('/module1')}>
                <div className="game-icon">✨</div>
                <h4>Module 1</h4>
              </div>
            </div>
          </div>

          {/* Stats Band */}
          <div className="stats-band">
            <div className="stat-card xp-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <label>Total XP</label>
                <h3>{userXP}</h3>
              </div>
            </div>

            <div className="stat-card level-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <label>Total Lessons</label>
                <h3>{totalLessonsFinished}</h3>
              </div>
            </div>

            <div className="stat-card progress-card-wide">
              <div className="progress-header">
                <span>Course Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
              {progressPercent}% completed
            </div>
          </div>

          {/* Learning Path */}
          <h2 className="section-title">Your Learning Path</h2>

          <div className="learning-path">
            {displayItems.length > 0 ? (
              displayItems.map((unit, index) => {
                const isCompleted = completedIds.includes(unit.unitId);

                let isLocked = false;
                if (unit.isModule) {
                  isLocked = index > 0 && !unlockedModuleIds.includes(unit.unitId);
                } else if (index > 0) {
                  const prevUnitId = displayItems[index - 1].unitId;
                  if (!completedIds.includes(prevUnitId)) {
                    isLocked = true;
                  }
                }

                const isCurrent = !isLocked && !isCompleted;

                return (
                  <div
                    key={unit.unitId || index}
                    className={`unit-card ${isLocked ? 'locked' : ''} ${isCurrent ? 'current' : ''}`}
                    style={{ '--unit-color': unit.color || '#3b82f6' }}
                  >
                    <div className="unit-header" style={{ backgroundColor: unit.color || '#3b82f6' }}>
                      <span className="unit-number">
                        {unit.isModule ? `${unit.levelName} - MODULE ${index + 1}` : `UNIT ${unit.unitId}`}
                      </span>
                      {isCompleted && <span className="unit-status">✅</span>}
                    </div>
                    <div className="unit-body">
                      <h3>{unit.title}</h3>
                      <p>{unit.description}</p>

                      <div className="unit-actions">
                        {isLocked ? (
                          <button className="btn-locked">🔒 Locked</button>
                        ) : (
                          <>
                            <button
                              className="btn-start"
                              onClick={() => navigate(unit.isModule ? `/module-view/${unit.unitId}` : `/lesson/${unit.unitId}`)}
                            >
                              {isCompleted ? 'PRACTICE' : 'START'}
                            </button>
                            {!unit.isModule && (
                              <>
                                <button
                                  className="btn-book"
                                  onClick={() => navigate(`/quiz/${unit.unitId}?lang=${currentCourse?.language || ''}`)}
                                >
                                  📖 QUIZ
                                </button>
                                <button
                                  className="btn-grammar"
                                  onClick={() => navigate(`/grammar/${unit.unitId}`)}
                                >
                                  📚 GRAMMAR
                                </button>
                                <button
                                  className="btn-library"
                                  onClick={() => navigate(`/library?tab=summaries`)}
                                >
                                  📖 REVIEW
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="loading-state">Loading Units...</div>
            )}
          </div>
        </div>
      )}

      {/* Achievement Notifications */}
      {newBadges.map((badge, idx) => (
        <AchievementToast
          key={idx}
          badge={badge}
          onClose={() => setNewBadges(prev => prev.filter((_, i) => i !== idx))}
        />
      ))}

      {/* Level Up Modal */}
      {showLevelUp && levelUpData && (
        <LevelUpModal
          level={levelUpData.level}
          xpEarned={levelUpData.xpEarned}
          onClose={() => setShowLevelUp(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;