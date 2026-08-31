import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GameLauncher.css';

function GameLauncher() {
    const navigate = useNavigate();

    const games = [
        {
            id: 'matching',
            title: 'Matching Game',
            icon: '🎴',
            description: 'Match words with their translations',
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            route: '/games/matching'
        },
        {
            id: 'fill-blank',
            title: 'Fill in the Blank',
            icon: '✍️',
            description: 'Complete sentences with missing words',
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            route: '/games/fill-blank'
        },
        {
            id: 'sentence',
            title: 'Sentence Builder',
            icon: '🔤',
            description: 'Build sentences in the correct order',
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            route: '/games/sentence'
        },
        {
            id: 'flashcards',
            title: 'Flashcards',
            icon: '🃏',
            description: 'Review vocabulary with flashcards',
            color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            route: '/games/flashcards'
        }
    ];

    return (
        <div className="game-launcher-container">
            <div className="launcher-header">
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </button>
                <div className="launcher-title">
                    <h1>🎮 Learning Games</h1>
                    <p>Practice your language skills with fun interactive games!</p>
                </div>
            </div>

            <div className="games-grid">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className="game-card"
                        style={{ background: game.color }}
                        onClick={() => navigate(game.route)}
                    >
                        <div className="game-icon">{game.icon}</div>
                        <h3 className="game-title">{game.title}</h3>
                        <p className="game-description">{game.description}</p>
                        <button className="play-button">Play Now →</button>
                    </div>
                ))}
            </div>

            <div className="games-info">
                <div className="info-card">
                    <div className="info-icon">⭐</div>
                    <div className="info-text">
                        <h4>Earn XP</h4>
                        <p>Complete games to earn experience points</p>
                    </div>
                </div>
                <div className="info-card">
                    <div className="info-icon">🏆</div>
                    <div className="info-text">
                        <h4>Unlock Badges</h4>
                        <p>Earn badges for your achievements</p>
                    </div>
                </div>
                <div className="info-card">
                    <div className="info-icon">📈</div>
                    <div className="info-text">
                        <h4>Track Progress</h4>
                        <p>See your improvement over time</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameLauncher;
