import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Confetti from './Confetti';
import CoinBalance from './CoinBalance';
import './RewardsShop.css';

const SHOP_ITEMS = [
    { id: 'golden_frame', name: 'Golden Frame', price: 50, icon: '🖼️', description: 'Show off with a royal golden avatar border.' },
    { id: 'streak_freeze', name: 'Streak Freeze', price: 100, icon: '🧊', description: 'Protect your streak for one day if you miss a lesson.' },
    { id: 'diamond_badge', name: 'Diamond Badge', price: 200, icon: '💎', description: 'An exclusive badge for elite collectors.' },
    { id: 'premium_theme', name: 'Night Owl Theme', price: 300, icon: '🦉', description: 'Unlock a special dark mode theme variant.' },
    { id: 'double_xp', name: 'XP Booster', price: 150, icon: '🚀', description: 'Double XP for the next 30 minutes.' },
];

function RewardsShop() {
    const navigate = useNavigate();
    const { user, setUser, fetchUser } = useOutletContext();
    const [purchasing, setPurchasing] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (fetchUser) {
            fetchUser();
        }
    }, []);

    const handleBuy = async (item) => {
        if (!user) return;
        if ((user.lingoCoins || 0) < item.price) {
            alert("Insufficient LingoCoins!");
            return;
        }

        if (user.purchasedItems?.includes(item.id)) {
            alert("You already own this item!");
            return;
        }

        setPurchasing(item.id);
        setShowConfetti(false);
        try {
            const res = await fetch('http://localhost:3000/api/auth/buy-item', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, itemId: item.id, price: item.price })
            });
            const data = await res.json();
            if (res.ok) {
                setUser({ ...user, lingoCoins: data.lingoCoins, purchasedItems: data.purchasedItems });
                setShowConfetti(true);
            } else {
                alert(data.message || "Purchase failed");
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to shop");
        } finally {
            setPurchasing(null);
        }
    };

    return (
        <div className="shop-container">
            {showConfetti && <Confetti duration={4000} />}
            <header className="shop-header">
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
                <div className="header-title">
                    <h1>Rewards Shop 🛍️</h1>
                    <p>Spend your LingoCoins on exclusive items!</p>
                </div>
                <CoinBalance lingoCoins={user?.lingoCoins || 0} />
            </header>

            <div className="shop-grid">
                {SHOP_ITEMS.map((item) => {
                    const isOwned = user?.purchasedItems?.includes(item.id);
                    return (
                        <div key={item.id} className={`shop-card ${isOwned ? 'owned' : ''}`}>
                            <div className="item-icon-box">
                                <span className="item-icon">{item.icon}</span>
                            </div>
                            <div className="item-info">
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                            </div>
                            <div className="item-footer">
                                <div className="item-price">
                                    <span className="coin-icon">🪙</span>
                                    <span>{item.price}</span>
                                </div>
                                <button
                                    className={`buy-btn ${isOwned ? 'btn-owned' : ''}`}
                                    onClick={() => handleBuy(item)}
                                    disabled={purchasing === item.id || isOwned}
                                >
                                    {isOwned ? 'Owned' : purchasing === item.id ? 'Buying...' : 'Buy Now'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default RewardsShop;
