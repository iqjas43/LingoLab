import React from 'react';
import './BadgeDisplay.css';

function BadgeDisplay({ badge, locked = false, size = 'medium' }) {
    if (locked) {
        return (
            <div className={`badge-item locked ${size}`}>
                <div className="badge-icon locked-icon">🔒</div>
                <div className="badge-info">
                    <div className="badge-name">???</div>
                    <div className="badge-hint">Keep learning to unlock!</div>
                </div>
            </div>
        );
    }

    const dateEarned = badge.dateEarned
        ? new Date(badge.dateEarned).toLocaleDateString()
        : 'Just Now';

    return (
        <div className={`badge-item earned ${size}`} title={`Earned on ${dateEarned}`}>
            <div className="badge-icon">{badge.icon || '🏆'}</div>
            <div className="badge-info">
                <div className="badge-name">{badge.name}</div>
                <div className="badge-date">{dateEarned}</div>
            </div>
        </div>
    );
}

export default BadgeDisplay;
