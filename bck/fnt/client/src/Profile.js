import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import BadgeDisplay from './BadgeDisplay';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://lingolab-production.up.railway.app';

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [badges, setBadges] = useState([]);
    const navigate = useNavigate();
    const email = localStorage.getItem('userEmail');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    const handleConvertXP = async () => {
        if (!user || user.xp < 10) {
            alert("At least 10 XP required to convert!");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/convert-xp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, xpToConvert: 10 })
            });
            const data = await res.json();
            if (res.ok) {
                setUser({ ...user, xp: data.xp, lingoCoins: data.lingoCoins });
                alert(data.message);
            } else {
                alert(data.message || "Conversion failed");
            }
        } catch (err) {
            console.error(err);
            alert("Error converting XP");
        }
    };

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/auth/me?email=${email}&t=${Date.now()}`);
                const data = await res.json();
                if (res.ok) {
                    setUser(data);
                    setBadges(data.badges || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if (email) fetchUser();
        else {
            navigate('/login');
        }
    }, [email, navigate]);

    if (loading) return <div className="loading-screen">Loading Profile...</div>;
    if (!user) return <div className="error-screen">User not found</div>;

    return (
        <div className="profile-container">
            {showLogoutConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Sign Out</h3>
                        <p>Are you sure you want to sign out?</p>
                        <div className="modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => setShowLogoutConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-confirm-logout"
                                onClick={handleLogout}
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="profile-card">
                <div className="profile-header">
                    <div className={`profile-avatar ${user.purchasedItems?.includes('golden_frame') ? 'golden-frame' : ''}`}>
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                        <h1>{user.name}</h1>
                        <p className="profile-email">{user.email}</p>
                        <span className="profile-badge">{user.level || 'Beginner'}</span>
                    </div>
                </div>

                <div className="profile-stats">
                    <div className="stat-box">
                        <span className="stat-icon">🔥</span>
                        <div className="stat-text">
                            <label>Streak</label>
                            <h3>{user.streak || 0} Days</h3>
                        </div>
                    </div>

                    <div className="stat-box">
                        <span className="stat-icon">⚡</span>
                        <div className="stat-text">
                            <label>Total XP</label>
                            <h3>{user.xp || 0}</h3>
                        </div>
                    </div>

                    <div className="stat-box coins-box">
                        <span className="stat-icon">🪙</span>
                        <div className="stat-text">
                            <label>LingoCoins</label>
                            <h3>{user.lingoCoins || 0}</h3>
                        </div>
                        <button className="btn-convert" onClick={handleConvertXP} title="Convert 10 XP to 1 Coin">
                            🔄
                        </button>
                    </div>

                    <div className="shop-link-box">
                        <button className="btn-shop" onClick={() => navigate('/rewards')}>
                            🛒 Visit Rewards Shop
                        </button>
                    </div>

                    <div className="stat-box">
                        <span className="stat-icon">📚</span>
                        <div className="stat-text">
                            <label>Lessons</label>
                            <h3>{user.lessonsCompleted || 0}</h3>
                        </div>
                    </div>
                </div>

                {/* Badge Collection */}
                <div className="profile-badges">
                    <h2>Badge Collection 🏆</h2>

                    {badges.length > 0 ? (
                        <div className="badge-grid">
                            {badges.map((badge, idx) => (
                                <BadgeDisplay key={idx} badge={badge} size="small" />
                            ))}
                        </div>
                    ) : (
                        <div className="no-badges">
                            <p>No badges earned yet. Complete lessons to earn badges!</p>
                        </div>
                    )}
                </div>

                <div className="profile-details">
                    <h2>Account Details</h2>
                    <div className="detail-row">
                        <span>User Type</span>
                        <span className="detail-value">{user.user_type || 'learner'}</span>
                    </div>
                    <div className="detail-row">
                        <span>Joined</span>
                        <span className="detail-value">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>

                    <button className="btn-logout" onClick={() => setShowLogoutConfirm(true)}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;