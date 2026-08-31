import React from 'react';
import './DailyGoalWidget.css';

function DailyGoalWidget({ dailyProgress = 0, dailyGoal = 50, onGoalEdit }) {
    const progressPercentage = Math.min((dailyProgress / dailyGoal) * 100, 100);
    const goalMet = dailyProgress >= dailyGoal;

    return (
        <div className={`daily-goal-widget ${goalMet ? 'goal-met' : ''}`}>
            <div className="goal-header">
                <div className="goal-title">
                    <span className="goal-icon">🎯</span>
                    <span>Daily Goal</span>
                </div>
                {onGoalEdit && (
                    <button className="goal-edit-btn" onClick={onGoalEdit} title="Edit goal">
                        ⚙️
                    </button>
                )}
            </div>

            <div className="goal-progress-container">
                <svg className="goal-circle" viewBox="0 0 120 120">
                    {/* Background Circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="8"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke={goalMet ? '#10b981' : '#3b82f6'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 54}`}
                        strokeDashoffset={`${2 * Math.PI * 54 * (1 - progressPercentage / 100)}`}
                        transform="rotate(-90 60 60)"
                        className="progress-circle"
                    />
                </svg>

                <div className="goal-stats">
                    <div className="goal-xp">
                        <span className="xp-current">{dailyProgress}</span>
                        <span className="xp-separator">/</span>
                        <span className="xp-goal">{dailyGoal}</span>
                    </div>
                    <div className="goal-label">XP Today</div>
                </div>
            </div>

            {goalMet && (
                <div className="goal-met-badge">
                    ✨ Goal Reached! ✨
                </div>
            )}

            <div className="goal-motivator">
                {goalMet
                    ? "Amazing! Keep up the streak! 🔥"
                    : `${dailyGoal - dailyProgress} XP to go! 💪`
                }
            </div>
        </div>
    );
}

export default DailyGoalWidget;
