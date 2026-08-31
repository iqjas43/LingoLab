import React from 'react';
import Confetti from './Confetti';
import './LevelUpModal.css';

function LevelUpModal({ level, xpEarned, onClose }) {
    return (
        <div className="levelup-overlay" onClick={onClose}>
            <Confetti duration={4000} />

            <div className="levelup-modal" onClick={(e) => e.stopPropagation()}>
                <div className="levelup-icon">🎉</div>

                <h1 className="levelup-title">Level Up!</h1>

                <div className="levelup-content">
                    <div className="new-level">
                        <div className="level-label">New Level</div>
                        <div className="level-value">{level}</div>
                    </div>

                    {xpEarned > 0 && (
                        <div className="xp-earned">
                            +{xpEarned} XP
                        </div>
                    )}
                </div>

                <button className="levelup-close-btn" onClick={onClose}>
                    Continue Learning 🚀
                </button>
            </div>
        </div>
    );
}

export default LevelUpModal;
