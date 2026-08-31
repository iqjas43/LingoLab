import React, { useEffect, useState } from 'react';
import './AchievementToast.css';

function AchievementToast({ badge, onClose }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger animation
        setTimeout(() => setVisible(true), 100);

        // Auto-dismiss after 4 seconds
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); //Wait for fadeout animation
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!badge) return null;

    return (
        <div className={`achievement-toast ${visible ? 'visible' : ''}`}>
            <div className="toast-shine"></div>
            <div className="toast-content">
                <div className="toast-icon">{badge.icon || '🏆'}</div>
                <div className="toast-text">
                    <div className="toast-title">Achievement Unlocked!</div>
                    <div className="toast-badge-name">{badge.name}</div>
                </div>
            </div>
            <button className="toast-close" onClick={() => {
                setVisible(false);
                setTimeout(onClose, 300);
            }}>
                ✕
            </button>
        </div>
    );
}

export default AchievementToast;
